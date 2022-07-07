import {CONFIG} from "./account";
import {addBigNum, divBigNum, subBigNum} from "./utils";
import {apiDb} from "../db/LiteDb";
import {getProtocolParams, getTxUTxOsByAddress, IAccountState, submitTxBlockfrost} from "../api/Blockfrost";
import {decryptData} from "./cryptoLib";
import {
    Address,
    AssetName,
    Assets,
    BigNum,
    Bip32PrivateKey, hash_transaction,
    LinearFee, make_vkey_witness,
    MultiAsset, ScriptHash, Transaction,
    TransactionBuilder, TransactionHash, TransactionInput, TransactionOutput, TransactionWitnessSet,
    Value, Vkeywitnesses
} from "@emurgo/react-native-haskell-shelley";
import BigNumber from "bignumber.js";
import {groupBy} from "../utils";
import {BLOCKFROST_SUMBIT_TESTNET, DANDELION_URL_TESTNET, TX} from "../constants/tx";
import {submitTransaction} from "../api/graphql/queries";
export const RECEIVE_TX = 'RECEIVE_TX';
export const SEND_TX = 'SEND_TX';
export const SELF_TX = 'SELF_TX';

export const classifyTx = async (transaction, accountAddresses) => {

    const block_time = transaction.block_time;
    const fees = transaction.fees;
    const txHash = transaction.tx_hash;
    const inputs = transaction.utxos.inputs;
    const outputs = transaction.utxos.outputs;

    const accInInputs = addressInCommon(inputs, accountAddresses);
    const accInOutputs = addressInCommon(outputs, accountAddresses);

    let txType = SELF_TX;
    if (!accInInputs && accInOutputs) {
        txType = RECEIVE_TX;
    } else if (accInInputs && !accInOutputs) {
        txType = SEND_TX;
    } else if (accInInputs && accInOutputs) {
        const othersInInputs = containOtherAddresses(inputs, accountAddresses);
        if (!othersInInputs) {
            txType = SEND_TX;
        }
    }

    const processedIn = processInputs(inputs, accountAddresses);
    const processedOut = processOutputs(outputs, accountAddresses);

    const usedInInputs = processedIn.usedAddresses;
    const usedInOutputs = processedOut.usedAddresses;
    const otherInOutputs = processedOut.otherAddresses;

    switch (txType) {
        case SEND_TX:
            let amountOutputList = [];
            let amountInputList = [];

            usedInInputs.map(ioutput => {
                amountInputList = [...amountInputList, ...ioutput.amount]
            });

            otherInOutputs.map(uoutput => {
                amountOutputList = [...amountOutputList, ...uoutput.amount]
            });

            const mergedOutputsAmount = await mergeAmounts(amountOutputList);

            return {
                txHash,
                blockTime: block_time,
                inputs: processedIn,
                outputs: processedOut,
                amount: mergedOutputsAmount,
                fees,
                type: txType
            }

        case RECEIVE_TX:
            let amountOutputs = [];
            usedInOutputs.map(uoutput => {
                amountOutputs = [...amountOutputs, ...uoutput.amount]
            });
            const mergedOutputs = await mergeAmounts(amountOutputs);
            return {
                txHash,
                blockTime: block_time,
                inputs: processedIn,
                outputs: processedOut,
                amount: mergedOutputs,
                fees,
                type: txType
            }
        default:
            return {
                txHash,
                blockTime: block_time,
                inputs: processedIn,
                outputs: processedOut,
                amount: {},
                fees,
                type: txType
            }
    }
};
export const diffAmounts = async (amount1, amount2) => {

    let amountDict: { [unit: string]: number } = {};
    await Promise.all(
        Object.keys(amount1).map(async unit => {
            if ((unit in amount2)){
                amountDict[unit] =
                    amountDict[unit] = await subBigNum(amount1[unit], amount2[unit],);

            } else {
                amountDict[unit] = amount1[unit];
            }
        })
    );

    return amountDict;
}
export const mergeAmounts = async (amounts) => {
    let amountDict: { [unit: string]: number } = {};

    await Promise.all(
        amounts.map(async amount => {
            if (amountDict[amount.unit] === undefined) {
                amountDict[amount.unit] = amount.quantity;
            } else {
                amountDict[amount.unit] = await addBigNum(amountDict[amount.unit], amount.quantity);
            }
        })
    );

    return amountDict;
}
export const processInputs = (inputs, allAddresses) => {
    let usedAddresses: { amount: string; address: string; }[] = [];
    let otherAddresses: { amount: string; address: string; }[] = [];
    inputs.map(input => {
        const amount = input.amount;
        const address = input.address;
        let inputFromAccount = false;
        allAddresses.map(addr => {
            if (addr.address === address){
                inputFromAccount = true;
            }
        });

        if (inputFromAccount){
            usedAddresses.push({amount, address});
        }
        else {
            otherAddresses.push({amount, address});
        }
    });
    return {usedAddresses, otherAddresses};
}
export const processOutputs = (outputs, allAddresses) => {
    let usedAddresses: { amount: string; address: string; }[] = [];
    let otherAddresses: { amount: string; address: string; }[] = [];

    outputs.map(output => {
        const amount = output.amount;
        const address = output.address;
        let inputFromAccount = false;
        allAddresses.map(addr => {
            // if the addr belongs to the user account
            if (addr.address === address){
                inputFromAccount = true;
            }
        });

        if (inputFromAccount){
            usedAddresses.push({amount, address});
        }
        else {
            otherAddresses.push({amount, address});
        }
    });
    return {usedAddresses, otherAddresses};
}
export const addressInCommon = (array1, array2) => {
    const found = array1.some(r1 => {
        let f = false;
        array2.map(r2 => {
            if (r2.address === r1.address){
                f = true;
            }
        })
        return f;
    });
    return found;
}
export const containOtherAddresses = (addressesToCheck, allAddresses) => {
    const addressesFromOthers = addressesToCheck.filter(addr => {
        return !allAddresses.some(a => a.address === addr.address)
    });

    return addressesFromOthers.length > 0;
}

export const buildTransaction = async (
    currentAccount: any,
    accountState: any,
    utxos: any[],
    outputs: any[],
    parameters: any,
    password: string | null = null,
) => {

    console.log('outputs.length');
    console.log(outputs.length);
    console.log('pParams');
    console.log(parameters);

    console.log('accountState');
    console.log(accountState);
    console.log('currentAccount.selectedAddress');
    console.log(currentAccount.selectedAddress);

    const mergedAssetsFromUtxos = mergeAssetsFromUtxos(utxos);
    console.log('mergedAssetsFromUtxos');
    console.log(mergedAssetsFromUtxos);
    console.log('outputs');
    console.log(outputs);
    const mergedAssetsFromOutputs = mergeAssetsFromOutputs(outputs);
    console.log('mergedAssetsFromOutputs');
    console.log(mergedAssetsFromOutputs);
    const outputsAreValid = validOutputs(mergedAssetsFromUtxos,mergedAssetsFromOutputs);
    console.log('outputsAreValid');
    console.log(outputsAreValid);
    if (!outputsAreValid) {
        return {
            error: 'Not enough assets in selected tags'
        }
    }




    const taggedUtxos = utxos.filter((utxo) => utxo.tags.length);
    const notTaggedUtxos = utxos.filter((utxo) => !utxo.tags.length);

    let notTaggedUtxosAux = notTaggedUtxos;

    let initialAssetsFromUtxos = mergeAssetsFromUtxos(taggedUtxos);
    let initialAssetsFromNotTaggedUtxos = mergeAssetsFromUtxos(notTaggedUtxos);

    let assetsFromAllUtxos = mergeAssetsFromUtxos(utxos);

    let changeList = [];
    for (const output of outputs) {

        const utxosFromSelectedTag = taggedUtxos.filter((utxo) => utxo.tags.length
            && utxo.tags.some(t => output.fromTags.includes(t)
        ));

        // Candidates to receive the change
        const fromAddresses = utxosFromSelectedTag.map(utxo => utxo.address);

        // Set output: address-assets
        let changeAddress;
        // if there is not any utxo in the selected tag
        if (!fromAddresses.length){
            changeAddress = currentAccount.externalPubAddress[0].address;   // Global address
        } else {
            changeAddress = fromAddresses[0];
        }

        // inputs
        let joinUtxos = utxosFromSelectedTag;
        // CoinSelection algorithm here. update joinUtxos ..

        // Calc the diff joinUtxos-output.assets, send diff to change
        const mergedAssetsFromUtxos = mergeAssetsFromUtxos(joinUtxos);
        // we just need to create the outputs+change, the inputs are -> utxos param

        const assets = output.assets;

        const processedAssets = removeAssetNameFromKey(assets); // X policyId.assetName
        // This is the assets change from the current output
        const diff = calcDiffAssets(mergedAssetsFromUtxos, processedAssets);
        // si diff es mayor que mergedAssetsFromUtxos
        //

        // if notTaggedUtxos are selected
         if (output.notTagged){
             // joinUtxos = [...utxosFromSelectedTag,...notTaggedUtxos];
             // get the negative assets, {"3fb0efd17304d74896130d9ea419a9883a2ef3c8bf9f9e39478dc21074574d54": "900", "lovelace": "-19000000"}
             // Assets to take from initialAssetsFromNotTaggedUtxos
             const assetsNeededFromNotTaggedUtxos = {};
             const assetsForCurrentChange = {};

             for (const [key, value] of Object.entries(diff)) {
                 let bigValue = new BigNumber(value);
                 if (bigValue.isLessThan(new BigNumber(0))) {
                     assetsNeededFromNotTaggedUtxos[key] = bigValue.multipliedBy(new BigNumber(-1)).toString();
                 } else {
                     assetsForCurrentChange[key] = bigValue.toString();
                 }
             }

             if (Object.entries(assetsForCurrentChange).length){
                 changeList.push({address: changeAddress, assets: assetsForCurrentChange});
             }

             if (Object.keys(assetsNeededFromNotTaggedUtxos).length){
                 const updatedInitialAssetsFromNotTaggedUtxos = calcDiffAssets(initialAssetsFromNotTaggedUtxos, assetsNeededFromNotTaggedUtxos);
                 initialAssetsFromNotTaggedUtxos = updatedInitialAssetsFromNotTaggedUtxos;
             }
             // diff and update initialAssetsFromNotTaggedUtxos
             // positive values go to the current changeAddress
         } else {
             if (Object.entries(diff).length){
                 changeList.push({address: changeAddress, assets: diff});
             }
         }

         // Add change as outputs

    }

    console.log('asset left fron notTaggedUtxos initialAssetsFromNotTaggedUtxos, going to global address');
    console.log(initialAssetsFromNotTaggedUtxos);


    if (Object.entries(initialAssetsFromNotTaggedUtxos).length){
        changeList.push({address: currentAccount.externalPubAddress[0].address, assets: initialAssetsFromNotTaggedUtxos})
    }

    console.log('changeList');
    console.log(changeList);
    const groupedChangeList = groupBy(changeList, "address");
    console.log('groupedChangeList');
    console.log(groupedChangeList);
    let mergedChangeList = [];
    for (const [key, value] of Object.entries(groupedChangeList)) {
        console.log('value');
        console.log(value);
        const mergedAssets = mergeAssetsFromOutputs(value);
        mergedChangeList.push({address: key, assets: mergedAssets})
    }

    console.log('Inputs');
    let inputs = [];
    utxos.map(utxo => inputs.push({address: utxo.address, utxos: utxo.utxos}))
    console.log(inputs);
    console.log('Final outputs');
    console.log(outputs);
    console.log('Final change');
    console.log(mergedChangeList);
    // Merge changeList

    // BUILD TX
    let paymentKey = null;
    let accountKey = null;
    if (password && password.length){
        let decryptedPassw = await decryptData(password, currentAccount.encryptedMasterKey);

        accountKey = await Bip32PrivateKey.from_bytes(
            // @ts-ignore
            Buffer.from(decryptedPassw, 'hex')
        );

        paymentKey = (await (await accountKey.derive(0)).derive(0)).to_raw_key();
    }

    console.log('txBuilder');
    const txBuilder = await getTransactionBuilder(parameters);
    const txBuilderDraft = await getTransactionBuilder(parameters);

    console.log(txBuilder);
    console.log(txBuilderDraft);

    // TODO: coinSelection, select which utxos(inputs) to use
    for (const input of inputs) {
        const address = input.address;
        const utxos = input.utxos;
        for (const utxo of utxos) {
            try {
                const inputHash = await TransactionHash.from_bytes(Buffer.from(utxo.tx_hash, 'hex'));
                const txInput = await TransactionInput.new(inputHash, utxo.tx_index);
                const inputValue = await toValue(utxo.amount);
                const inputAddress = await Address.from_bech32(address);
                await txBuilder.add_input(inputAddress,txInput,inputValue);
            } catch (e) {
                return {
                    error: e
                }
            }

        }
    }

    console.log('add outputs');
    for (const output of outputs) {
        try {
            const outputValue = await toValueFromDict(output.assets);
            const outputAddress = await Address.from_bech32(output.toAddress);
            const txOutput = await TransactionOutput.new(outputAddress, outputValue);
            await txBuilder.add_output(txOutput);
        } catch (e) {
            return {
                error: e
            }
        }
    }

    console.log('add change');
    for (const outputAsChange of mergedChangeList) {
        try {
            const outputValue = await toValueFromDict(outputAsChange.assets);
            const outputAddress = await Address.from_bech32(outputAsChange.address);
            const txOutput = await TransactionOutput.new(outputAddress, outputValue);
            await txBuilder.add_output(txOutput);
        } catch (e) {
            return {
                error: e
            }
        }
    }

    console.log("min fee: ")
    console.log(await (await txBuilder.min_fee()).to_str());

    console.log('parameters');
    console.log(parameters);
    await txBuilder.set_ttl(parameters.slot + TX.invalid_hereafter);

    const minFee = await (await txBuilder.min_fee()).to_str();

    await txBuilder.set_fee(await BigNum.from_str(minFee));
    const txBody = await txBuilder.build();

    const witnesses = await TransactionWitnessSet.new();

    const txHash = await hash_transaction(txBody);

    // add keyhash witnesses
    const vkeyWitnesses = await Vkeywitnesses.new();

    // if is submit tx
    if ((currentAccount.encryptedMasterKey && password)
        && currentAccount.encryptedMasterKey.length
        && accountKey
        && paymentKey
    ){
        console.log("Lets sign")
        const vkeyWitness = await make_vkey_witness(txHash, (await paymentKey));
        await vkeyWitnesses.add(vkeyWitness);

        const prvKey2 = await accountKey.to_raw_key();

        // TODO: second sign
        const stakeKeyVitness = await make_vkey_witness(txHash, prvKey2)
        await vkeyWitnesses.add(stakeKeyVitness);

        // Set paymentKey
        await witnesses.set_vkeys(vkeyWitnesses);
        await (await paymentKey).free();
    }

    // create the finalized transaction with witnesses
    const transaction = await Transaction.new(
        txBody,
        witnesses
    );
    const txHex:string = Buffer.from(await transaction.to_bytes()).toString("hex");


    if (password && password.length){
        const result = await submitTxBlockfrost(
            txHex,
            BLOCKFROST_SUMBIT_TESTNET
        );


        console.log('result');
        console.log(result);

        const txHashSubmitted = await submitTransaction(
            DANDELION_URL_TESTNET,
            txHex
        );

        if (txHashSubmitted.data.errors && txHashSubmitted.data.errors.length){
            console.log('Dandelion errors:');
            console.log(txHashSubmitted.data.errors);
        }

        console.log('txHashSubmitted');
        console.log(txHashSubmitted.data);
    }

    return {
        fee: minFee,
        txHex
    }
}
export const mergeAssetsFromUtxos = (utxos) => {
    let assets: { [key: string]: string } = {};
    utxos.map(utxo => {//  {"address": {"address": "addr_test1qp699gyph5gj8c4whp62048z7w7kte2w5ghkpl36wwh5z84t9gat4d3njffvnlde55dwtqyev48z8ywwqask7rsmwd9s0pxmc2", "index": 0, "network": "0", "reference": "", "tags": ["Main"]}, "utxos": [{"amount": [Array], "block": "ab69e2a0c1b8089875439210130bd60327738e1a8ef3fb36dfe05f8d018783c0", "data_hash": null, "output_index": 0, "tx_hash": "69d72b7e73b03c9dcd3f8ce6b185bdab8f85c5d989dffed51edc3f3c482beef0", "tx_index": 0}]}

        utxo.utxos.map( u => {
            u.amount.map( a => {
                if (assets[a.unit] === undefined) {
                    assets[a.unit] = a.quantity;
                } else {
                    let x = new BigNumber(assets[a.unit]);
                    let y = new BigNumber(a.quantity);
                    const sum = (x.plus(y)).toString();
                    assets[a.unit] = sum;
                }
            });
        });

    })
    return assets;
}
export const mergeAssetsFromUtxosByPolicyAndName = (utxos) => {
    let assets: { [key: string]: string } = {};
    utxos.map(utxo => {//  {"address": {"address": "addr_test1qp699gyph5gj8c4whp62048z7w7kte2w5ghkpl36wwh5z84t9gat4d3njffvnlde55dwtqyev48z8ywwqask7rsmwd9s0pxmc2", "index": 0, "network": "0", "reference": "", "tags": ["Main"]}, "utxos": [{"amount": [Array], "block": "ab69e2a0c1b8089875439210130bd60327738e1a8ef3fb36dfe05f8d018783c0", "data_hash": null, "output_index": 0, "tx_hash": "69d72b7e73b03c9dcd3f8ce6b185bdab8f85c5d989dffed51edc3f3c482beef0", "tx_index": 0}]}

        utxo.utxos.map( u => {
            u.amount.map( a => {
                if (assets[a.unit] === undefined) {
                    assets[a.unit] = a.quantity;
                } else {
                    let x = new BigNumber(assets[a.unit]);
                    let y = new BigNumber(a.quantity);
                    const sum = (x.plus(y)).toString();
                    assets[a.unit] = sum;
                }
            });
        });

    })
    return assets;
}
export const mergeAssetsFromOutputs = (outputs: {address:string, assets:any}[]) => {
    let assets: { [unit: string]: string } = {};
    outputs.map(output =>
    {
        Object.entries(output.assets).map(async keyValuePair => {
            const unit = keyValuePair[0].includes('.') ? keyValuePair[0].split('.')[0] : keyValuePair[0];
            if (assets[unit] === undefined) {
                assets[unit] = keyValuePair[1];
            } else {
                let x = new BigNumber(assets[unit]);
                let y = new BigNumber(keyValuePair[1]);
                const sum = (x.plus(y)).toString();
                assets[unit] = sum;
            }
        });
    })
    return assets;
}
export const validOutputs = (mergedAssetsFromUtxos, mergedAssetsFromOutputs ) => {
    for (let key in mergedAssetsFromOutputs) {
        // check if the property/key is defined in the object itself, not in parent
        if (!(mergedAssetsFromUtxos.hasOwnProperty(key)
            && new BigNumber(mergedAssetsFromUtxos[key]).isGreaterThanOrEqualTo(new BigNumber(mergedAssetsFromOutputs[key])))) {
           return false;
        }
    }
    return true;
}
export const removeAssetNameFromKey = (assets) => {
    const processedAssets = {};
    for (let key in assets) {
        let assetValue = assets[key];
        if (key !== 'lovelace'){
            const unit = key.split('.')[0];
            // @ts-ignore
            processedAssets[unit] = assetValue;
        } else {
            // @ts-ignore
            processedAssets[key] = assetValue;
        }
    }
    return processedAssets;
}
export const validateAssets = (mergedAssetsFromUtxos, mergedAssetsFromOutputs ) => {
    for (let key in mergedAssetsFromOutputs) {
        // check if the property/key is defined in the object itself, not in parent
        if (!(mergedAssetsFromUtxos.hasOwnProperty(key)
            && new BigNumber(mergedAssetsFromUtxos[key]).isGreaterThanOrEqualTo(new BigNumber(mergedAssetsFromOutputs[key])))) {
           return false;
        }
    }
    return true;
}
export const calcDiffAssets = (assetsA:{ [unit: string]: string }, assetsB:{ [unit: string]: string } ) => {
    let assets: { [unit: string]: string } = {};
    for (let key in assetsA) {
        if (assetsA[key] === undefined) {
            assets[key] = assetsA[key];
        } else {
            let x = new BigNumber(assetsA[key]);
            let y = new BigNumber(assetsB[key]);
            if (!y.isNaN()) {
                const diff = x.minus(y).toString();
                assets[key] = diff;
            } else {
                assets[key] = x.toString();
            }
        }
    }
    return assets;
}

export const getTransactionBuilder = async (protocolParams): Promise<TransactionBuilder> => {

    // console.log(getTransactionBuilder)
    return await TransactionBuilder.new(
        await LinearFee.new(
            await BigNum.from_str(protocolParams.linearFee.minFeeA),
            await BigNum.from_str(protocolParams.linearFee.minFeeB)),
        // minimum utxo value
        await BigNum.from_str(protocolParams.minUtxo),
        // pool deposit
        await BigNum.from_str(protocolParams.poolDeposit),
        // key deposit
        await BigNum.from_str(protocolParams.keyDeposit),
        // max_value_size
        parseInt(protocolParams.maxValSize),
        // max_tx_size
        protocolParams.maxTxSize,
    );
}

export const toValue = async (assets:{quantity: string, unit: string}[]): Promise<Value> => {

    const lovelace = assets.filter(a => a.unit === "lovelace")[0];
    const value = await Value.new(
        await BigNum.from_str(lovelace.quantity)
    );
    const multiAss = await buildMultiAssets(assets);
    await value.set_multiasset(multiAss);

    return value;
}

export const toValueFromDict = async (assets: { [key: string]: string}): Promise<Value> => {

    const value = await Value.new(
        await BigNum.from_str(assets["lovelace"])
    );
    console.log("hello1.1");
    const multiAss = await buildMultiAssetsFromDict(assets);
    console.log("hello1.2");
    await value.set_multiasset(multiAss);

    return value;
}
export const buildMultiAssets = async (assets:{quantity: string, unit: string}[]): Promise<MultiAsset> => {

    let multiAsset = await MultiAsset.new();

    for (const asset of assets) {
        if (asset.unit !== "lovelace"){
            const policyId = asset.unit.slice(0,56);
            const assetName = asset.unit.split(policyId)[1];  // unit: policyId+assetName
            try{
                const polId = await ScriptHash.from_bytes(
                    Buffer.from(policyId, "hex")
                )
                let assetObj = await multiAsset.get(polId) ?? await Assets.new();
                const script = await ScriptHash.from_bytes(Buffer.from(policyId, 'hex'));

                const aName = await AssetName.new(Buffer.from(assetName, 'hex'));
                await assetObj.insert(aName, await BigNum.from_str(asset.quantity.toString()));
                await multiAsset.insert(script, assetObj);
            } catch (e){
                // console.log(e);
            }
        }
    }

    return multiAsset;
}

export const buildMultiAssetsFromDict = async (assets: { [key: string]: string}): Promise<MultiAsset> => {

    let multiAsset = await MultiAsset.new();

    for (const [key, value] of Object.entries(assets)) {
        const policyId = key.slice(0,56);
        const assetName = key.split(policyId)[1];  // unit: policyId+assetName

        if (key !== "lovelace"){
            const polId = await ScriptHash.from_bytes(
                Buffer.from(policyId, "hex")
            )
            let assetObj = await multiAsset.get(polId) ?? await Assets.new();
            const script = await ScriptHash.from_bytes(Buffer.from(policyId, 'hex'));

            const aName = await AssetName.new(Buffer.from(assetName, 'hex'));
            await assetObj.insert(aName, await BigNum.from_str(value.toString()));
            await multiAsset.insert(script, assetObj);
        }
    }

    return multiAsset;
}













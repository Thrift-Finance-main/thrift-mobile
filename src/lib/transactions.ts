import {CONFIG} from "./account";
import {addBigNum, divBigNum, subBigNum} from "./utils";
import {apiDb} from "../db/LiteDb";
import {getProtocolParams, getTxUTxOsByAddress, IAccountState} from "../api/Blockfrost";
import {decryptData} from "./cryptoLib";
import {BigNum, Bip32PrivateKey, LinearFee, TransactionBuilder} from "@emurgo/react-native-haskell-shelley";
import BigNumber from "bignumber.js";
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

    // After verify there is enough amount in utxos to cover the outputs

    // group by tags
    // 1. Create input, set output and send change back to input
    //      1.1
    //      1.2 if notTagged === false: add notTagged utxos as inputs and send change to Global

    // group  outputs by
    //

    // for all tags involved in

    console.log("\n\n\n\n")

    const taggedUtxos = utxos.filter((utxo) => utxo.tags.length);
    let initialAssetsFromUtxos = mergeAssetsFromUtxos(taggedUtxos);

    let assetsFromAllUtxos = mergeAssetsFromUtxos(utxos);
    for (const output of outputs) {
        console.log('output');
        console.log(output);
        const utxosFromSelectedTag = taggedUtxos.filter((utxo) => utxo.tags.length
            && utxo.tags.some(t => output.fromTags.includes(t)
        ));
        console.log('utxosFromSelectedTag');
        console.log(utxosFromSelectedTag);

        // Candidates to receive the change
        const fromAddresses = utxosFromSelectedTag.map(utxo => utxo.address);
        console.log('fromAddresses');
        console.log(fromAddresses);
        // inputs
        let joinUtxos = utxosFromSelectedTag;
        if (output.notTagged){
            const notTaggedUtxos = utxos.filter((utxo) => !utxo.tags.length);
            joinUtxos = [...joinUtxos,...notTaggedUtxos];
        }

        // CoinSelection algorithm here. update joinUtxos ..

        // Calc the diff joinUtxos-output.assets, send diff to change
        const mergedAssetsFromUtxos = mergeAssetsFromUtxos(joinUtxos);
        // we just need to create the outputs+change, the inputs are -> utxos param


        // Set output: address-assets
        const changeAddress = fromAddresses[0];

        const assets = output.assets;
        console.log('assets in output');
        console.log(assets);

        // TODO remove asset name


        const processedAssets = removeAssetNameFromKey(assets);

        console.log('processedAssets');
        console.log(processedAssets);
        // This is the assets change from the current output
        const diff = calcDiffAssets(mergedAssetsFromUtxos, processedAssets);
        console.log('changeAddress');
        console.log(changeAddress);
        console.log('assets in change');
        console.log(diff);

        // merge all assets from outputs
        // now, lets diff that change from the total utxos

        console.log('output address');
        console.log(output.toAddress);
        console.log('output assets');
        console.log(assets);
        assetsFromAllUtxos = calcDiffAssets(assetsFromAllUtxos, processedAssets);


    }

    console.log('global Change');
    console.log(assetsFromAllUtxos);


}
export const mergeAssetsFromUtxos = (utxos) => {
    console.log('mergeAssetsFromUtxos')
    console.log(utxos.length)
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
            console.log(u);
        });

    })
    return assets;
}
export const mergeAssetsFromOutputs = (outputs: {address:string, assets:any[]}[]) => {
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
    console.log('calcDiffAssets');
    console.log(assetsA);
    console.log(assetsB);
    let assets: { [unit: string]: string } = {};
    for (let key in assetsA) {
        if (assetsA[key] === undefined) {
            assets[key] = assetsA[key];
        } else {
            let x = new BigNumber(assetsA[key]);
            console.log('x');
            console.log(x)
            let y = new BigNumber(assetsB[key]);
            console.log('y');
            console.log(y)
            if (y) {
                const diff = x.minus(y).toString();
                console.log('diff');
                console.log(diff)
                assets[key] = diff;
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



















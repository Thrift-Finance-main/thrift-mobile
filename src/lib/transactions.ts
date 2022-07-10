import {CONFIG, deriveAccountKey, harden} from "./account";
import {addBigNum, divBigNum, subBigNum} from "./utils";
import {apiDb} from "../db/LiteDb";
import {getProtocolParams, getTxUTxOsByAddress, IAccountState, submitTxBlockfrost} from "../api/Blockfrost";
import {decryptData, decryptWithPassword} from "./cryptoLib";
import {
    Address,
    AssetName,
    Assets,
    BigNum,
    Bip32PrivateKey, hash_transaction,
    LinearFee, make_vkey_witness,
    MultiAsset, PrivateKey, ScriptHash, Transaction,
    TransactionBuilder, TransactionHash, TransactionInput, TransactionOutput, TransactionWitnessSet,
    Value, Vkeywitnesses
} from "@emurgo/react-native-haskell-shelley";
import BigNumber from "bignumber.js";
import {groupBy} from "../utils";
import {BLOCKFROST_SUMBIT_TESTNET, DANDELION_URL_TESTNET, TX} from "../constants/tx";
import {submitTransaction} from "../api/graphql/queries";
import moment from "moment";

import {NativeScripts} from "@emurgo/cardano-serialization-lib-nodejs";
import {BASE_ADDRESS_INDEX, DERIVE_COIN_TYPE, DERIVE_PUROPOSE} from "./config";
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
                type: txType,
                status: "confirmed"
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
                type: txType,
                status: "confirmed"
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
                    amountDict[unit] = await subBigNum(amount1[unit], amount2[unit]);

            } else {
                amountDict[unit] = amount1[unit];
            }
        })
    );

    return amountDict;
}
export const diffAmounts2 = (amount1:{ [unit: string]: string }, amount2:{ [unit: string]: string }) => {

    let amountDict: { [unit: string]: string } = {};
    Object.keys(amount1).map(async unit => {
        if ((unit in amount2)){
            const bigValue1 = new BigNumber(amount1[unit]);
            const bigValue2 = new BigNumber(amount2[unit]);
            amountDict[unit] = bigValue1.minus(bigValue2).toString();
        } else {
            amountDict[unit] = amount1[unit];
        }
    })

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

    let initialAssetsFromUtxos = mergeAssetsFromUtxos(taggedUtxos);
    let initialAssetsFromNotTaggedUtxos = mergeAssetsFromUtxos(notTaggedUtxos);

    console.log('\n\n\n\n\n1- Start Coin Selection');
    console.log('mergedAssetsFromOutputs');
    console.log(mergedAssetsFromOutputs);
    console.log('initialAssetsFromUtxos');
    console.log(initialAssetsFromUtxos);

    let changeList = [];

    console.log("\n\n\nCalculate change from outputs");
    let inputUtxosByTag:{ [tag: string]: any[] } = {};
    for (const output of outputs) {
        const currentTags = output.fromTags;
        console.log("\n\nCurrent Tag");
        console.log(currentTags[0]);
        console.log("All inputUtxosByTag");
        console.log(inputUtxosByTag);
        console.log("inputUtxosByTag by Tag");
        console.log(inputUtxosByTag[currentTags[0]]);

        const utxosFromSelectedTag = taggedUtxos.filter((utxo) => utxo.tags.length
            && utxo.tags.some(t => currentTags.includes(t)));

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

        console.log('utxos for current Output');
        console.log(utxosFromSelectedTag);
        const mergedAssetsFromCurrentUtxos = mergeAssetsFromUtxos(utxosFromSelectedTag);
        console.log("Input Assets for current output");
        console.log(mergedAssetsFromCurrentUtxos);
        const assets = output.assets;
        console.log('assets for current Output');
        console.log(output.assets);

        if (inputUtxosByTag[currentTags[0]] === undefined) {
            inputUtxosByTag[currentTags[0]] =  diffAmounts2(mergedAssetsFromCurrentUtxos, output.assets);
        } else {
            inputUtxosByTag[currentTags[0]] = diffAmounts2(inputUtxosByTag[currentTags[0]], output.assets);
        }


        /*
        // if notTaggedUtxos are selected
         if (output.notTagged){
             // joinUtxos = [...utxosFromSelectedTag,...notTaggedUtxos];
             // get the negative assets, {"3fb0efd17304d74896130d9ea419a9883a2ef3c8bf9f9e39478dc21074574d54": "900", "lovelace": "-19000000"}
             // Assets to take from initialAssetsFromNotTaggedUtxos
             const assetsNeededFromNotTaggedUtxos = {};
             const assetsForCurrentChange = {};


             for (const [key, value] of Object.entries(assets)) {
                 let bigValue = new BigNumber(value);
                 console.log(value);
                 console.log(value);
                 if (bigValue.isLessThan(new BigNumber(0))) {
                     console.log("Not enough assets for this output, need notTagged")
                     assetsNeededFromNotTaggedUtxos[key] = bigValue.multipliedBy(new BigNumber(-1)).toString();
                 } else {
                     console.log("Enough assets for current output, OK");
                     assetsForCurrentChange[key] = bigValue.toString();
                 }
             }

             console.log("assetsForCurrentChange");
             console.log(assetsForCurrentChange);
             if (Object.entries(assetsForCurrentChange).length){
                 changeList.push({address: changeAddress, assets: assetsForCurrentChange});
             }

             console.log("assetsNeededFromNotTaggedUtxos");
             console.log(assetsNeededFromNotTaggedUtxos);
             if (Object.keys(assetsNeededFromNotTaggedUtxos).length){
                 const updatedInitialAssetsFromNotTaggedUtxos = calcDiffAssets(initialAssetsFromNotTaggedUtxos, assetsNeededFromNotTaggedUtxos);
                 initialAssetsFromNotTaggedUtxos = updatedInitialAssetsFromNotTaggedUtxos;
             }
             // diff and update initialAssetsFromNotTaggedUtxos
             // positive values go to the current changeAddress
         } else {
             if (Object.entries(assets).length){
                 changeList.push({address: changeAddress, assets: assets});
             }
         }

         */

        //initialAssetsFromUtxos= calcDiffAssets(initialAssetsFromUtxos, assets);
        //console.log('DIFF initialAssetsFromUtxos after rest current output');
        //console.log(initialAssetsFromUtxos);
        // Add change as outputs

    }

    console.log("\n\n");

    console.log('All final change in inputUtxosByTag');
    console.log(inputUtxosByTag);


    const needAssetsFromNotTaggedUtxos =  Object.keys(inputUtxosByTag).some(tag => (new BigNumber(inputUtxosByTag[tag])).isLessThan(new BigNumber('0')));

    // Check if there are negative values in inputUtxosByTag
    if (needAssetsFromNotTaggedUtxos){
        console.log('We need to use notTagged utxos to cover the rest');
    } else {
        console.log('notTagged utxos NOT needed');
    }

    const finalChange:{address: string, assets:{ [unit: string]: string }}[] = [];
    Object.keys(inputUtxosByTag).map(tag => {
        const addrObj = currentAccount.externalPubAddress.find(pubAddr => pubAddr.tags[0] === tag);
        console.log('address');
        console.log(addrObj);
        finalChange.push({
        address: addrObj.address,
        assets: inputUtxosByTag[tag]
     });
    });

    //console.log('changeList1');
    //console.log(changeList);

    //if (Object.entries(initialAssetsFromNotTaggedUtxos).length){
    //    changeList.push({address: currentAccount.externalPubAddress[0].address, assets: initialAssetsFromNotTaggedUtxos})
    //}

    // Remove duplicates
    /*
    changeList = changeList.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.address === value.address
        ))
    );
     */


    /*
    // changeList está duplicada
    console.log('changeList2');
    console.log(changeList);
    const groupedChangeList = groupBy(changeList, "address");
    console.log('groupedChangeList');
    console.log(groupedChangeList);

    // TODO: fix double value on multi-output
    let mergedChangeList = [];
    for (const [key, value] of Object.entries(groupedChangeList)) {
        console.log('value');
        console.log(value);
        const mergedAssets = mergeAssetsFromOutputs(value);
        mergedChangeList.push({address: key, assets: mergedAssets})
    }
    */
    console.log('\n\nInputs');
    let inputs = [];
    utxos.map(utxo => inputs.push({address: utxo.address, utxos: utxo.utxos}))
    console.log(inputs);
    console.log('Final outputs');
    console.log(outputs);
    console.log('Final change');
    console.log(finalChange);
    // Merge changeList

    // BUILD TX


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
                await txBuilderDraft.add_input(inputAddress,txInput,inputValue);
                await txBuilder.add_input(inputAddress,txInput,inputValue);
            } catch (e) {
                return {
                    error: e
                }
            }

        }
    }

    for (const output of outputs) {
        try {
            const outputValue = await toValue(dictToAssetsList(output.assets));
            const outputAddress = await Address.from_bech32(output.toAddress);
            const txOutput = await TransactionOutput.new(outputAddress, outputValue);
            await txBuilderDraft.add_output(txOutput);
            await txBuilder.add_output(txOutput);
        } catch (e) {
            return {
                error: e
            }
        }
    }

    for (const outputAsChange of finalChange) {
        try {
            const outputValue = await toValue(dictToAssetsList(outputAsChange.assets));
            const outputAddress = await Address.from_bech32(outputAsChange.address);
            const txOutput = await TransactionOutput.new(outputAddress, outputValue);
            await txBuilderDraft.add_output(txOutput);
        } catch (e) {
            return {
                error: e
            }
        }
    }

    await txBuilder.set_ttl(parameters.slot + TX.invalid_hereafter);
    await txBuilderDraft.set_ttl(parameters.slot + TX.invalid_hereafter);

    const compensate = "13112";
    let minFeeDraft = await (await txBuilderDraft.min_fee()).to_str();
    const f = (new BigNumber(minFeeDraft).plus(compensate)).toString();
    // Select change to sub the fee
    console.log('finalChange');
    console.log(finalChange.length)

    const usingGlobalAddress = finalChange.some(change => {
        return change.address === currentAccount.externalPubAddress[0].address;
    });

    let outputAsChangeWithFee = finalChange;

    if (usingGlobalAddress){
        outputAsChangeWithFee = finalChange.map(change => {
            if (change.address === currentAccount.externalPubAddress[0].address){
                change.assets["lovelace"] = (new BigNumber(change.assets["lovelace"]).minus(new BigNumber(f))).toString();
            }
            return change;
        });
    } else {
        outputAsChangeWithFee[0].assets["lovelace"] = (new BigNumber(finalChange[0].assets["lovelace"]).minus(new BigNumber(f))).toString();
    }

    /*

       const outputAsChangeWithFee = finalChange.map(change => {
        change.assets["lovelace"] = (new BigNumber(change.assets["lovelace"]).minus(new BigNumber(f))).toString();
    }

    for (let outputAsChange of finalChange) {
        if (!done &&(outputAsChange.address === currentAccount.externalPubAddress)
            || currentAccount.externalPubAddress.some(pubAddr => pubAddr.address ===  outputAsChange.address)
        ) {
            console.log("change minus fee")
            console.log(outputAsChange.assets["lovelace"])
            console.log("fee to rest")
            console.log(f);

            outputAsChange.assets["lovelace"] = (new BigNumber(outputAsChange.assets["lovelace"]).minus(new BigNumber(f))).toString();
            done = true;
        }
        outputAsChangeWithFee.push(outputAsChange);
    }
     */

    //console.log('Final change with fee');
    //console.log(outputAsChangeWithFee);

    for (const outputAsChange of outputAsChangeWithFee) {
        try {
            const outputValue2 = await toValue(dictToAssetsList(outputAsChange.assets));
            const outputAddress2 = await Address.from_bech32(outputAsChange.address);
            const txOutput2 = await TransactionOutput.new(outputAddress2, outputValue2);

            await txBuilder.add_output(txOutput2);
            //console.log(await (await (await txBuilder.get_explicit_output()).coin()).to_str());
        } catch (e) {
            return {
                error: e
            }
        }
    }

    console.log("fee to set")
    console.log(f);
    const feeBigNum = await BigNum.from_str(f);
    await txBuilder.set_fee(feeBigNum);

    console.log("fee in tx: ")
    console.log(await (await txBuilder.get_fee_if_set()).to_str());




    console.log('\n\n\n');
    console.log('Final inputs');
    console.log(inputs);
    console.log(inputs[0].utxos[0]);
    console.log('Final outputs');
    console.log(outputs);
    console.log('Final change');
    console.log(finalChange);


    const txBody = await txBuilder.build();

    const txHash = await hash_transaction(txBody);

    // add keyhash witnesses
    let witnessesSet = await TransactionWitnessSet.new();
    let vkeyWitnesses = await Vkeywitnesses.new();

    // if is submit tx
    if (password && password.length){
        console.log('\n\n\nLets Sign')
        // Get all addresses details addresses from currentAccount
        let inputsList: any[] = [];
        currentAccount.externalPubAddress.forEach(function (_, index) {
            let extAddr = currentAccount.externalPubAddress[index];
            let intAddr = currentAccount.internalPubAddress[index];
            if (inputs.some(input => input.address === extAddr.address)){
                extAddr.chain = 0;
                inputsList.push(extAddr);
            } else if (inputs.some(input => input.address === intAddr.address)){
                intAddr.chain = 1;
                inputsList.push(intAddr);
            }
        });

        console.log('addressesList1')
        console.log(inputsList);

        for (const address of inputsList) {
            const accountKeys = await requestAccountKeys(currentAccount.encryptedMasterKey, password, address.chain, address.index);
            const paymentKey = accountKeys.paymentKey
            const stakeKey = accountKeys.stakeKey

            const vkeyWitness = await make_vkey_witness(txHash, paymentKey);
            await vkeyWitnesses.add(vkeyWitness);
            const stakeKeyVitness = await make_vkey_witness(txHash, stakeKey)
            await vkeyWitnesses.add(stakeKeyVitness);
        }
        console.log('vkeyWitnesses.len()')
        console.log(await vkeyWitnesses.len());
        // Set paymentKey

        //await paymentKey.free();
    }

    await witnessesSet.set_vkeys(vkeyWitnesses);
    // create the finalized transaction with witnesses
    const transaction = await Transaction.new(
        txBody,
        witnessesSet
    );
    const txBytes = await transaction.to_bytes();

    const txHex = Buffer.from(txBytes).toString('hex');
    console.log('txHex');
    console.log(txHex);

    let finalHash = '';
    if (password && password.length){
        try {
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
                console.log('\n\n\nDandelion errors:');
                console.log(txHashSubmitted.data.errors);
                console.log(JSON.stringify(txHashSubmitted.data.errors[0].extensions.reasons));
                const aa = Buffer.from(txHashSubmitted.data.errors[0].extensions.reasons[0].details[0], 'hex').toString('utf-8');
                console.log('aa')
                console.log(aa)
            }

            console.log('txHashSubmitted');
            console.log(txHashSubmitted.data.data.submitTransaction);
            finalHash = txHashSubmitted.data.data.submitTransaction.hash;

        } catch (e) {
            console.log("Error on submit tx to dandelion")
            return {

                error: e
            }
        }
    }

    return {
        fee: f,
        txHash: finalHash,
        inputs,
        mergedOutputs: mergedAssetsFromOutputs
    }
}
export const dictToAssetsList = (assets: { [key: string]: string}):{quantity: string, unit: string}[] => {
    let list = [];
    for (const [key, value] of Object.entries(assets)) {
        list.push({unit: key, quantity: value})
    }
    return list;
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

    //console.log('\n\ntoValue');

    const lovelace = assets.filter(a => a.unit === "lovelace")[0];
    let value = await Value.new(
        await BigNum.from_str(lovelace.quantity)
    );
    //console.log("Add lovelace");
    //console.log(lovelace.unit);
    //console.log(lovelace.quantity);
    const multiAss = await buildMultiAssets(assets);
    await value.set_multiasset(multiAss);

    let coin = await value.coin();
    coin = await coin.to_str()
    //console.log('coin')
    //console.log(coin)
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


export const requestAccountKeys = async (encryptedMasterKey:string, password:string, chain = 0,accountIndex = 0) => {

    let accountKey;
    try {
        accountKey = await (await(await (await Bip32PrivateKey.from_bytes(
            Buffer.from(await decryptData(encryptedMasterKey, password), 'hex')
        )).derive(harden(1852)))
            .derive(harden(1815)) )// coin type;
            .derive(harden(0));
    } catch (e) {
        throw e
    }

    return {
        accountKey,
        paymentKey: await (await(await accountKey.derive(chain)).derive(accountIndex)).to_raw_key(),
        stakeKey: await (await(await accountKey.derive(2)).derive(0)).to_raw_key(),
    };
};








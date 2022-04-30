import {CONFIG} from "./account";
import {addBigNum, divBigNum, subBigNum} from "./utils";
import {apiDb} from "../db/LiteDb";
import {getProtocolParams, IAccountState} from "../api/Blockfrost";
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
// amount1 - amount2
// TODO: cardano-lib to .sub
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
    toAddress: string,
    parameters: any,
    amount: string,
    assets: any[],
    encryptedHex: string | null = null,
    password: string | null = null,
) => {

    console.log('pParams');
    console.log(parameters);
    console.log('accountState');
    console.log(accountState);
    console.log(currentAccount.selectedAddress);

}




























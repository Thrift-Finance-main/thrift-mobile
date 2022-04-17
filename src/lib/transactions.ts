import {CONFIG} from "./account";
import {addBigNum, divBigNum, subBigNum} from "./utils";
import {apiDb} from "../db/LiteDb";
export const RECEIVE_TX = 'RECEIVE_TX';
export const SEND_TX = 'SEND_TX';
export const SELF_TX = 'SELF_TX';

export const classifyTxs = async (transactions, accountAddresses) => {

    console.log('\n\nclassifyTxs');
    subBigNum('500000', '100000').then(r => {
    })
    addBigNum('500000', '100000').then(r => {
    })
    divBigNum('500000', '100000').then(r => {
    })

    const classifiedTxs = await Promise.all(
        transactions.map(async tx => {
            const block_time = tx.block_time;
            const fees = tx.fees;
            const txHash = tx.tx_hash;
            const inputs = tx.utxos.inputs;
            const outputs = tx.utxos.outputs;

            const accInInputs = addressInCommon(inputs, accountAddresses);
            const accInOutputs = addressInCommon(outputs, accountAddresses);

            const processedIn = processInputs(inputs, accountAddresses);
            const processedOut = processInputs(outputs, accountAddresses);

            let txType = SELF_TX;
            if (!accInInputs && accInOutputs) {
                txType = RECEIVE_TX;
            } else if (accInInputs && !accInOutputs) {
                txType = SEND_TX;
            } else if (accInInputs && accInOutputs) {
                // Check if there are other address in inputs
                const othersInInputs = containOtherAddresses(inputs, accountAddresses);
                const othersInOutputs = containOtherAddresses(outputs, accountAddresses);
                if (!othersInInputs && othersInOutputs) {
                    txType = SEND_TX;
                }
            }

            const usedInInputs = processedIn.usedAddresses;
            const usedInOutputs = processedOut.usedAddresses;
            const otherInOutputs = processedOut.otherAddresses;


            let amountOutputList = [];
            let amountInputList = [];
            switch (txType) {
                case SEND_TX:
                    console.log('processedIn');
                    console.log(processedIn);
                    console.log('processedOut');
                    console.log(processedOut);
                    console.log('usedInInputs2');
                    console.log(usedInInputs);
                    console.log('otherInOutputs2');
                    console.log(otherInOutputs);

                    usedInInputs.map(ioutput => {
                        amountInputList = [...amountInputList, ...ioutput.amount]
                    });
                    otherInOutputs.map(uoutput => {
                        amountOutputList = [...amountOutputList, ...uoutput.amount]
                    });




                    const mergedInputsAmount = await mergeAmounts(amountInputList);
                    const aux = await mergeAmounts(amountOutputList);
                    const mergedOutputsAmount = await mergeAmounts(amountOutputList);

                    console.log('amountInputList');
                    console.log(amountInputList);
                    console.log('mergedInputsAmount');
                    console.log(mergedInputsAmount);

                    console.log('amountOutputList');
                    console.log(amountOutputList);
                    console.log('mergedOutputsAmount');
                    console.log(mergedOutputsAmount);

                    const diff = await diffAmounts(mergedInputsAmount, mergedOutputsAmount);
                    console.log('diff');
                    console.log(diff);

                    // inputs-output
                    break;
                case RECEIVE_TX:
                    usedInOutputs.map(uoutput => {
                        amountOutputList = [...amountOutputList, ...uoutput.amount]
                    });
                    const mergedOutputs = await mergeAmounts(amountOutputList);
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
                    return;
            }
        })
    );


    return classifiedTxs;
};
// amount1 - amount2
// TODO: cardano-lib to .sub
export const diffAmounts = async (amount1, amount2) => {

    let amountDict: { [unit: string]: number } = {};

    console.log('diffAmounts');
    console.log(amount1);
    console.log(amount2);

    /*
    await Promise.all(
        amount1.map(async amount => {
            console.log('amount');
            console.log(amount);
        })
    );

     */

    return amountDict;
}

export const mergeAmounts = async (amounts) => {
    let amountDict: { [unit: string]: number } = {};

    console.log('\n\nmergeAmounts');
    console.log(amounts);

    await Promise.all(
        amounts.map(async amount => {
            console.log(amount);
            console.log('amountDict[amount.unit]');
            console.log(amountDict[amount.unit]);
            if (amountDict[amount.unit] === undefined) {
                console.log('no exist')
                amountDict[amount.unit] = amount.quantity;
                console.log(amountDict[amount.unit]);
            } else {
                console.log('lets sum')
                amountDict[amount.unit] = await addBigNum(amountDict[amount.unit], amount.quantity);
                console.log(amountDict[amount.unit]);
            }
        })
    );

    console.log('amountDict\n\n');
    console.log(amountDict);

    return amountDict;
}

export const processInputs = (inputs, allAddresses) => {
    let usedAddresses: { amount: string; address: string; }[] = [];
    let otherAddresses: { amount: string; address: string; }[] = [];

    inputs.map(input => {
        const amount = input.amount;
        const address = input.address;
        let inputFromAccount = false;
        let inputFromOther = false;
        allAddresses.map(addr => {
            if (addr.address === address){
                inputFromAccount = true;
            } else {
                inputFromOther = true;
            }
        });

        if (inputFromAccount){
            usedAddresses.push({amount, address});
        }
        else if (inputFromOther){
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

export const containOtherAddresses = (array1, array2) => {
    const found = array1.some(r1 => {
        let f = false;
        array2.map(r2 => {
            if (r2.address !== r1.address){
                f = true;
            }
        })
        return f;
    });
    return found;
}

import {CONFIG} from "./account";
import {addBigNum, divBigNum, subBigNum} from "./utils";
import {apiDb} from "../db/LiteDb";
export const RECEIVE_TX = 'RECEIVE_TX';
export const SEND_TX = 'SEND_TX';
export const SELF_TX = 'SELF_TX';

export const classifyTxs = async (transactions, accountAddresses) => {

    console.log('\n\nclassifyTxs');
    let count = 0;
    const classifiedTxs = await Promise.all(
        transactions.map(async tx => {
            const block_time = tx.block_time;
            const fees = tx.fees;
            const txHash = tx.tx_hash;
            const inputs = tx.utxos.inputs;
            const outputs = tx.utxos.outputs;

            const accInInputs = addressInCommon(inputs, accountAddresses);
            const accInOutputs = addressInCommon(outputs, accountAddresses);

            console.log('\n----------------------------------');
            console.log('\nprocessedIn');
            const processedIn = processInputs(inputs, accountAddresses);
            console.log('\n----------------------------------');
            console.log('\nprocessedOut');
            const processedOut = processOutputs(outputs, accountAddresses);

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

            switch (txType) {
                case SEND_TX:
                    console.log('SEND_TX');
                    let amountOutputList = [];
                    let amountInputList = [];

                    usedInInputs.map(ioutput => {
                        amountInputList = [...amountInputList, ...ioutput.amount]
                    });

                    otherInOutputs.map(uoutput => {
                        amountOutputList = [...amountOutputList, ...uoutput.amount]
                    });

                    const mergedInputsAmount = await mergeAmounts(amountInputList);
                    const mergedOutputsAmount = await mergeAmounts(amountOutputList);

                    const mergedDiff = await diffAmounts(mergedInputsAmount, mergedOutputsAmount);

                    console.log(count);
                    count++;
                    return {
                        txHash,
                        blockTime: block_time,
                        inputs: processedIn,
                        outputs: processedOut,
                        amount: mergedDiff,
                        fees,
                        type: txType
                    }

                case RECEIVE_TX:
                    console.log('RECEIVE_TX');
                    let amountOutputs = [];
                    usedInOutputs.map(uoutput => {
                        amountOutputs = [...amountOutputs, ...uoutput.amount]
                    });
                    const mergedOutputs = await mergeAmounts(amountOutputs);
                    console.log(count);
                    count++;
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

    await Promise.all(
        Object.keys(amount1).map(async unit => {
            console.log('amount3333');
            console.log(unit);
            console.log(amount1[unit]);
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

    /*
    console.log("\n\n//////////////////////////////////////////////////");
    console.log("processInputs");

    console.log('allAddresses');
    console.log(allAddresses);
    console.log('inputs');
    console.log(inputs);
    console.log(inputs[0]);
    console.log(inputs[1]);

     */

    inputs.map(input => {
        const amount = input.amount;
        const address = input.address;
        let inputFromOther = false;
        allAddresses.map(addr => {
            if (addr.address === address){
                inputFromOther = true;
            }
        });

        if (inputFromOther){
            otherAddresses.push({amount, address});
        }
        else {
            usedAddresses.push({amount, address});
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
        let inputFromAccount= false;
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

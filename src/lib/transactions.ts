import {CONFIG} from "./account";
export const RECEIVE_TX = 'RECEIVE_TX';
export const SEND_TX = 'SEND_TX';
export const SELF_TX = 'SELF_TX';

export const classifyTxs = (transactions, accountAddresses) => {

    const classifiedTxs = transactions.map(tx => {
        const block_time = tx.block_time;
        const fees = tx.fees;
        const txHash = tx.tx_hash;
        const inputs = tx.utxos.inputs;
        const outputs = tx.utxos.outputs;

        const accInInputs = addressInCommon(inputs, accountAddresses);
        const accInOutputs = addressInCommon(outputs, accountAddresses);

        const processedIn = processInputs(inputs, accountAddresses);
        const processedOut= processInputs(outputs, accountAddresses);

        let txType = SELF_TX;
        if (!accInInputs && accInOutputs){
            txType = RECEIVE_TX;
        } else if (accInInputs && !accInOutputs){
            txType = SEND_TX;
        } else  if (accInInputs && accInOutputs){
            // Check if there are other address in inputs
            const othersInInputs = containOtherAddresses(inputs, accountAddresses);
            const othersInOutputs = containOtherAddresses(outputs, accountAddresses);
            if (!othersInInputs && othersInOutputs){
                txType = SEND_TX;
            }
        }

        const usedInInputs = processedIn.usedAddresses;
        const usedInOutputs = processedOut.usedAddresses;


        let amount = 0;
        let amountList = [];
        switch (txType) {
            case SEND_TX:
                console.log('usedInInputs');
                console.log(usedInInputs);
                break;
            case RECEIVE_TX:
                console.log('usedInOutputs');
                console.log(usedInOutputs);
                usedInOutputs.map(uoutput => {
                    console.log('uoutput.amount');
                    console.log(uoutput.amount);
                    amountList = [...amountList,...uoutput.amount]
                    // merge amount by uinput.amount[0].unit
                    amount += parseInt(uoutput.amount[0].quantity);
                });

                break;
            default:
                break;
        }

        const mergedAmount = mergeAmounts(amountList);

        return {
            txHash,
            blockTime: block_time,
            inputs: processedIn,
            outputs: processedOut,
            amount: mergedAmount,
            fees,
            type: txType
        }
    });
    return classifiedTxs;
};

export const mergeAmounts = (amounts) => {
    let amountDict:{ [unit: string]: number } = {};

    amounts.map(amount => {
        if (amountDict[amount.unit] === undefined){
            amountDict[amount.unit] = amount.quantity;
        } else{
            amountDict[amount.unit] += amount.quantity;
        }
    });
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

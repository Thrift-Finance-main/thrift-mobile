import {CONFIG} from "./account";
export const RECEIVE_TX = 'RECEIVE_TX';
export const SEND_TX = 'SEND_TX';
export const SELF_TX = 'SELF_TX';

export const classifyTx = (addrDataList, accountAddresses) => {

    for (let addrData in addrDataList) {
        const utxos = addrDataList[addrData].utxos;
        const block_time = addrDataList[addrData].block_time;
        const inputs = utxos.inputs;
        const outputs = utxos.outputs;

        const accInInputs = addressInCommon(inputs, accountAddresses);
        const accInOutputs = addressInCommon(outputs, accountAddresses);

        const processedIns = processInputs(inputs, accountAddresses);
        console.log('processedInputs');
        console.log(processedIns);
        const processedOuts = processInputs(outputs, accountAddresses);

        console.log('processedOuts');
        console.log(processedOuts);

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
            console.log('othersInInputs');
            console.log(othersInInputs);
            console.log('othersInInputs');
            console.log(othersInInputs);
        }
        console.log('txType');
        console.log(txType);
    }
};

export const processInputs = (inputs, allAddresses) => {
    let usedAddresses: { amount: string; address: string; inputFromAccount:any }[] = [];

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
            usedAddresses.push({amount, address, inputFromAccount});
        }
    });
    return usedAddresses;
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

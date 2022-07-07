import axios from 'axios';
import {submitTransactionBody} from "./body";

// eslint-disable-next-line import/prefer-default-export
export const startQuery = async (query: any, params: any, url: string) => {
  try {
    return await axios.post(url, {
      query,
      variables: params,
    });
  } catch (e) {
    console.log(e);
    return [e];
  }
};


export async function submitTransaction(url:string, signedTxBinary:any) {

  let transactionQuery = submitTransactionBody();
  const transactionResult = await axios.post(url, { query: transactionQuery, variables: { transaction: signedTxBinary } });
  return transactionResult;
}

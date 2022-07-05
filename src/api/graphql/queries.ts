import axios from 'axios';
import {getCurrentBalanceForAddressBody} from "./body";

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

export async function getCurrentBalanceForAddress(addresses:string, url:string) {
  const query = getCurrentBalanceForAddressBody();
  const params = {
    addresses
  }
  try{
    let res = await startQuery(query, params, url);
    // @ts-ignore
    let result = (res.data && res.data.data) || [];

    return result;
  } catch (e) {
    return e;
  }

}

// eslint-disable-next-line import/extensions,import/no-unresolved
import {getCurrentBalanceForAddressBody} from './graphql/body';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {startQuery} from './graphql/queries';

// eslint-disable-next-line import/prefer-default-export
export const getCurrentBalanceForAddress = async (
  address: string,
  url: string,
) => {
  const query = getCurrentBalanceForAddressBody();
  const params = {
    address,
  };
  const res = await startQuery(query, params, url);
  // @ts-ignore
  const result = (res.data && res.data.data) || [];

  console.log('getCurrentBalanceForAddress');
  console.log(result);
  return result;
};


export const getPrices = async (currency:string) => {

  let result = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=${currency}`
  );
  if (!result || result.error) return null;
  result = result.json()
  return result
};

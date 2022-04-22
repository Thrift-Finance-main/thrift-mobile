// eslint-disable-next-line import/prefer-default-export,import/extensions,import/no-unresolved
import {BLOCKFROST_API, BLOCKFROST_URL_TESTNET} from '../../config';


/*

fetch(
  `https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=${currency}`
)
  .then((res) => res.json())
  .then((res) => res.cardano[currency])
* */
export const fetchBlockfrost = async (endpoint: string) => {
  try {
    // console.log('\n\nfetchBlockfrost');
    const address = BLOCKFROST_URL_TESTNET + `${endpoint}`;

    //console.log("fetchBlockfrost");
    //console.log(address);
    const rawResult = await fetch(address, {
      method: 'GET',
      headers: {'Content-Type': 'application/json', project_id: BLOCKFROST_API},
    });

    return await rawResult.json();
  } catch (e) {
    console.log('error');
    console.log(e);
  }

}

export const getTxUTxOs = async (txHash:string) => {
  const result = await fetchBlockfrost(`/txs/${txHash}/utxos`);
  if (!result || result.error) return null;
  return result;
};
export const getTxInfo = async (txHash:string) => {
  const result = await fetchBlockfrost(`/txs/${txHash}`);
  if (!result || result.error) return null;
  return result;
};
export const getBlockInfo = async (blockHash:string) => {
  const result = await fetchBlockfrost(`/blocks/${blockHash}`);
  if (!result || result.error) return null;
  return result;
};

export const submitTxBlockfrost = async (endpoint: string, data: any) => {
  console.log('submitTxBlockfrost');
  const address = `/api/blockfrost${endpoint}`;
  const token = BLOCKFROST_API;
  const urlb = BLOCKFROST_URL_TESTNET + address;

  const result = await fetch(urlb, {
    headers: {
      Authorization: `Bearer \${${token}}`,
      project_id: token,
      'Content-Type': 'application/cbor',
      'User-Agent': 'thrift-wallet',
      'Cache-Control': 'no-cache',
    },
    method: Buffer.from(data, 'hex') ? 'POST' : 'GET',
    body: Buffer.from(data, 'hex'),
  }).then(res => res.json());

  if (result.status_code === 400) {
    return {
      error: result,
    };
  }

  return result;
};

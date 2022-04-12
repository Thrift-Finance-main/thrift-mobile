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
  // console.log('\n\nfetchBlockfrost');
  const address = BLOCKFROST_URL_TESTNET + `/api/v0/${endpoint}`;

  const rawResult = await fetch(address, {
    method: 'GET',
    headers: {'Content-Type': 'application/json', project_id: BLOCKFROST_API},
  });

  return await rawResult.json();
}

export const Blockfrost = () => {
  // console.log('Blockfrost');
  const token = BLOCKFROST_API;
  return {
    name: 'data',
    exec: {
      request: async (endpoint: string, type?: string): Promise<any> => {
        if (!type) {
          // eslint-disable-next-line no-param-reassign
          type = 'get';
        }

        const address = BLOCKFROST_URL_TESTNET+`/api/v0/${endpoint}`;

        const response = await fetch(address, {
          headers: {'Content-Type': 'application/json', project_id: token},
          method: type,
        })
          .then(r => r.json())
          .catch((e: any) => Promise.reject(e));

        return response;
      },
    },
  };
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

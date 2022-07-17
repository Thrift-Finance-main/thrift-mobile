// eslint-disable-next-line import/prefer-default-export,import/extensions,import/no-unresolved
import {BLOCKFROST_API, BLOCKFROST_URL_TESTNET} from '../../config';
import {IAccountState} from "../lib/transactions";


/*

fetch(
  `https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=${currency}`
)
  .then((res) => res.json())
  .then((res) => res.cardano[currency])
* */
export interface IAccountState {
  active: boolean;
  active_epoch: any;
  controlled_amount: string;
  pool_id: string;
  reserves_sum: string;
  rewards_sum: string;
  stake_address: string;
  withdrawable_amount: string;
  withdrawals_sum: boolean;
}
export const fetchBlockfrost = async (endpoint: string): Promise<IAccountState> => {
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

export const getProtocolParams = async () => {
  const latest_block = await fetchBlockfrost('/blocks/latest');
  const p = await fetchBlockfrost(`/epochs/${latest_block.epoch}/parameters`);

  return {
    linearFee: {
      minFeeA: p.min_fee_a.toString(),
      minFeeB: p.min_fee_b.toString(),
    },
    minUtxo: '1000000', //p.min_utxo, minUTxOValue protocol paramter has been removed since Alonzo HF. Calulation of minADA works differently now, but 1 minADA still sufficient for now
    poolDeposit: p.pool_deposit,
    keyDeposit: p.key_deposit,
    coinsPerUtxoWord: p.coins_per_utxo_word,
    maxValSize: p.max_val_size,
    priceMem: p.price_mem,
    priceStep: p.price_step,
    maxTxSize: p.max_tx_size,
    slot: latest_block.slot
  };
};
export const getTxUTxOs = async (txHash:string) => {
  const result = await fetchBlockfrost(`/txs/${txHash}/utxos`);
  if (!result || result.error) return null;
  return result;
};
export const getTxUTxOsByAddress = async (address:string) => {
  const result = await fetchBlockfrost(`addresses/${address}/utxos`);
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
export const getTransactions = async (address:string, paginate = 1, count = 10) => {
  const result = await fetchBlockfrost(
      `/addresses/${address}/transactions?page=${paginate}&order=desc&count=${count}`
  );
  if (!result || result.error) return [];
  return result.map((tx) => ({
    txHash: tx.tx_hash,
    txIndex: tx.tx_index,
    blockHeight: tx.block_height,
  }));
};

export const submitTxBlockfrost = async (endpoint: string, data: any) => {
  console.log('submitTxBlockfrost');
  const token = BLOCKFROST_API;

  try{
    const result = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer \${${token}}`,
        project_id: token,
        'Content-Type': 'application/cbor',
        'User-Agent': 'thrift-wallet',
        'Cache-Control': 'no-cache',
      },
      method: Buffer.from(data, 'hex') ? 'POST' : 'GET',
      body: Buffer.from(data, 'hex'),
    });

    console.log('result.json()')
    console.log(result.json())
    return result;
  } catch (e) {
    return {
      error: e,
    };
  }



};

export interface IBalance {
  _id?: string;
  amount: string;
  network: string;
}

export const BALANCE_TABLE = 'Balance';

export const BalanceSchema = {
  _id: 'string?',
  name: BALANCE_TABLE,
  primaryKey: '_id',
  properties: {
    amount: 'string',
    network: 'string',
  },
};

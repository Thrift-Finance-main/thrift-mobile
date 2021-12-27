export interface IStakeAddress {
  _id: string;
  address: string;
  network: string;
}

export const StakeAddressSchema = {
  name: 'StakeAddress',
  primaryKey: '_id',
  properties: {
    _id: 'uuid',
    address: 'string',
    network: 'string',
  },
};

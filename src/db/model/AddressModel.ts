export interface IAddress {
  _id: string;
  reference: string;
  index: number;
  address: string;
  network: string;
}

export const AddressSchema = {
  name: 'AddressSchema',
  primaryKey: '_id',
  properties: {
    _id: 'uuid',
    reference: 'string',
    index: 'int',
    address: 'string',
    network: 'string',
  },
};

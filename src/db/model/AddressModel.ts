export interface IAddress {
  _id?: string;
  reference: string;
  tags: Set<string>;
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
    tags: 'string<>', // Set of tags
    index: 'int',
    address: 'string',
    network: 'string',
  },
};

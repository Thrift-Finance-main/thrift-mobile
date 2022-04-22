import { Realm } from '@realm/react';

const ADDRESS_TABLE = 'Address';

export class Address extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  reference!: string;
  tags!: Set<string>;
  index!: number;
  address!: string;
  network!: string;

  static generate(
      {
        reference,
        tags,
        index,
        address,
        network
      }) {
    return {
      _id: new Realm.BSON.ObjectId(),
      reference,
      tags,
      index,
      address,
      network
    };
  }

  static schema = {
    name: ADDRESS_TABLE,
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      reference: 'string',
      tags: 'string<>', // Set of tags
      index: 'int',
      address: 'string',
      network: 'string',
    },
  };
}

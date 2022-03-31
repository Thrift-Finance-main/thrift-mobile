import { Realm, createRealmContext } from '@realm/react';
import {ACCOUNT_TABLE} from "../model/AccountModel";

const ADDRESS_TABLE = 'Address';

export class Address {
  _id: Realm.BSON.ObjectId;
  reference: string;
  tags: Set<string>;
  index: number;
  address: string;
  network: string;

  constructor({id = new Realm.BSON.ObjectId(), reference, tags, index, address, network}) {
    this._id = id;

    this.reference = reference;
    this.tags = tags;
    this.index = index;
    this.address = address;
    this.network = network;
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

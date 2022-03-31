import { Realm, createRealmContext } from '@realm/react';

export const ACCOUNT_TABLE = 'Account';

export class Account {
  _id: Realm.BSON.ObjectId;
  accountName: string;
  balance: string;
  tokens: any;
  encryptedMasterKey: string;
  publicKeyHex: string;
  rewardAddress: string;
  internalPubAddress: any;
  externalPubAddress: any;
  mode: string;
  constructor({id = new Realm.BSON.ObjectId(), accountName, encryptedMasterKey, publicKeyHex, rewardAddress, mode = ''}) {
    this._id = id;

    this.accountName = accountName;
    this.balance = '';
    this.tokens = [];
    this.encryptedMasterKey = encryptedMasterKey;
    this.publicKeyHex = publicKeyHex;
    this.rewardAddress = rewardAddress;
    this.internalPubAddress = [];
    this.externalPubAddress = [];
    this.mode = mode;
  }

  // To use a class as a Realm object type, define the object schema on
  // the static property "schema".
  //
  // also creating a relationship back to the parent project using the linkingObjects
  // which in this case will be an array of one element, which is the parent. It looks
  // weird in the code but in works
  // https://docs.mongodb.com/realm/sdk/react-native/examples/define-a-realm-object-model/#define-relationship-properties
  // https://stackoverflow.com/questions/69711011/is-there-a-way-to-present-one2many-relation-in-correct-way-in-realm
  static schema = {
    name: ACCOUNT_TABLE,
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      accountName: 'string',
      balance: 'string',
      tokens: 'NativeToken[]',
      encryptedMasterKey: 'string',
      publicKeyHex: 'string',
      rewardAddress: 'string',
      internalPubAddress: 'Address[]',
      externalPubAddress: 'Address[]',
      mode: 'string',
    },
  };
}

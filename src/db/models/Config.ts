import { Realm, createRealmContext } from '@realm/react';
import {ACCOUNT_TABLE} from "../model/AccountModel";

export const CONFIG_TABLE = 'Config';

export class Config {
  _id: Realm.BSON.ObjectId;
  currentAccount: string;
  pinhash: string;
  language: string;
  currentEndpoint: string;
  version: string;
  constructor({id = new Realm.BSON.ObjectId(), currentAccount, pinhash, language, currentEndpoint, version}) {
    this._id = id;

    this.currentAccount = currentAccount;
    this.pinhash = pinhash;
    this.language = language;
    this.currentEndpoint = currentEndpoint;
    this.version = version;
  }

  static schema = {
    name: CONFIG_TABLE,
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      currentAccount: 'string',
      pinhash: 'string',
      language: 'string',
      currentEndpoint: 'string',
      version: 'string',
    },
  };
}

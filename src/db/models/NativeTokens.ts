import { Realm, createRealmContext } from '@realm/react';
import {ACCOUNT_TABLE} from "../model/AccountModel";

const NATIVE_TOKENS_TABLE = 'NativeTokens';

export class NativeTokens {
  _id: Realm.BSON.ObjectId;
  assetName: string;
  policyId: string;
  assetId: string;
  fingerprint: string;
  quantity: number;
  type: string;
  decimals: number;
  metadata: string;
  url: string;
  logo: string;
  ticker: string;
  constructor({id = new Realm.BSON.ObjectId(),
                assetName,
                policyId,
                assetId,
                fingerprint,
                quantity,
                type='',
                decimals = 0,
                metadata= '',
                url= '',
                logo= '',
                ticker= '',
              }) {
    this._id = id;
    this.assetName = assetName;
    this.policyId = policyId;
    this.assetId = assetId;
    this.fingerprint = fingerprint;
    this.quantity = quantity;
    this.type = type;
    this.decimals = decimals;
    this.metadata = metadata;
    this.url = url;
    this.logo = logo;
    this.ticker = ticker;
  }

  static schema = {
    name: NATIVE_TOKENS_TABLE,
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      assetName: 'string',
      policyId: 'string',
      assetId: 'string',
      fingerprint: 'string',
      quantity: 'int',
      type: 'string?',
      decimals: 'string?',
      metadata: 'string?',
      url: 'string?',
      logo: 'string?',
      ticker: 'string?',
    },
  };
}

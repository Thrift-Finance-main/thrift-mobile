import { Realm } from '@realm/react';

const NATIVE_TOKENS_TABLE = 'NativeToken';

export class NativeToken extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  assetName!: string;
  policyId!: string;
  assetId!: string;
  fingerprint!: string;
  quantity!: number;
  type!: string;
  decimals!: number;
  metadata!: string;
  url!: string;
  logo!: string;
  ticker!: string;

    static generate(
        {
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
        return {
            _id: new Realm.BSON.ObjectId(),
            assetName,
            policyId,
            assetId,
            fingerprint,
            quantity,
            type,
            decimals,
            metadata,
            url,
            logo,
            ticker,
        };
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

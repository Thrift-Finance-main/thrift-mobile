import Realm from 'realm';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {INativeToken} from './NativeTokenModel';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {IAddress} from './AddressModel';
// eslint-disable-next-line import/extensions,import/no-unresolved

export const ACCOUNT_TABLE = 'Account';

export interface IAccount {
  _id: string;
  accountName: string;
  balance: string; // #
  tokens: INativeToken[]; // #
  encryptedMasterKey: string;
  publicKeyHex: string;
  rewardAddress: string;
  internalPubAddress: IAddress[];
  externalPubAddress: IAddress[];
  mode: string; // watch account
}

export const AccountSchema = {
  name: ACCOUNT_TABLE,
  primaryKey: 'accountName',
  properties: {
    _id: 'uuid',
    accountName: 'string',
    balance: 'string',
    tokens: 'NativeToken[]',
    encryptedMasterKey: 'string',
    publicKeyHex: 'string',
    rewardAddress: 'string',
    internalPubAddress: 'AddressSchema[]',
    externalPubAddress: 'AddressSchema[]',
    mode: 'string',
  },
};

// eslint-disable-next-line import/extensions,import/no-unresolved
import {INativeToken} from './NativeTokenModel';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {IAddress} from './AddressModel';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {IStakeAddress} from './StakeAddressModel';


export interface IAccount {
  _id: string;
  accountName: string;
  balance: string;
  tokens: INativeToken[];
  encryptedMasterKey: string;
  publicKey: string;
  paymentKeyHash: string;
  stakeKeyHash: string;
  internalPubAddress: IAddress[];
  externalPubAddress: IAddress[];
  rewardAddress: IStakeAddress;
  mode: string; // watch account
}

export const AccountSchema = {
  name: 'Account',
  primaryKey: '_id',
  properties: {
    _id: 'uuid',
    name: 'string',
    accountName: 'string',
    balance: 'string',
    tokens: 'NativeToken[]',
    encryptedMasterKey: 'string',
    publicKey: 'string',
    paymentKeyHash: 'string',
    stakeKeyHash: 'string',
    internalPubAddress: 'AddressSchema[]',
    externalPubAddress: 'AddressSchema[]',
    rewardAddress: 'StakeAddress',
    mode: 'string',
  },
};

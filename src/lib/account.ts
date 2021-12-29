// @ts-ignore
import {randomBytes} from 'react-native-randombytes';
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {generateMnemonic, mnemonicToEntropy} from 'bip39';
import {
  BaseAddress,
  Bip32PrivateKey,
  StakeCredential,
} from '@emurgo/react-native-haskell-shelley';

import {
  BASE_ADDRESS_INDEX,
  DERIVE_COIN_TYPE,
  DERIVE_PUROPOSE,
  numbers,
  TOTAL_ADDRESS_INDEX,
  // eslint-disable-next-line import/extensions,import/no-unresolved
} from './config';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {MAINNET_NETWORK_INDEX} from './network';
import crypto from "crypto";
import {encryptData} from "./crypto";

export const CONFIG = {
  MNEMONIC_STRENGTH: 160,
};

export type AddressType = 'Internal' | 'External';

/**
 * wallet key generation
 */
export const harden = (num: number) => {
  return 0x80000000 + num;
};

export const generateAdaMnemonic = () => {
  return generateMnemonic(CONFIG.MNEMONIC_STRENGTH, randomBytes);
};

export const generateWalletRootKey: (
  mnemonic: string,
) => Promise<Bip32PrivateKey> = async (mnemonic: string) => {
  const bip39entropy = mnemonicToEntropy(mnemonic);
  const EMPTY_PASSWORD = Buffer.from('');
  const rootKey = await Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(bip39entropy, 'hex'),
    EMPTY_PASSWORD,
  );
  return rootKey;
};

export const getMasterKeyFromMnemonic = async (mnemonic: string) => {
  const masterKeyPtr = await generateWalletRootKey(mnemonic);
  return Buffer.from(await masterKeyPtr.as_bytes()).toString('hex');
};

export const getAccountFromMasterKey = async (masterKey: string) => {
  const masterKeyPtr = await Bip32PrivateKey.from_bytes(
    Buffer.from(masterKey, 'hex'),
  );
  const accountKey = await (
    await (await masterKeyPtr.derive(DERIVE_PUROPOSE)).derive(DERIVE_COIN_TYPE)
  ).derive(BASE_ADDRESS_INDEX);
  const accountPubKey = await accountKey.to_public();
  // match old byron CryptoAccount type

  const accountPubKeyHex = Buffer.from(await accountPubKey.as_bytes()).toString(
    'hex',
  );
  return {
    accountKey,
    accountPubKeyHex,
  };
};

export const generatePayAddress = async (
  // @ts-ignore
  accountKey: Bip32PrivateKey,
  chain: number,
  index: number,
  networkId: string,
) => {
  let stakeKey;
  let stakeKeyPub;
  try {
    stakeKey = (
      await (
        await accountKey.derive(numbers.ChainDerivations.ChimericAccount)
      ).derive(numbers.StakingKeyIndex)
    ).to_raw_key();
    stakeKeyPub = await (await stakeKey).to_public();
  } catch (e) {
    console.log(e);
    return {
      error: e,
    };
  }

  let paymentKeyPub;
  try {
    const paymentKey = (
      await (await accountKey.derive(chain)).derive(index)
    ).to_raw_key();
    paymentKeyPub = await (await paymentKey).to_public();
  } catch (e) {
    console.log(e);
    return {
      error: e,
    };
  }
  try {
    const addr = await BaseAddress.new(
      parseInt(networkId, 10),
      await StakeCredential.from_keyhash(await paymentKeyPub.hash()),
      await StakeCredential.from_keyhash(await stakeKeyPub.hash()),
    );
    const addrBench32 = (await addr.to_address()).to_bech32();
    return addrBench32;
  } catch (e) {
    console.log(e);
    return {
      error: e,
    };
  }
};

export const createAccount = async (
  mnemonic: string,
  accountName: string,
  pass: string,
) => {
  console.log('createAccount');

  const masterKey = await getMasterKeyFromMnemonic(mnemonic);
  const account = await getAccountFromMasterKey(masterKey);

  const masterKeyPtr = await Bip32PrivateKey.from_bytes(
    Buffer.from(masterKey, 'hex'),
  );
  const externalAdresses = [];
  for (let i = 0; i < TOTAL_ADDRESS_INDEX; i++) {
    // eslint-disable-next-line no-await-in-loop
    const externalPubAddressM = await generatePayAddress(
      masterKeyPtr,
      0,
      BASE_ADDRESS_INDEX,
      MAINNET_NETWORK_INDEX,
    );
    externalAdresses.push(externalPubAddressM);
  }
  const internalAdresses = [];
  for (let i = 0; i < TOTAL_ADDRESS_INDEX; i++) {
    // eslint-disable-next-line no-await-in-loop
    const internalPubAddressM = await generatePayAddress(
      masterKeyPtr,
      1,
      BASE_ADDRESS_INDEX,
      MAINNET_NETWORK_INDEX,
    );
    internalAdresses.push(internalPubAddressM);
  }
  const c = await encryptData(masterKey, pass);
  console.log('\n\nc');
  console.log(c);
  return {
    encrypt: c,
    account,
    masterKey,
    mnemonic,
    externalAdresses,
    internalAdresses,
  };
};

import '../../shim';

import {
  BaseAddress,
  Bip32PrivateKey,
  RewardAddress,
  StakeCredential,
} from '@emurgo/react-native-haskell-shelley';

// @ts-ignore
import {randomBytes} from 'react-native-randombytes';

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {generateMnemonic, mnemonicToEntropy} from 'bip39';

import {
  BASE_ADDRESS_INDEX,
  DERIVE_COIN_TYPE,
  DERIVE_PUROPOSE,
  numbers,
  TOTAL_ADDRESS_INDEX,
  // eslint-disable-next-line import/extensions,import/no-unresolved
} from './config';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {TESTNET_NETWORK_INDEX} from './network';
import {encryptData} from './cryptoLib';
import {Realm} from "@realm/react";
import {HASH_PROOF} from "../config/default";

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

export const generateWalletRootKey2: (
  mnemonic: string,
) => Promise<Bip32PrivateKey> = async (mnemonic: string) => {
  const bip39entropy = mnemonicToEntropy(mnemonic);
  const EMPTY_PASSWORD = Buffer.from('');
  let rootKey;
  try {
    rootKey = await Bip32PrivateKey.from_bip39_entropy(
      Buffer.from(bip39entropy, 'hex'),
      EMPTY_PASSWORD,
    );
  } catch (e) {
    console.log('error');
    console.log(e);
  }

  return rootKey;
};
export const generateWalletRootKey: (
  mnemonic: string,
) => Promise<Bip32PrivateKey> = async (mnemonic: string) => {
  const bip39entropy = mnemonicToEntropy(mnemonic);
  const EMPTY_PASSWORD = Buffer.from('');
  console.log('hey');

  if (await Bip32PrivateKey) {
    console.log('es siiii');

    try {
      const f = Bip32PrivateKey.from_bip39_entropy(
        Buffer.from(bip39entropy, 'hex'),
        EMPTY_PASSWORD,
      );
      console.log(f);

      console.log('es noooo');
      return f;
    } finally {
    }
  }

  /*
  const rootKey = await Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(bip39entropy, 'hex'),
    EMPTY_PASSWORD,
  );
  console.log('rootKey');
  console.log(rootKey);
  return rootKey;
  */
};

export const getMasterKeyFromMnemonic = async (
  mnemonic: string,
): Promise<string> => {
  const masterKeyPtr = await generateWalletRootKey2(mnemonic);
  return Buffer.from(await masterKeyPtr.as_bytes()).toString('hex');
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
  }

  let paymentKeyPub;
  try {
    const paymentKey = (
      await (await accountKey.derive(chain)).derive(index)
    ).to_raw_key();
    paymentKeyPub = await (await paymentKey).to_public();
  } catch (e) {
    console.log(e);
  }
  try {
    const addr = await BaseAddress.new(
      parseInt(networkId, 10),
      await StakeCredential.from_keyhash(await paymentKeyPub.hash()), // TODO: Persist in acc, so you can create more addrs without privkey
      await StakeCredential.from_keyhash(await stakeKeyPub.hash()), // TODO: Persist in acc
    );
    const addrBench32 = (await addr.to_address()).to_bech32();
    return addrBench32;
  } catch (e) {
    console.log(e);
  }
};

export const createAccount = async (
  mnemonic: string,
  accountName: string,
  pass: string
) => {
  console.log('createAccount');

  const masterKey = await getMasterKeyFromMnemonic(mnemonic);
  console.log('masterKey');
  console.log(masterKey);

  const masterKeyPtr = await Bip32PrivateKey.from_bytes(
    Buffer.from(masterKey, 'hex'),
  );

  const accountKey = await (
    await (await masterKeyPtr.derive(DERIVE_PUROPOSE)).derive(DERIVE_COIN_TYPE)
  ).derive(BASE_ADDRESS_INDEX);
  const publicKey = await accountKey.to_public();
  const publicKeyHex = Buffer.from(await publicKey.as_bytes()).toString('hex');

  console.log('hey1');
  const encryptedMasterKey = await encryptData(masterKey, pass);
  const encryptedPublicKeyHex = await encryptData(publicKeyHex, pass);

  console.log('hey2');

  console.log('hey2.5');
  // Stake key
  const stakeKey = await accountKey.derive(
    numbers.ChainDerivations.ChimericAccount,
  );
  const stakeKey2 = await stakeKey.derive(numbers.StakingKeyIndex);
  const stakeKey3 = await stakeKey2.to_raw_key();

  console.log('hey2.6');
  const stakeKeyPub = await stakeKey3.to_public();
  console.log('hey2.7');

  console.log('hey2.8');


  const rewardAddress = await (
    await (
      await RewardAddress.new(
        parseInt(TESTNET_NETWORK_INDEX),
        await StakeCredential.from_keyhash(await stakeKeyPub.hash()),
      )
    ).to_address()
  ).to_bech32();

  console.log('hey3');
  const externalPubAddress = [];
  for (let i = 0; i < TOTAL_ADDRESS_INDEX; i++) {
    // eslint-disable-next-line no-await-in-loop
    const externalPubAddressM = await generatePayAddress(
      masterKeyPtr,
      0,
      BASE_ADDRESS_INDEX,
      TESTNET_NETWORK_INDEX,
    );

    if (externalPubAddressM && externalPubAddressM.length) {
      externalPubAddress.push({
        index: i,
        network: TESTNET_NETWORK_INDEX,
        reference: '',
        tags: [],
        address: externalPubAddressM,
      });
    }
  }
  const internalPubAddress = [];
  for (let i = 0; i < TOTAL_ADDRESS_INDEX; i++) {
    // eslint-disable-next-line no-await-in-loop
    const internalPubAddressM = await generatePayAddress(
      masterKeyPtr,
      1,
      BASE_ADDRESS_INDEX, // TODO, set exact index, or is the position
      TESTNET_NETWORK_INDEX,
    );

    console.log('hey4');
    if (internalPubAddressM && internalPubAddressM.length) {
      internalPubAddress.push({
        index: i,
        network: TESTNET_NETWORK_INDEX,
        reference: '',
        tags: [],
        address: internalPubAddressM,
      });
    }
  }


  const newAccount = {
    accountName,
    balance: '0',
    tokens: [],
    encryptedMasterKey,
    publicKeyHex,
    encryptedPublicKeyHex,
    rewardAddress,
    internalPubAddress,
    externalPubAddress,
    mode: 'Full'
  };
  return newAccount;
};

import '../../shim';
import {Wallet} from 'react-native-cardano';
// @ts-ignore
import {randomBytes} from 'react-native-randombytes';

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {generateMnemonic, mnemonicToEntropy} from 'bip39';

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
  console.log('generateAdaMnemonic');
  Wallet.checkAddress(
    'DdzFFzCqrhtCUjHyzgvgigwA5soBgDxpc8WfnG1RGhrsRrWMV8uKdpgVfCXGgNuXhdN4qxPMvRUtbUnWhPzxSdxJrWzPqACZeh6scCH5',
  ).then(isValid => console.log(isValid)); // Should print "true"
  //return generateMnemonic(CONFIG.MNEMONIC_STRENGTH, randomBytes);

  const mne = generateMnemonic(CONFIG.MNEMONIC_STRENGTH, randomBytes);
  console.log('mne');
  console.log(mne);
  return mne;
};

export const generateWalletRootKey2: (
  mnemonic: string,
) => Promise<any> = async (mnemonic: string) => {
  /*
  await CardanoModule.load();

  console.log('CardanoModule.wasmV4.Bip32PrivateKey 2');
  console.log(CardanoModule.wasmV4.Bip32PrivateKey);
  console.log(Bip32PrivateKey);
  console.log(await Bip32PrivateKey);
  console.log(typeof CardanoModule.wasmV4.Bip32PrivateKey);

  const bip39entropy = mnemonicToEntropy(mnemonic);
  const EMPTY_PASSWORD = Buffer.from('');
  const rootKey = await CardanoModule.wasmV4.Bip32PrivateKey.from_bip39_entropy(
    Buffer.from(bip39entropy, 'hex'),
    EMPTY_PASSWORD,
  );
  console.log('rootKey');
  console.log(rootKey);
  return rootKey;
  */
};
export const generateWalletRootKey: (mnemonic: string) => Promise<any> = async (
  mnemonic: string,
) => {
  /*
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
   */
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

export const getMasterKeyFromMnemonic = async (mnemonic: string) => {
  /*
  const masterKeyPtr = await generateWalletRootKey2(mnemonic);
  console.log('masterKeyPtr');
  console.log(masterKeyPtr);
  return Buffer.from(await masterKeyPtr.as_bytes()).toString('hex');
  */
};

export const getAccountFromMasterKey = async (masterKey: string) => {
  /*
  console.log('getAccountFromMasterKey');
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

   */
};

export const createAccount = async (
  mnemonic: string,
  accountName: string,
  pass: string,
) => {
  /*
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
  return {
    account,
    masterKey,
    mnemonic,
    externalAdresses,
    internalAdresses,
  };

   */
};

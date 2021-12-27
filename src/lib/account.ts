// @ts-ignore
import {randomBytes} from 'react-native-randombytes';
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {generateMnemonic, mnemonicToEntropy} from 'bip39';
import {Bip32PrivateKey} from '@emurgo/react-native-haskell-shelley';

export const CONFIG = {
  MNEMONIC_STRENGTH: 160,
};

/**
 * wallet key generation
 */

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
export const createAccount = (
  mnemonic: string,
  accountName: string,
  pass: string,
) => {
  const rootKey = generateWalletRootKey(mnemonic);

  return {
    mnemonic,
    rootKey
  }
};

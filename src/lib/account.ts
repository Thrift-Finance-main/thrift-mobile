// @ts-ignore
import {randomBytes} from 'react-native-randombytes';
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {generateMnemonic, mnemonicToEntropy} from 'bip39';

export const CONFIG = {
  MNEMONIC_STRENGTH: 160,
};

/**
 * wallet key generation
 */

export const generateAdaMnemonic = () => {
  return generateMnemonic(CONFIG.MNEMONIC_STRENGTH, randomBytes);
};

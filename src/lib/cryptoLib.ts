/**
 * encryption/decryption
 */

import cryptoRandomString from 'crypto-random-string';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  decrypt_with_password,
  encrypt_with_password,
} from '@emurgo/react-native-haskell-shelley';

export const encryptData = async (
  plaintextHex: string,
  secretKey: string,
): Promise<string> => {
  const secretKeyHex = Buffer.from(secretKey, 'utf8').toString('hex');
  const saltHex = cryptoRandomString({length: 2 * 32});
  const nonceHex = cryptoRandomString({length: 2 * 12});
  // eslint-disable-next-line no-return-await
  return await encrypt_with_password(
    secretKeyHex,
    saltHex,
    nonceHex,
    plaintextHex,
  );
};

export const decryptData = async (
  ciphertext: string,
  secretKey: string,
): Promise<string> => {
  const secretKeyHex = Buffer.from(secretKey, 'utf8').toString('hex');
  try {
    return await decrypt_with_password(secretKeyHex, ciphertext);
  } catch (error) {
    console.log('error');
    console.log(error);
    return 'Decrypt error'; // TODO
  }
};

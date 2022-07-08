/**
 * encryption/decryption
 */

import cryptoRandomString from 'crypto-random-string';
import {
  decrypt_with_password,
  encrypt_with_password,
} from '@emurgo/react-native-haskell-shelley';

export const encryptData = async (
    plaintextHex: string,
    secretKey: string,
): Promise<string> => {
  const secretKeyHex = Buffer.from(secretKey, 'utf8').toString('hex')
  const saltHex = cryptoRandomString({length: 2 * 32});
  const nonceHex = cryptoRandomString({length: 2 * 12});

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
  const secretKeyHex = Buffer.from(secretKey, 'utf8').toString('hex')
  try {
    return await decrypt_with_password(secretKeyHex, ciphertext);
  } catch (e) {
    console.log('error');
    console.log(e);
    return e
  }
};

export function decryptWithPassword(
    password: string,
    encryptedHex: string
) {
  const encryptedBytes = Buffer.from(encryptedHex, 'hex');
  let decryptedBytes;
  try {
    decryptedBytes = decrypt_with_password(
        password,
        encryptedBytes
    );
  } catch (error) {
    throw error;
  }
  return decryptedBytes;
}

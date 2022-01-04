/*
import '../../shim';
import {encrypt_with_password} from '@emurgo/react-native-haskell-shelley';
import cryptoRandomString from 'crypto-random-string';
// @ts-ignore
import crypto from 'crypto';

export const getRandomBytes = async (n: number) => {
  return crypto.randomBytes(n).toString('hex');
};
// eslint-disable-next-line import/prefer-default-export
export const encryptData = async (
  plaintextHex: string,
  secretKey: string,
): Promise<string> => {
  console.log('encryptData');
  const secretKeyHex = Buffer.from(secretKey, 'utf8').toString('hex');

  const saltHex2 = cryptoRandomString({length: 2 * 32});
  const nonceHex2 = cryptoRandomString({length: 2 * 12});

  console.log('saltHex2');
  console.log(saltHex2);
  console.log('nonceHex2');
  console.log(nonceHex2);

  return encrypt_with_password(secretKeyHex, saltHex2, nonceHex2, plaintextHex);
};
*/

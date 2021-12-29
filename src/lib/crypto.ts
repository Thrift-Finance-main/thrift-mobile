import {encrypt_with_password} from '@emurgo/react-native-haskell-shelley';
// @ts-ignore
import {randomBytes} from 'react-native-randombytes';
import crypto from 'crypto';

export const getRandomBytes = async (n: number) => {
  return await randomBytes(n, (err, bytes) => {
    // bytes is a Buffer object
    // console.log(bytes.toString('hex'));
    return bytes.toString('hex');
  });
};
// eslint-disable-next-line import/prefer-default-export
export const encryptData = async (
  plaintextHex: string,
  secretKey: string,
): Promise<string> => {
  console.log('encryptData');
  const secretKeyHex = Buffer.from(secretKey, 'utf8').toString('hex');

  const saltHex = crypto.randomBytes(32).toString('base64');
  const nonceHex = crypto.randomBytes(32).toString('base64');

  console.log(secretKeyHex);
  console.log(saltHex);
  console.log(nonceHex);

  return encrypt_with_password(secretKey, saltHex, nonceHex, plaintextHex);
};

import {generateMnemonic, mnemonicToEntropy} from 'bip39';
import {CONFIG} from "./config";
import {Bip32PrivateKey, decrypt_with_password, encrypt_with_password} from "@emurgo/cardano-serialization-lib-nodejs";
import {randomBytes} from 'react-native-randombytes';
import cryptoRandomString from 'crypto-random-string';
import {ACCOUNT_ERRORS} from "../constants/error";
/**
 * wallet key generation
 */

export const generateAdaMnemonic = () => {
    return generateMnemonic(CONFIG.MNEMONIC_STRENGTH, randomBytes);
}

export const generateWalletRootKey: (mnemonic: string) => Promise<Bip32PrivateKey> = async (mnemonic: string) => {
    const bip39entropy = mnemonicToEntropy(mnemonic);
    const EMPTY_PASSWORD = Buffer.from('');
    const rootKey = await Bip32PrivateKey.from_bip39_entropy(Buffer.from(bip39entropy, 'hex'), EMPTY_PASSWORD);
    return rootKey
}

/**
 * encryption/decryption
 */
export const encryptData = async (plaintextHex: string, secretKey: string): Promise<string> => {
    const secretKeyHex = Buffer.from(secretKey, 'utf8').toString('hex')
    const saltHex = cryptoRandomString({length: 2 * 32})
    const nonceHex = cryptoRandomString({length: 2 * 12})
    return await encrypt_with_password(secretKeyHex, saltHex, nonceHex, plaintextHex);
}
export const decryptData = async (ciphertext: string, secretKey: string): Promise<string> => {
    const secretKeyHex = Buffer.from(secretKey, 'utf8').toString('hex')
    try {
        return await decrypt_with_password(secretKeyHex, ciphertext)
    } catch (error:any) {
        if (error.message === 'Decryption error') {
            throw ACCOUNT_ERRORS.DECRYPT_ERROR;
        }
        throw ACCOUNT_ERRORS.DECRYPT_COMMON_ERROR;
    }
}

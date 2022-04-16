import {clearAll, getAllKeys, getMultipleData, getObj, removeData, storeObj} from "./LocalApis";
import {
    ACCOUNT_TABLE,
    CONFIGURATION_COMMON_DATA_TABLE,
    CONFIGURATION_DATA_TABLE,
    TRANSACTION_DATA_TABLE
} from "./tables";
import {ERROR_ACCOUNT} from "../constants/error";


interface Release {
    version: string;
}

class LiteDb implements Release {
    version: string;

    constructor(version:string) {
        this.version = version;
    }

    async addAccount(account: IAccount): Promise<{ error: string } | undefined> {
        // Check if account already exists
        let accExists = await getObj(ACCOUNT_TABLE + ':' + account.accountName)

        if (!accExists) {
            console.log('store obj');
            await storeObj(ACCOUNT_TABLE + ':' + account.accountName,account);
        } else {
            console.log(ERROR_ACCOUNT.ACCOUNT_ALREADY_EXISTS);
            return {
                error: ERROR_ACCOUNT.ACCOUNT_ALREADY_EXISTS
            }
        }

    }
    async getAllAccounts() {
        let allAccounts = [];
        let keys = await getAllKeys();
        if (keys){
            // filter account keys
            keys = keys.filter(k => k.includes(ACCOUNT_TABLE));
            allAccounts = await getMultipleData(keys);
        }
        // console.log(JSON.parse(allAccounts));
        return allAccounts;
    }
    async getCurrentAccount() {
        try {
            const commonConfig = await getObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE);
            const currentAccountName = commonConfig.currentAccountName;
            return await getObj(ACCOUNT_TABLE + ':' + currentAccountName);
        }  catch (e) {
            return {
                error: e
            }
        }
    }
    async getAccount(accountName:string) {
        try {
            return await getObj(ACCOUNT_TABLE + ':' + accountName);
        }  catch (e) {
            return {
                error: e
            }
        }
    }
    async updateAccount(account:any) {
        try {
            await storeObj(ACCOUNT_TABLE + ':' + account.accountName,account);
        }  catch (e) {
            return {
                error: e
            }
        }
    }
    async removeAccount(accountName:string) {
        try {
            await removeData(ACCOUNT_TABLE + ':' + accountName);
            return accountName;
        }  catch (e) {
            return {
                error: e
            }
        }
    }
    async setCurrentAccount(accountName:string) {
        try {
            if (accountName && accountName.length){
                let commonConfig = await getObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE);
                commonConfig.currentAccountName = accountName;
                await storeObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE,commonConfig);
                console.log('commonConfig');
                console.log(commonConfig);
            }
        }  catch (e) {
            return {
                error: e
            }
        }
    }
    // Transactions
    async setAccountTransaction(accountName:string, transaction:any) {
        try {
            if (accountName && accountName.length){
                await storeObj(
                    ACCOUNT_TABLE + ':'
                        + accountName+':'
                        + TRANSACTION_DATA_TABLE+':'
                        + transaction.txHash, transaction);
            }
        }  catch (e) {
            return {
                error: e
            }
        }
    }
    // Transactions
    async getAccountTransaction(accountName:string, txHash:any) {
        try {
            if (accountName && accountName.length){
                return await getObj(ACCOUNT_TABLE + ':'
                   + accountName + ':'
                   + TRANSACTION_DATA_TABLE + ':'
                   + txHash);
            }
        }  catch (e) {
            return {
                error: e
            }
        }
    }
    async getAccountTransactionsHashes(accountName:string) {
        try {
            if (accountName && accountName.length){
                let account = await getObj(ACCOUNT_TABLE + ':' + accountName);
                return account.history
            }
        }  catch (e) {
            return {
                error: e
            }
        }
    }
    async setAccountTransactionsHashes(accountName:string, history) {
        try {
            if (accountName && accountName.length){
                let account = await getObj(ACCOUNT_TABLE + ':' + accountName);
                account.history = history;
                await storeObj(ACCOUNT_TABLE + ':' + accountName, account);
            }
        }  catch (e) {
            return {
                error: e
            }
        }
    }
    // Language
    async setCurrentLanguage(language:string) {
        try {
            let commonConfig = await getObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE);
            commonConfig.language = language;
            await storeObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE,commonConfig);
        }  catch (e) {
            return {
                error: e
            }
        }
    }
    async getCurrentLanguage() {
        try {
            let commonConfig = await getObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE);
            return commonConfig.language;
        }  catch (e) {
            return {
                error: e
            }
        }
    }
    async getCurrentConfig() {
        try {
            return await getObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE);
        }  catch (e) {
            return {
                error: e
            }
        }

    }
    async setPincode(pinhash:string) {
        try {
            let commonConfig = await getObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE);
            commonConfig.pinhash = pinhash;
            await storeObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE, commonConfig);
        }  catch (e) {
            return {
                error: e
            }
        }
    }

    async getPincode() {
        try {
            let commonConfig = await getObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE);
            return commonConfig.pinhash;
        }  catch (e) {
            return {
                error: e
            }
        }
    }
    async setConfig(confObj) {
        try {
            if (confObj){
                await storeObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE, confObj);
                let commonConfig = await getObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE);
            }
        }  catch (e) {
            return {
                error: e
            }
        }
    }
    async removeDb() {
        try {
            await clearAll();
        }  catch (e) {
            return {
                error: e
            }
        }
    }
}

export const apiDb = new LiteDb('0.1.0');

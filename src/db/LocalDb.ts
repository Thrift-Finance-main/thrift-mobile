import {getAllKeys, getMultipleData, getObj, storeObj} from "./LocalApis";
import {ACCOUNT_DATA_TABLE, CONFIGURATION_COMMON_DATA_TABLE, CONFIGURATION_DATA_TABLE} from "./tables";
import {ERROR_ACCOUNT} from "../constants/error";


interface Release {
    version: string;
}

class LocalDb implements Release {
    version: string;

    constructor(version:string) {
        this.version = version;
    }

    async addAccount(account: IAccount): Promise<{ error: string } | undefined> {
        console.log('AddAccount');
        console.log(account);

        // Check if account already exists
        let accExists = await getObj(ACCOUNT_DATA_TABLE + ':' + account.accountName)

        console.log('accExists');
        console.log(accExists);
        if (!accExists) {
            console.log('store obj');
            await storeObj(ACCOUNT_DATA_TABLE + ':' + account.accountName,account);
            accExists = await getObj(ACCOUNT_DATA_TABLE + ':' + account.accountName)
            console.log('accExists2');
            console.log(accExists);
        } else {
            console.log(ERROR_ACCOUNT.ACCOUNT_ALREADY_EXISTS);
            return {
                error: ERROR_ACCOUNT.ACCOUNT_ALREADY_EXISTS
            }
        }

    }
    async getAllAccounts(): Promise<IAccount[]> {
        console.log('getAllAccounts');

        let allAccounts = [];
        let keys = await getAllKeys();
        if (keys){
            // filter account keys
            keys = keys.filter(k => k.includes(ACCOUNT_DATA_TABLE));
            console.log('Keys filtered');
            console.log(keys);
            allAccounts = await getMultipleData(keys);
        }

        console.log('allAccounts');
        console.log(allAccounts);
        console.log(JSON.parse(allAccounts));
        return allAccounts;
    }
    async getCurrentAccount() {
        console.log('getCurrentAccount');
        try {
            const commonConfig = await getObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE);
            const currentAccountName = commonConfig.currentAccountName;
            return await getObj(ACCOUNT_DATA_TABLE + ':' + currentAccountName);
        }  catch (e) {
            return {
                error: e
            }
        }
    }
    async setCurrentAccount(accountName:string) {
        console.log('setCurrentAccount');
        try {
            let commonConfig = await getObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE);
            commonConfig.currentAccountName = accountName;
            await storeObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE,commonConfig);
        }  catch (e) {
            return {
                error: e
            }
        }
    }
    async getCurrentConfig() {
        console.log('getCurrentConfig');
        try {
            return await getObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE);
        }  catch (e) {
            return {
                error: e
            }
        }

    }
    async setConfig(confObj) {
        console.log('setConfig');
        try {
            await storeObj(CONFIGURATION_DATA_TABLE + ':' + CONFIGURATION_COMMON_DATA_TABLE, confObj);
        }  catch (e) {
            return {
                error: e
            }
        }

    }
}

export const apiDb = new LocalDb('0.1.0');

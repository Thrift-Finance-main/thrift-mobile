import {createAccount} from "../lib/account";
import {getAllKeys, getMultipleData, getObj, storeObj} from "./LocalApis";
import {ACCOUNT_DATA_TABLE} from "./tables";
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
        console.log('AddAccount');

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
}

export const apiDb = new LocalDb('0.1.0');

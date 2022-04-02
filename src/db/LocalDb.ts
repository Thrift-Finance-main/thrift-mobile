import {createAccount} from "../lib/account";
import {getObj, storeObj} from "./LocalApis";
import {ACCOUNT_DATA_TABLE} from "./tables";


interface Release {
    version: string;
}

class LocalDb implements Release {
    version: string;

    constructor(version:string) {
        this.version = version;
    }

    async AddAccount(account: Account): Promise<void> {
        console.log('AddAccount');
        console.log(account);

        // Check if account already exists
        const accExists = await getObj(ACCOUNT_DATA_TABLE + ':' + account.accountName)

        if (!accExists) {
            await storeObj(ACCOUNT_DATA_TABLE + ':' + account.accountName,account);
        }
    }
}

export const apiDb = new LocalDb('0.1.0');

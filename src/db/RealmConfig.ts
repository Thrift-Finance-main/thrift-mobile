import Realm from 'realm';
import {
  APP_CONFIGURATION,
  AppConfigurationSchema,
  IConfig,
} from './model/appConfigModel';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {AddressSchema} from './model/AddressModel';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {StakeAddressSchema} from './model/StakeAddressModel';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {NativeTokenSchema} from './model/NativeTokenModel';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {ACCOUNT_TABLE, AccountSchema, IAccount} from './model/AccountModel';
import AppConfiguration = Realm.AppConfiguration;

const {UUID} = Realm.BSON;

export class RealmDb {
  config: AppConfiguration;

  realm: Realm;

  constructor() {
    this.config = {id: 'REALM-APP-ID-2'};
    this.realm = new Realm();
    this.initDb().then(() => {});
  }

  initDb = async () => {
    this.realm = await Realm.open({
      path: 'version11',
      schema: [
        AppConfigurationSchema,
        AddressSchema,
        StakeAddressSchema,
        NativeTokenSchema,
        AccountSchema,
      ],
      schemaVersion: 11,
      migration: (oldRealm, newRealm) => {
        console.log('migrate');
        /*
        // only apply this change if upgrading to schemaVersion 2
        if (oldRealm.schemaVersion < 5) {
          const oldObjects = oldRealm.objects(ACCOUNT_TABLE);
          const newObjects = newRealm.objects(ACCOUNT_TABLE);
          // loop through all objects and set the fullName property in the new schema
          for (const objectIndex in oldObjects) {
            const oldObject = oldObjects[objectIndex];
            const newObject = newObjects[objectIndex];
            newObject.accountName = oldObject.accountName;
            newObject.balance = oldObject.balance;
            newObject.tokens = oldObject.tokens;
            newObject.encryptedMasterKey = oldObject.encryptedMasterKey;
            newObject.publicKeyHex = oldObject.publicKeyHex;
            newObject.rewardAddress = oldObject.rewardAddress;
            newObject.internalPubAddress = oldObject.internalPubAddress;
            newObject.externalPubAddress = oldObject.externalPubAddress;
            newObject.mode = oldObject.mode;
          }
          */
      },
    });
  };

  getConfig = async () => {
    return this.realm.objects(APP_CONFIGURATION);
  };

  setConfig = async (config: IConfig) => {
    console.log('set config');

    // get current config
    const appConfiguration = this.realm.objects(APP_CONFIGURATION);

    if (!appConfiguration.length) {
      console.log('Initialize config');
      this.realm.write(() => {
        this.realm.create(APP_CONFIGURATION, {
          _id: new UUID(), // create a _id with a randomly generated UUID
          name: config.name,
          currentAccount: config.currentAccount,
          language: config.language,
          currentEndpoint: config.currentEndpoint,
          version: config.version,
        });
      });
    } else {
      console.log('Update config');
      console.log(appConfiguration);
      const appConf: Realm.Object = appConfiguration[0];
      console.log(appConf);
      // @ts-ignore
      console.log(appConf.name);
      this.realm.write(() => {
        // @ts-ignore
        appConf.name = 'Patri';
        appConf.currentAccount = '';
      });
      console.log('appConf');
      console.log(appConf);
    }
  };

  setLanguage = async (lang: string) => {
    console.log('set language');
    console.log(lang);
    // get current config
    const appConfiguration = this.realm.objects(APP_CONFIGURATION);
    const appConf: Realm.Object = appConfiguration[0];
    this.realm.write(() => {
      // @ts-ignore
      appConf.language = lang;
    });
  };

  getLanguage = async () => {
    console.log('get language');

    // get current config
    const appConfiguration = this.realm.objects(APP_CONFIGURATION);
    const appConf: Realm.Object = appConfiguration[0];
    console.log(appConf);
    // @ts-ignore
    console.log(appConf.language);
    // @ts-ignore
    return appConf.language;
  };

  setCurrentAccount = async (currentAccount: string) => {
    console.log('setCurrentAccount in Realm');
    console.log(currentAccount);

    // get current config
    const appConfiguration = this.realm.objects(APP_CONFIGURATION);
    const appConf: Realm.Object = appConfiguration[0];
    this.realm.write(() => {
      // @ts-ignore
      appConf.currentAccount = currentAccount;
    });
  };

  getCurrentAccount = async () => {
    console.log('getCurrentAccount');
    // get current config
    const appConfiguration = this.realm.objects(APP_CONFIGURATION);
    if (appConfiguration && appConfiguration.length) {
      return appConfiguration[0].currentAccount;
    }
  };

  removeAccount = async (accountName: string) => {
    console.log('removeAccount');
    this.realm.write(() => {
      let acc = this.realm.objectForPrimaryKey(ACCOUNT_TABLE, accountName); // search for a realm object with a primary key that is an int.
      console.log('acc');
      console.log(acc);
      if (acc) {
        this.realm.delete(acc);
        console.log('deleted');
        console.log(acc);
        // @ts-ignore
        acc = null;
      }
    });
  };

  addAccount = async (account: IAccount) => {
    console.log('addAccount');

    let alreadyExists = false;
    const acc = this.realm.objectForPrimaryKey(
      ACCOUNT_TABLE,
      account.accountName,
    ); // search for a realm object with a primary key that is an int.

    if (acc) {
      alreadyExists = true;
    }

    if (!alreadyExists) {
      console.log('new Account');
      console.log(JSON.stringify(account, null, 2));

      // TODO: refactor as Account Class, use contructor
      const tokens = account.tokens.map(token => {
        token._id = new UUID();
        return token;
      });
      const internalPubAddress = account.internalPubAddress.map(addr => {
        addr._id = new UUID();
        return addr;
      });
      const externalPubAddress = account.externalPubAddress.map(addr => {
        addr._id = new UUID();
        return addr;
      });
      const newAccount: IAccount = {
        // @ts-ignore
        _id: new UUID(), // create a _id with a randomly generated UUID
        accountName: account.accountName,
        pinHash: account.pinHash,
        balance: account.balance,
        tokens,
        encryptedMasterKey: account.encryptedMasterKey,
        publicKeyHex: account.publicKeyHex,
        internalPubAddress,
        externalPubAddress,
        rewardAddress: account.rewardAddress,
        mode: account.mode,
      };
      console.log('\nnew Account final');
      console.log(JSON.stringify(newAccount, null, 2));
      try {
        this.realm.write(() => {
          this.realm.create(ACCOUNT_TABLE, newAccount);
        });
        await this.setCurrentAccount(account.accountName);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('Account Name already exists');
      return {
        error: 'Account already exists',
      };
    }
  };

  getAccount = async (accountName: string) => {
    return this.realm.write(() => {
      // search for a realm object with a primary key that is an int.
      return this.realm.objectForPrimaryKey(ACCOUNT_TABLE, accountName);
    });
  };

  updatePINAccount = async (accountName: string, pinHash: string) => {
    return this.realm.write(() => {
      // search for a realm object with a primary key that is an int.
      const acc: Realm.Object = this.realm.objectForPrimaryKey(
        ACCOUNT_TABLE,
        accountName,
      );
      acc.pinHash = pinHash;
    });
  };

  getAllAccounts = async () => {
    return this.realm.objects(ACCOUNT_TABLE);
  };

  closeDb = () => {
    this.realm.close();
  };
}

const realmDb = new RealmDb();

export default realmDb;

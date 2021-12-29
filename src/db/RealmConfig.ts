import Realm from 'realm';
import {
  AppConfigurationSchema,
  APP_CONFIGURATION,
  IConfig,
  // eslint-disable-next-line import/extensions,import/no-unresolved
} from './model/appConfigModel';
import AppConfiguration = Realm.AppConfiguration;
// eslint-disable-next-line import/extensions,import/no-unresolved
import {AddressSchema} from './model/AddressModel';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {StakeAddressSchema} from './model/StakeAddressModel';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {NativeTokenSchema} from './model/NativeTokenModel';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {AccountSchema} from './model/AccountModel';

const {UUID} = Realm.BSON;

export class RealmDb {
  config: AppConfiguration;

  realm: Realm;

  constructor() {
    this.config = {id: 'REALM-APP-ID-1'};
    this.realm = new Realm();
    this.initDb().then(() => {});
  }

  initDb = async () => {
    this.realm = await Realm.open({
      schema: [
        AppConfigurationSchema,
        AddressSchema,
        StakeAddressSchema,
        NativeTokenSchema,
        AccountSchema,
      ],
      schemaVersion: 4,
    });
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
      });
      console.log(appConf);
    }
  };

  setLanguage = async (lang: string) => {
    console.log('set language');
    console.log(lang);

    const realm = await Realm.open({
      schema: [AppConfigurationSchema],
      schemaVersion: 2,
    });
    // get current config
    const appConfiguration = realm.objects(APP_CONFIGURATION);
    const appConf: Realm.Object = appConfiguration[0];
    realm.write(() => {
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

  closeDb = () => {
    this.realm.close();
  };
}

const realmDb = new RealmDb();

export default realmDb;

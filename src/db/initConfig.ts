import realmDb from "./RealmConfig";
import {IConfig} from "./model/appConfigModel";

export const DEFAULT_CONFIG: IConfig = {
    _id: '0',
    currentAccount: '',
    language: 'en',
    currentEndpoint: 'http://192.168.1.141:3101/graphql',
    version: '0.1.0',
};

export const initConfig = () => {
    console.log('initConfig');
    let currentConfig = DEFAULT_CONFIG;
    realmDb.getConfig().then(r =>{
        if (r.length){
            currentConfig = r[0]
        } else {
            realmDb.setConfig(currentConfig).then(r => {});
        }
    });
    return currentConfig;
};

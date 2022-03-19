export const APP_CONFIGURATION = 'APP_CONFIGURATION';

export interface IConfig {
  _id: string;
  currentAccount: string;
  language: string;
  currentEndpoint: string;
  version: string;
}
export const AppConfigurationSchema = {
  name: APP_CONFIGURATION,
  primaryKey: '_id',
  properties: {
    _id: 'uuid',
    currentAccount: 'string',
    language: 'string',
    currentEndpoint: 'string',
    version: 'string',
  },
};

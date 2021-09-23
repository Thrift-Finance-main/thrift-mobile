export interface IConfig {
    _id: string,
    name: string,
    currentAccount: string,
    language: string,
    currentEndpoint: string,
    version: string,
}
export const AppConfigurationSchema = {
    name: "AppConfiguration",
    primaryKey: "_id",
    properties: {
        _id: "uuid",
        name: "string",
        currentAccount: "string",
        language: "string",
        currentEndpoint: "string",
        version: "string"
    },
};

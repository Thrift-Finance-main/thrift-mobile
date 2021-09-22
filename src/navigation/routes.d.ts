declare module '*.json' {
    const value: any;
    export default value;
}

interface JsonArray extends Array<string|number|boolean|Date|Json|JsonArray> { }

interface Json {
    [x: string]: string|number|boolean|Date|Json|JsonArray;
}



interface Release {
    version: string;
}

class LocalDb implements Release {
    version: string;

    constructor(version:string) {
        this.version = version;
    }

    AddAccount(account: Account): void {

    }
}

export const apiDb = new LocalDb('0.1.0');

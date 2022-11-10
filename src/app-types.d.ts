declare const enum OP {
    upload = 'u',
    download = 'd',
    list = 'l',
}

type Operation = {
    local: string,
    operation: OP,
    remote: string;
}

type Options = {
    host: string;
    port?: string;
    username: string;
    password?: string;
    keyfile?: string;
    key?: string;
    help?: string;
    
    _unknown: string[];
    ftp: string[];
    alias?: string[];

    filePairs: Operation[]; // generated from ftp
    aliasPairs?: { [name: string]: string }; // generated from alias
}

type SFTPConfig = {
    host: string;
    username: string;
    password?: string;
    privateKey?: string;
    port?: number;
}

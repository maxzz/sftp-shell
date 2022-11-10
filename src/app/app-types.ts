export const enum OP {
    upload = 'u',
    download = 'd',
    list = 'l',
}

export type Operation = {
    local: string,
    operation: OP,
    remote: string;
}

export type Options = {
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

export type SFTPConfig = {
    host: string;
    username: string;
    password?: string;
    privateKey?: string;
    port?: number;
}

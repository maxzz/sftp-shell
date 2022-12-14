// Config file options

export type ProcessingOptions = {
    ftp: string[];
    alias?: string[];
};

// App options

export const enum OP {
    upload = 'u',
    download = 'd',
    list = 'l',
}

export type Operation = {
    local: string,
    operation: OP,
    remote: string;
};

export type Aliases = Record<string, string>;

export type AppOptions = {
    credentials: ArgsCredentials;
    filePairs: Operation[];         // generated from ArgsOptions.ftp
    aliasPairs?: Aliases;           // alias -> value;  generated from ArgsOptions.alias
};

// Arguments

export type SFTPConfig = {
    host: string;
    username: string;
    password?: string;
    privateKey?: string;
    port?: number;
};

export type ArgsCredentials = {
    host: string;
    port?: string;
    username: string;
    password?: string;
    keyfile?: string;
    key?: string;
};

export type ArgsOptions = ArgsCredentials & ProcessingOptions & {
    help?: string;
    _unknown: string[];
};

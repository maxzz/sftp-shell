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

export type ArgsOptions = ArgsCredentials & {
    help?: string;

    _unknown: string[];
    ftp: string[];
    alias?: string[];

    // filePairs: Operation[]; // generated from ftp
    // aliasPairs?: Record<string, string>; // alias -> value;  generated from alias
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

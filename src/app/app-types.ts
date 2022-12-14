import { ConnectConfig } from 'ssh2';

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
    credentials: SFTPCredentials;
    filePairs: Operation[];         // generated from ArgsOptions.ftp
    aliasPairs?: Aliases;           // alias -> value;  generated from ArgsOptions.alias
};

// Arguments

export type SFTPCredentials = Pick<ConnectConfig, 'host' | 'port' | 'username' | 'password' | 'privateKey'>;
// {
//     host: string;
//     port?: number;
//     username: string;
//     password?: string;
//     privateKey?: string;
// };

export type ArgCredentials = {
    host: string;
    port?: string;
    username: string;
    password?: string;
    keyfile?: string;
    key?: string;
};

export type ArgOptions = ArgCredentials & ProcessingOptions & {
    help?: string;
    _unknown: string[];
};

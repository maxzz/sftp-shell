import type { ConnectConfig } from 'ssh2';
export type { ConnectConfig as SSHConnectConfig } from 'ssh2';

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
    credentials: ConnectConfig;
    operations: Operation[];        // generated from ArgsOptions.ftp
    aliases: Aliases;               // alias -> value;  generated from ArgsOptions.alias
};

// Arguments

export type ArgCredentials = {
    host: string;
    port?: string;
    username: string;
    password?: string;
    keyfile?: string;               //key?: string; // not used any more, but canbe easily added
};

export type ArgProcessingOptions = ArgCredentials & ProcessingOptions;

export type ArgOptions = ArgProcessingOptions & {
    help?: string;
    _unknown: string[];
    config?: string[];
};

import type { ConnectConfig } from 'ssh2';
export type { ConnectConfig as SSHConnectConfig } from 'ssh2'; //https://github.com/theophilusx/ssh2-sftp-client#connectconfig--sftp-object

export * from './app-argument-options';

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

export type Aliases = Record<string, string | undefined>;

export type AppOptions = {
    credentials: ConnectConfig;
    operations: Operation[];        // Generated from ArgsOptions.ftp
    aliases: Aliases;               // alias -> value;  generated from ArgsOptions.alias
};

// Arguments

export type ArgCredentials = {
    host: string;
    port?: string;
    username: string;
    password?: string;
    keyfile?: string;               // key?: string; // not used any more, but can be easily added
    verbose?: boolean;              // Show debug information
};

export type FtpsAndAliases = {      // Config file options
    ftp: string[];                  // Theoretically, it can be optional if aliases used.
    alias?: string[];               // List of alias definitions in format: alias=value
};

export type ArgProcessingOptions =
    & ArgCredentials
    & FtpsAndAliases;

export type CLIOptions =
    & ArgProcessingOptions
    & {
        help?: boolean;             // Show help and exit
        config?: string[];          // List of json5 files to load additional configs from
        trace?: boolean;            // Trace program input arguments
        _unknown: string[];         // Any unknown options the will be complained about
    };

import fs from 'fs';
import commandLineArgs from 'command-line-args';
import { optionDefinitions } from './app-argument-options';
import { OP, Operation, ArgOptions, AppOptions, ArgCredentials, Aliases, SFTPCredentials, ArgProcessingOptions } from './app-types';
import { terminate } from './app-errors';
import { help, helpEx } from './app-help';
import { printAppVersion, printAppDone } from './app-messages';
import { formatDeep } from '../utils/utils-aliases';
import path from 'path';

function getConnectConfig(c: ArgCredentials): SFTPCredentials {
    if (c.keyfile) {
        try {
            c.keyfile = formatDeep(c.keyfile, process.env);
            c.keyfile = fs.readFileSync(c.keyfile).toString();
        } catch (error) {
            terminate(`Cannot read SFTP access key file: '${c.keyfile}'`);
        }
    }
    return {
        username: c.username,
        host: c.host,
        ...(c.port && { port: +c.port }),
        ...(c.password && { password: c.password }),
        ...(c.keyfile && { privateKey: c.keyfile }),
    };
}

function getAliases(aliases: string[]): Aliases {
    return aliases?.reduce((acc: any, cur: string) => {
        const [key, val] = cur.split('=').map((value) => value.trim());
        if (!key || !val) {
            terminate(`Invalid alias: '${cur}'`);
        }
        acc[key] = val;
        return acc;
    }, {}) || {};
}

function getOperations(ftp: string[] = []): Operation[] {
    return ftp.map((cur) => {
        const parts = cur.split('=').map((value) => value.trim());
        if (parts.length !== 3) {
            terminate(`Wrong files pair: ${cur}`);
        }
        const [local, operation, remote] = parts;
        const item = { local, operation, remote, } as Operation;

        if (item.operation.length !== 1 || !~'udl'.indexOf(item.operation)) {
            terminate(`Invalid operation (should be one of: u | d | l) for:\n    ${cur}`);
        }
        return item;
    });
}

function getConfigs(names: string[] = []): AppOptions[] {
    function getConfigAppOptions(name: string): AppOptions {
        try {
            name = formatDeep(name, process.env);
            const cnt = fs.readFileSync(name).toString();
            const obj = JSON.parse(cnt) as ArgProcessingOptions;
            return {
                credentials: getConnectConfig(obj),
                operations: getOperations(obj.ftp),
                aliases: getAliases(obj.alias),
            };
        } catch (error) {
            terminate(`Failed to get config file: '${name}'. error: ${error.toString()}`);
        }
    }
    return names.map((name) => getConfigAppOptions(name)).filter(Boolean);
}

function checkCreads(options: SFTPCredentials) {
    const totalCreds: number = +!!options.privateKey + +!!options.password;
    if (totalCreds > 1) {
        terminate(`Specify only one of: <password>, <keyfile>.`);
    }
    const basicOK = options.host && options.username && (options.password || options.privateKey);
    if (!basicOK) {
        terminate('Missing: host || username || password || keyfile');
    }
}

function checkOperationLocalFiles(operations: Operation[], aliases: Aliases): void {
    operations.forEach((item) => {
        item.local = path.resolve(path.normalize(formatDeep(item.local, aliases)));
        if (item.operation === OP.upload) {
            if (!fs.existsSync(item.local)) {
                console.log(`\nFailed FTP pair: ${JSON.stringify(item)}\n`);
                terminate(`File not exists: ${item.local}`);
            }
        }
    });
}

function validate(argOptions: ArgOptions): AppOptions {
    const rv = {} as AppOptions;

    // 1. Creds

    rv.credentials = getConnectConfig(argOptions);

    if (!rv.credentials.username) {
        terminate('There is no username to login.');
    }

    // 2. Aliases

    rv.aliases = getAliases(argOptions.alias);

    // 3. External configs

    const configs = getConfigs(argOptions.config); // TODO: aliases before everything and update after each config parsed

    // 4. Operations

    if (!argOptions.ftp?.length) {
        terminate('Missing: <ftp> commands list to perform');
    }

    rv.operations = getOperations(argOptions.ftp);

    if (!rv.operations.length) {
        console.log(`\nOperations to be processed are not defined. Done.`);
        help();
        printAppDone();
        process.exit(0);
    }

    checkOperationLocalFiles(rv.operations, rv.aliases);
    checkCreads(rv.credentials);

    return rv;
}

function checkHelpCall(argOptions: ArgOptions) {
    if (argOptions.help || !Object.keys(argOptions).length) {
        help();
        helpEx();
        process.exit(0);
    }

    if (argOptions._unknown) {
        terminate(`Unknown option(s):\n${argOptions._unknown.map(_ => `        '${_}'\n`).join('')}`);
    }
}

export function getVerifiedArguments(): AppOptions {
    printAppVersion();

    const argOptions = commandLineArgs(optionDefinitions, { stopAtFirstUnknown: true }) as ArgOptions;

    checkHelpCall(argOptions);
    const appOptions: AppOptions = validate(argOptions);

    return appOptions;
}

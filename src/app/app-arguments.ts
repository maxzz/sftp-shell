import fs from 'fs';
import commandLineArgs from 'command-line-args';
import { optionDefinitions } from './app-argument-options';
import { OP, Operation, ArgOptions, AppOptions, ArgCredentials, Aliases, SFTPCredentials, ArgProcessingOptions } from './app-types';
import { terminate } from './app-errors';
import { help, helpEx } from './app-help';
import { printAppVersion, printAppDone } from './app-messages';
import { formatDeep } from '../utils/utils-aliases';

function getCreads(options: ArgOptions): ArgCredentials {
    let totalCreds: number = +!!options.keyfile + +!!options.password + +!!options.key;
    if (totalCreds > 1) {
        terminate(`Specify only one of: <password>, <keyfile>, or <key>.`);
    }

    if (options.keyfile) {
        try {
            options.keyfile = formatDeep(options.keyfile, process.env);
            options.keyfile = fs.readFileSync(options.keyfile).toString();
        } catch (error) {
            terminate(`Cannot read SFTP access key file: '${options.keyfile}'`);
        }
    }

    const basicOK = options.host && options.username && (options.password || options.keyfile || options.key);
    if (!basicOK) {
        terminate('Missing: host || username || password || keyfile');
    }

    return {
        host: options.host,
        port: options.port,
        username: options.username,
        password: options.password,
        keyfile: options.keyfile,
        key: options.key,
    };
}

function getConnectConfig(c: ArgCredentials): SFTPCredentials {
    return {
        host: c.host,
        username: c.username,
        ...(c.password && { password: c.password }),
        ...(c.keyfile && { privateKey: c.keyfile }),
        ...(c.port && { port: +c.port }),
    };
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

function checkOperationLocalFiles(operations: Operation[]): void {
    operations.forEach((item) => {
        if (item.operation === OP.upload) {
            if (!fs.existsSync(item.local)) {
                console.log(`\nFailed FTP pair: ${JSON.stringify(item)}\n`);
                terminate(`File not exists: ${item.local}`);
            }
        }
    });
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

function getConfigs(names: string[] = []): AppOptions[] {
    const configs = names.map((name) => {
        try {
            name = formatDeep(name, process.env);
            const cnt = fs.readFileSync(name).toString();
            const obj = JSON.parse(cnt) as ArgCredentials & ArgProcessingOptions;
            const rv: AppOptions = {
                credentials: getConnectConfig(obj),
                operations: getOperations(obj.ftp),
                aliases: getAliases(obj.alias),
            };
            return rv;
        } catch (error) {
            terminate(`Failed to get config file: '${name}'. error: ${error.toString()}`);
        }
    }).filter(Boolean);
    return configs;
}

function validate(argOptions: ArgOptions): AppOptions {
    const rv = {} as AppOptions;

    const configs = getConfigs(argOptions.config); // TODO: aliases before everything

    // 1. Creds

    rv.credentials = getConnectConfig(getCreads(argOptions));

    if (!rv.credentials.username) {
        terminate('There is no username to login.');
    }

    // 2. Aliases

    rv.aliases = getAliases(argOptions.alias);

    // 3. Operations

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
    checkOperationLocalFiles(rv.operations);

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

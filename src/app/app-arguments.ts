import fs from 'fs';
import commandLineArgs from 'command-line-args';
import { OP, Operation, ArgsOptions, AppOptions, ArgsCredentials } from './app-types';
import { optionDefinitions } from './app-argument-options';
import { terminate } from './app-errors';
import { help, helpEx } from './app-help';
import { printAppVersion, printAppDone } from './app-messages';
import { formatDeep } from '../utils/utils-aliases';

function getCreads(options: ArgsOptions): ArgsCredentials {
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

function getOperations(ftp: string[]): Operation[] {
    const rv = ftp.map((cur) => {
        const files = cur.split('=');
        if (files.length !== 3) {
            terminate(`Wrong files pair: ${cur}`);
        }

        const item: Operation = {
            local: files[0].trim(),
            operation: files[1].trim() as OP,
            remote: files[2].trim()
        };

        if (item.operation.length !== 1 || !~'udl'.indexOf(item.operation)) {
            terminate(`Invalid operation (not u | d | l) for:\n    ${cur}`);
        }

        if (item.operation === OP.upload) {
            if (!fs.existsSync(item.local)) {
                console.log(`\nFile pairs: ${JSON.stringify(ftp, null, 4)}\n`);
                terminate(`File not exists: ${item.local}`);
            }
        }
        return item;
    });
    return rv;
}

function getAliases(options: ArgsOptions): Record<string, string> {
    // aliases
    let rv: Record<string, string> = {};
    if (options.alias) {
        rv = options.alias.reduce((acc: any, cur: string) => {
            const [key, val] = cur.split('=').map((value) => value.trim());
            if (!key || !val) {
                terminate(`Invalid alias: '${cur}'`);
            }
            acc[key] = val;
            return acc;
        }, {});
    }
    return rv;
}

function validate(options: ArgsOptions): AppOptions {
    if (options.help || !Object.keys(options).length) {
        help();
        helpEx();
        process.exit(0);
    }

    if (options._unknown) {
        terminate(`Unknown option(s):\n${options._unknown.map(_ => `        '${_}'\n`).join('')}`);
    }

    const appOptions = {} as AppOptions;

    // 1. Creds

    appOptions.credentials = getCreads(options);

    if (!appOptions.credentials.username) {
        terminate('There is no username to login.');
    }

    // 2. Aliases

    appOptions.aliasPairs = getAliases(options);

    // 3. Operations

    if (!options.ftp?.length) {
        terminate('Missing: <ftp> commands list to perform');
    }

    appOptions.filePairs = getOperations(options.ftp || []);

    if (!appOptions.filePairs.length) {
        console.log(`\nOperations to be processed are not defined. Done.`);
        help();
        printAppDone();
        process.exit(0);
    }

    return appOptions;
}

export function getVerifiedArguments(): AppOptions {
    printAppVersion();

    const options = commandLineArgs(optionDefinitions, { stopAtFirstUnknown: true }) as ArgsOptions;
    const appOptions = validate(options);

    return appOptions;
}

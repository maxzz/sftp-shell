import fs from 'fs';
import commandLineArgs from 'command-line-args';
import { optionDefinitions } from './app-argument-options';
import { OP, Operation, ArgOptions, AppOptions, ArgCredentials, Aliases, SSHConnectConfig, ArgProcessingOptions } from './app-types';
import { terminate } from './app-errors';
import { help, helpEx } from './app-help';
import { printAppVersion, printAppDone, printConnectionVerbose } from './app-messages';
import { formatDeep } from '../utils/utils-aliases';
import path from 'path';
import chalk from 'chalk';
import JSON5 from 'json5';

function getConnectConfig(c: ArgCredentials): SSHConnectConfig {
    if (c.keyfile) {
        try {
            c.keyfile = formatDeep(c.keyfile, process.env);
            c.keyfile = fs.readFileSync(c.keyfile, { encoding: 'utf8' });
        } catch (error) {
            terminate(`Cannot read SFTP access key file: '${c.keyfile}'`);
        }
    }
    const con: SSHConnectConfig = {
        username: c.username,
        host: c.host,
        ...(c.port && { port: +c.port }),
        ...(c.password && { password: c.password }),
        ...(c.keyfile && { privateKey: c.keyfile }),
        ...(c.verbose && { debug: printConnectionVerbose }),
    };
    return con;
}

function getAliases(aliases: string[] | string = []): Aliases {
    if (typeof aliases === 'string') {
        aliases = [aliases];
    }
    return aliases.reduce((acc: any, cur: string) => {
        const [key, val] = cur.split('=').map((value) => value.trim());
        if (!key || !val) {
            terminate(`Invalid alias: '${cur}'`);
        }
        acc[key] = val;
        return acc;
    }, {}) || {};
}

function getOperations(ftp: string[] | string = []): Operation[] {
    if (typeof ftp === 'string') {
        ftp = [ftp];
    }
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

function getExternalConfigs(names: string[] = []): AppOptions[] {
    function getConfigAppOptions(name: string): AppOptions {
        try {
            name = path.resolve(formatDeep(name, process.env));
            const cnt = fs.readFileSync(name).toString();
            try {
                const obj = JSON5.parse(cnt) as ArgProcessingOptions;
                return {
                    credentials: getConnectConfig(obj),
                    operations: getOperations(obj.ftp),
                    aliases: getAliases(obj.alias),
                };
            } catch (error) {
                terminate(`${chalk.yellow('Failed to parse config file:')}\n        ${chalk.gray(name)}\n    error: ${error.toString()}`);
            }
        } catch (error) {
            terminate(`${chalk.yellow('Failed to get config file:')}\n        ${chalk.gray(name)}\n    error: ${error.toString()}`);
        }
    }
    return names.map((name) => getConfigAppOptions(name)).filter(Boolean);
}

function validate(argOptions: ArgOptions): AppOptions {

    const configs = getExternalConfigs(argOptions.config); // TODO: aliases before everything and update after each config parsed
    configs.push({
        credentials: getConnectConfig(argOptions),
        aliases: getAliases(argOptions.alias),
        operations: getOperations(argOptions.ftp),
    });
    const rv: AppOptions = mergeConfigs(configs);

    // Checks

    checkCreads(rv.credentials);
    checkOperationLocalFiles(rv.operations, rv.aliases);

    if (!rv.operations.length) {
        console.log(`\nOperations to be processed are not defined (Missing: <ftp> commands list to perform).`);
        help();
        printAppDone();
        process.exit(0);
    }

    return rv;

    function checkCreads(options: SSHConnectConfig) {
        if (!options.username) {
            terminate('There is no username to login.');
        }
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

    function mergeConfigs(all: AppOptions[]): AppOptions {
        const rv = {
        } as AppOptions;

        rv.credentials = all.find((config) => !!config.credentials.username)?.credentials || {}; // will use the first one
        rv.aliases = all.reduce((acc, curr) => Object.assign({}, acc, curr.aliases), {}); // the last one wins

        rv.operations = all.reduce((acc, curr) => {
            acc.push(...curr.operations);
            return acc;
        }, []);

        return rv;
    }
}

export function getVerifiedArguments(): AppOptions {
    printAppVersion();

    console.log(chalk.gray(`Working directory: ${process.cwd()}`));

    const argOptions = commandLineArgs(optionDefinitions, { stopAtFirstUnknown: true }) as ArgOptions;

    checkHelpCall(argOptions);
    const appOptions: AppOptions = validate(argOptions);

    return appOptions;

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
}

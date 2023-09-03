import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import JSON5 from 'json5';
import { ArgOptions, AppOptions, ArgProcessingOptions } from '../types';
import { help, printAppDone, terminate } from '../utils-app';
import { formatDeep } from '../../utils';
import { getConnectConfig } from './options-connect-config';
import { getAliases } from './options-aliases';
import { getOperations } from './options-operations';
import { checkCreads } from './check-credentials';
import { checkOperationLocalFilesPresence } from './check-operation-files';
import { mergeOptions } from './merge-configs';

export function validate(argOptions: ArgOptions): AppOptions {

    const ourOptions = getAppOptions(argOptions);
    const allOptions = getExternalConfigs(argOptions.config); // TODO: aliases before everything and update after each config parsed
    
    allOptions.push(ourOptions);

    const finalOptions: AppOptions = mergeOptions(allOptions);

    // Checks

    checkCreads(finalOptions.credentials);
    checkOperationLocalFilesPresence(finalOptions.operations, finalOptions.aliases);

    if (!finalOptions.operations.length) {
        console.log(`\nOperations to be processed are not defined (Missing: <ftp> commands list to perform).`);
        help();
        printAppDone();
        process.exit(0);
    }

    return finalOptions;
}

function getAppOptions(opt: ArgProcessingOptions): AppOptions {
    return {
        aliases: getAliases(opt.alias),
        credentials: getConnectConfig(opt),
        operations: getOperations(opt.ftp),
    };
}

function getExternalConfigs(names: string[] = []): AppOptions[] {
    return names.map((name) => getConfigAppOptions(name)).filter(Boolean);

    function getConfigAppOptions(name: string): AppOptions {
        try {
            name = path.resolve(formatDeep(name, process.env));
            const cnt = fs.readFileSync(name).toString();
            try {
                const opt = JSON5.parse(cnt) as ArgProcessingOptions;
                return getAppOptions(opt);
            } catch (error) {
                terminate(`${chalk.yellow('Failed to parse config file:')}\n        ${chalk.gray(name)}\n    error: ${(error as any).toString()}`);
            }
        } catch (error) {
            terminate(`${chalk.yellow('Failed to get config file:')}\n        ${chalk.gray(name)}\n    error: ${(error as any).toString()}`);
        }
    }
}

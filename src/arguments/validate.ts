import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import JSON5 from 'json5';
import { Aliases, AppOptions, ArgProcessingOptions } from '../types';
import { help, printAliases, printAppDone, terminate } from '../utils-app';
import { formatDeep, removeQuates } from '../utils';
import { getConnectConfig } from './options-connect-config';
import { getAliases } from './options-aliases';
import { getOperations } from './options-operations';
import { checkCreads } from './check-credentials';
import { checkOperationLocalFilesPresence } from './check-operation-files';
import { mergeOptions } from './merge-configs';

export type ValidateOptions = {
    argOptions: ArgProcessingOptions;
    externalConfigs: string[];
    aliasesToResolveExternalConfigs?: Aliases; // TODO: do aliasesToResolveExternalConfigs before everything and update after each config parsed
};

export function validate({ argOptions, externalConfigs, aliasesToResolveExternalConfigs }: ValidateOptions): AppOptions {

    const ourOptions = getAppOptions(argOptions);
    const allOptions = getExternalConfigs({ configfilenames: externalConfigs, aliases: aliasesToResolveExternalConfigs });

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
        credentials: getConnectConfig(opt),
        operations: getOperations(opt.ftp),
        aliases: getAliases(opt.alias),
    };
}

function getExternalConfigs({ configfilenames, aliases }: { configfilenames: string[]; aliases?: Aliases }): AppOptions[] {
    return configfilenames.map((name) => loadConfigFile(name)).filter(Boolean);

    function loadConfigFile(filename: string): AppOptions {
        try {
            const finalFilename = path.resolve(removeQuates(formatDeep(filename, aliases || {})));
            const cnt = fs.readFileSync(finalFilename).toString();

            try {
                const opt = JSON5.parse(cnt) as ArgProcessingOptions;
                return getAppOptions(opt);
            } catch (error) {
                printAliases(finalFilename, aliases || {});
                terminate(`${chalk.yellow('Failed to parse config file:')}\n        ${chalk.gray(filename)}\n    error: ${(error as any).toString()}`);
            }

        } catch (error) {
            printAliases(filename, aliases || {});
            terminate(`${chalk.yellow('Failed to get config file:')}\n        ${chalk.gray(filename)}\n    error: ${(error as any).toString()}`);
        }
    }
}

import commandLineArgs from 'command-line-args';
import { OptionDefinitions, optionDefinitions } from '../app-argument-options';
import { ArgOptions, AppOptions } from '../types';
import chalk from 'chalk';
import { printAppVersion, help, helpEx, terminate } from '../utils-app';
import { validate } from './validate';

export function getVerifiedArguments(): AppOptions {
    printAppVersion();

    console.log(chalk.gray(`Working directory: ${process.cwd()}`));

    const argOptions = commandLineArgs(optionDefinitions as OptionDefinitions, { stopAtFirstUnknown: true }) as ArgOptions;

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

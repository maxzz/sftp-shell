import commandLineArgs from 'command-line-args';
import { ArgOptions, AppOptions, cliOptionsDefinitions } from '../types';
import { validate } from './validate';
import { printAppVersion, help, helpEx, terminate } from '../utils-app';
import chalk from 'chalk';

export function getVerifiedArguments(): AppOptions {
    printAppVersion();

    console.log(chalk.gray(`Working directory: ${process.cwd()}`));

    const argOptions = commandLineArgs(cliOptionsDefinitions, { stopAtFirstUnknown: true }) as ArgOptions;

    checkHelpCall(argOptions);

    const rv: AppOptions = validate(argOptions);
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

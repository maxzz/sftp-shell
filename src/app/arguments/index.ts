import commandLineArgs from 'command-line-args';
import { CLIOptions, AppOptions, cliOptionsDefinitions } from '../types';
import { validate } from './validate';
import { printAppVersion, help, helpEx, terminate } from '../utils-app';
import chalk from 'chalk';

export function getVerifiedArguments(): AppOptions {
    printAppVersion();

    console.log(chalk.gray(`Working directory: ${process.cwd()}`));

    const argOptions = commandLineArgs(cliOptionsDefinitions, { stopAtFirstUnknown: true }) as CLIOptions;

    checkHelpCall(argOptions);

    const rv: AppOptions = validate(argOptions, argOptions.config || []);
    return rv;
}

function checkHelpCall(argOptions: CLIOptions) {
    if (argOptions.help || !Object.keys(argOptions).length) {
        help();
        helpEx();
        process.exit(0);
    }

    if (argOptions._unknown) {
        terminate(`Unknown option(s):\n${argOptions._unknown.map(_ => `        '${_}'\n`).join('')}`);
    }
}

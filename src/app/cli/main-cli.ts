import commandLineArgs from 'command-line-args';
import { CLIOptions, AppOptions, cliOptionsDefinitions } from '../../types';
import { ValidateOptions, validate } from '../../arguments';
import { printAppVersion, help, helpEx, terminate } from '../../utils-app';
import chalk from 'chalk';

export function getCLIVerifiedArguments(): AppOptions {
    printAppVersion();

    console.log(chalk.gray(`Working directory: ${process.cwd()}`));

    const argOptions = commandLineArgs(cliOptionsDefinitions, { stopAtFirstUnknown: true }) as CLIOptions;

    checkHelpCall(argOptions);

    const validateOptions: ValidateOptions = {
        argOptions,
        externalConfigs: argOptions.config || [],
        aliasesToResolveExternalConfigs: process.env,
    };

    const rv: AppOptions = validate(validateOptions);
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

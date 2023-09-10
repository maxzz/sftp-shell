import commandLineArgs from 'command-line-args';
import { CLIOptions, AppOptions, cliOptionsDefinitions } from '../../types';
import { ValidateOptions, validate } from '../../arguments';
import { printAppVersion, help, helpEx, terminate, printCLIOptions, printCommandLineArguments } from '../../utils-app';
import chalk from 'chalk';

export function getCLIVerifiedArguments(): AppOptions {
    printAppVersion();

    console.log(chalk.gray(`Working directory: ${process.cwd()}`));

    if (process.argv.length === 3) {
        printCommandLineArguments();
        terminate(`Too few options. Likely you wrap your arguments with double quotes (").`);
    }

    const argOptions = commandLineArgs(cliOptionsDefinitions, { stopAtFirstUnknown: true }) as CLIOptions;

    checkHelpCall(argOptions);

    removeDoubleQuotes(argOptions);

    if (argOptions.trace) {
        printCommandLineArguments();
        printCLIOptions(argOptions);
    }

    const validateOptions: ValidateOptions = {
        argOptions,
        externalConfigs: argOptions.config || [],
        aliasesToResolveExternalConfigs: process.env,
    };

    const rv: AppOptions = validate(validateOptions);
    return rv;
}

function removeDoubleQuotes(argOptions: CLIOptions) {
    argOptions.config = argOptions.config ? argOptions.config.map((_) => _.replace(/^"(.*)"$/, '$1')) : [];
    argOptions.ftp = argOptions.ftp ? argOptions.ftp.map((_) => _.replace(/^"(.*)"$/, '$1')) : [];  
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

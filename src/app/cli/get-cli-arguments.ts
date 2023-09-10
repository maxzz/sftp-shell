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

    if (process.argv.length === 3) {
        printCommandLineArguments();
        terminate(`Too few options. Likely you wrap your options with double quotes (").`);
    }

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

function printCommandLineArguments() {
    console.log(chalk.cyan(`\nCommand line arguments: \n${process.argv.map((str,idx)=>`    ${idx}: ${str}`).join('\n')}`));
}

function printCLIOptions(cliOptions: CLIOptions) {
    console.log(chalk.cyan('\nargOptions = \n'), JSON.stringify(cliOptions, null, 4), '\n');
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

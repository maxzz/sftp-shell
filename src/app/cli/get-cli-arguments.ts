import commandLineArgs from 'command-line-args';
import { CLIOptions, AppOptions, cliOptionsDefinitions } from '../../types';
import { ValidateOptions, validate } from '../../arguments';
import { printAppVersion, help, helpEx, terminate } from '../../utils-app';
import chalk from 'chalk';

function removeDoubleQuotes(argOptions: CLIOptions) {
    argOptions.config = argOptions.config ? argOptions.config.map((_) => _.replace(/^"(.*)"$/, '$1')) : [];
    argOptions.ftp = argOptions.ftp ? argOptions.ftp.map((_) => _.replace(/^"(.*)"$/, '$1')) : [];  
}

export function getCLIVerifiedArguments(): AppOptions {
    printAppVersion();

    console.log(chalk.gray(`Working directory: ${process.cwd()}`));

    console.log(chalk.cyan(`\nCommand line arguments: \n${process.argv.map((str,idx)=>`    ${idx}: ${str}`).join('\n')}`));

    const argOptions = commandLineArgs(cliOptionsDefinitions, { stopAtFirstUnknown: true }) as CLIOptions;

    removeDoubleQuotes(argOptions);

    console.log(chalk.cyan('\nargOptions = \n'), JSON.stringify(argOptions, null, 4), '\n');

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

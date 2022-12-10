import * as chalk from 'chalk';//const chalk = require('chalk'); //import chalk from 'chalk';

const commandLineUsage = require('command-line-usage');
//const commandLineArgs = require('command-line-args');

export const { name: progrmaName } = require('../../package.json');

export const HEADER0 =
    `  _   _   _   _  
 / \\ / \\ / \\ / \\ 
( S . F . T . P )
 \\_/ \\_/ \\_/ \\_/`;

const HEADER = chalk.green(HEADER0);

export function printHeader(): void {
    console.log(HEADER);
}

export function printHeaderAndVersion(): void {
    console.log(`${HEADER}\n  version ${progrmaName}\n`);
    console.log(HEADER);
}

export function printMessageBeforeExit(msg: string): void {
    console.log(`${chalk.redBright('\nTerminated:')}\n    ${msg}`);
    help();
    printHeader();
}

export function printOnExitError(error: Error): void {
    console.log('\nSFTP error: ', chalk.redBright(error.message));
    console.log('\nSFTP stack: ', error.stack);
    console.log(chalk.red(`${HEADER0}`));
}

export function printOnExit(msg: string): void {
    console.log(msg);
    console.log(`${HEADER}`);
}

export const optionDefinitions = [
    {
        name: 'host',
        type: String,
        description: 'Host name like "www.crossmatch.com"'
    },
    {
        name: 'port',
        type: String,
        description: 'SFTP port.'
    },
    {
        name: 'username',
        alias: 'u',
        type: String,
        description: 'User name for this session.'
    },
    {
        name: 'password',
        alias: 'p',
        type: String,
        description: 'User password.'
    },
    {
        name: 'keyfile',
        type: String,
        description: 'Path to key file. This will be expanded with environment variables.'
    },
    {
        name: 'key',
        type: String,
        description: 'User key'
    },
    {
        name: 'ftp',
        alias: 'f',
        type: String,
        multiple: true,
        description: `Every line must have: <local> = <oparation> = <remote>
            where opration is one of:
                "u" - upload to ftp,
                "d" - download from ftp,
                "l" - list ftp folder content.
                For example:
                    <localPathAndFileName> = u = <remotePathAndFileName>
                    <localPathAndFileName> = d = <remotePathAndFileName>
                    <localPathAndFileName> = l = <remotePath>
                * Existing local files will be overwritten silently.
                * It is possible for remote path to use macro \\{start\\}
                  which is start working folder.`
    },
    {
        name: 'alias',
        alias: 'a',
        type: String,
        multiple: true,
        description: 'Aliases to expand on remote path after start remote folder aquired from SFTP.'
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Show this help screen.'
    }
];

export function help() {
    const usage = commandLineUsage([
        {
            header: 'SFTP client shell',
            content: 'Transfer files to/from FTP server over SFTP protocol.'
        },
        {
            header: 'Options',
            optionList: optionDefinitions
        },
        {
            header: 'Example:',
            content: `{cyan sftp-shell}
            --host "appserver.live.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in"
            --port 2222
            --username "live.b82019b8-481a-44c8-88da-be3d2af3cfbb"
            --keyfile "\\{USERPROFILE\\}/.ssh/id_rsa"
            --alias "root = \\{start\\}/files/crossmatch"
            --alias "g01 = \\{root\\}/AltusAddons/g01"
            --ftp "test/listC.json = l = \\{start\\}/files/crossmatch/AltusAddons/g01"
            --ftp "test/listD.json = l = \\{g01\\}/current"`
        },
        {
            content: `Project owner: {underline maxz}`
        },
    ]);
    console.log(usage);
}

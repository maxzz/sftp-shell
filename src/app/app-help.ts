import chalk from 'chalk';//const chalk = require('chalk'); //import chalk from 'chalk';
import { optionDefinitions } from './app-options';
import commandLineUsage from 'command-line-usage';

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

import chalk from 'chalk';
import { help } from './app-help';

export const progrmaName = 'sftp-shell'; //export const { name: progrmaName } = require('../../package.json');

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

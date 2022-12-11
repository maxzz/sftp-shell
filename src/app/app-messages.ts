import path from 'path';
import chalk from 'chalk';
import { help } from './app-help';
import { Operation, Options } from './app-types';

export const progrmaName = 'sftp-shell'; //export const { name: progrmaName } = require('../../package.json');

const HEADER0 =
`  _   _   _   _  
 / \\ / \\ / \\ / \\ 
( S . F . T . P )
 \\_/ \\_/ \\_/ \\_/`;

const HEADER1 =`
 ┌─┐┌─┐┌┬┐┌─┐
 └─┐├┤  │ ├─┘
 └─┘└   ┴ ┴ `;

const HEADER = chalk.green(HEADER1);

export function printHeader() {
    console.log(HEADER);
}

export function printHeaderAndVersion() {
    console.log(`${HEADER}\n  version ${progrmaName}\n`);
    console.log(HEADER);
}

export function printMessageBeforeExit(msg: string) {
    console.log(`${chalk.redBright('\nTerminated:')}\n    ${msg}`);
    help();
    printHeader();
}

// sftp loop

const opName = (s: string) => s === 'u' ? 'Upload to FTP' : s === 'd' ? 'Download from FTP' : s === 'l' ? 'List folder content' : '?';
const plural = (n: number) => n === 1 ? '' : 's';

export const printOnConnectionCloased = () => console.log(chalk.yellow(`Connection closed\n`));

export function printLoopStart(o: Options, sftpWorkingDir: string) {
    console.log(`  Remote root: ${sftpWorkingDir}`);
    console.log(chalk.cyan(`\n  Stating ${o.filePairs.length} operation${plural(o.filePairs.length)}.`));
}

export function printLoopCurrentOp(item: Operation) {
    console.log(chalk.gray(`    Operation: ${opName(item.operation)}\n        Local: ${path.normalize(item.local)}\n       Remote: ${item.remote}`));
}

export function printLoopEnd(o: Options) {
    printOnExit(chalk.cyan(`  Completed ${o.filePairs.length} operation${plural(o.filePairs.length)}.`));
}

export function printLoopEndError(error: unknown) {
    printOnExitError(error as Error);
}

function printOnExit(msg: string) {
    console.log(msg);
    console.log(`${HEADER}`);
}

function printOnExitError(error: Error) {
    console.log('\nSFTP error: ', chalk.redBright(error.message));
    console.log('\nSFTP stack: ', error.stack);
    console.log(chalk.red(`${HEADER0}`));
}

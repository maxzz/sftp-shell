import path from 'path';
import chalk from 'chalk';
import { help } from './app-help';
import { Operation, Options } from './app-types';

export const appName = 'sftp-shell'; //export const { name: progrmaName } = require('../../package.json');
export const appVersion = '1.2.0'; //export const { version: progrmaName } = require('../../package.json');

const HEADER1 = `
o o o o o o o o o SFTP o o o o o o o o o`;

const HEADER2 = `
  ┌┬┐┌─┐┌┐┌┌─┐
   │││ ││││├┤ 
  ─┴┘└─┘┘└┘└─┘`;

const HEADER3 = `
  ┌─┐┌─┐┬┬  ┌─┐┌┬┐
  ├┤ ├─┤││  ├┤  ││
  └  ┴ ┴┴┴─┘└─┘─┴┘`;

export function printHeader() {
    console.log(chalk.cyan(HEADER1));
    // console.log(chalk.green(HEADER2));
    // console.log(chalk.red(`${HEADER3}`));
}

export function printHeaderAndVersion() {
    console.log(`SFTP client shell ${chalk.cyan(appName)} version ${appVersion}.`);
    printHeader();
}

export function printMessageBeforeExit(msg: string) {
    console.log(`${chalk.redBright('\nTerminated:')}\n    ${msg}`);
    help();
    printHeader();
}

// sftp loop

const opName = (s: string) => s === 'u' ? 'Upload to FTP' : s === 'd' ? 'Download from FTP' : s === 'l' ? 'List folder content' : '?';
const plural = (n: number) => n === 1 ? '' : 's';

export const printOnConnectionCloased = () => console.log(chalk.gray(`SFTP connection closed\n`));

export function printLoopStart(o: Options, sftpWorkingDir: string) {
    console.log(chalk.gray(`\n  Remote root: ${sftpWorkingDir}`));
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
    console.log(chalk.green(`${HEADER2}`));
}

function printOnExitError(error: Error) {
    console.log('\nSFTP error: ', chalk.redBright(error.message));
    console.log('\nSFTP stack: ', error.stack);
    console.log(chalk.red(`${HEADER3}`));
}

import chalk from 'chalk';
import { Operation, ArgOptions, AppOptions } from './app-types';
import { toUnix } from '../utils/utils-os';

export const appName = 'sftp-shell'; //export const { name: progrmaName } = require('../../package.json');
export const appVersion = '2.0.5'; //export const { version: progrmaName } = require('../../package.json');

const HEADER1 = `
o o o o o o o o o SFTP o o o o o o o o o`;

const HEADER2 = `
─┬┐┌─┐┌┐┌┌─┐
 │││ ││││├┤ 
─┴┘└─┘┘└┘└─┘
`;

const HEADER3 = `
  ┌─┐┌─┐┬┬  ┌─┐┌┬┐  
  ├┤ ├─┤││  ├┤  ││  
  └  ┴ ┴┴┴─┘└─┘─┴┘  
`;

export function printSftpStart() {
    console.log(chalk.cyan(HEADER1));
}

export function printAppDone() {
    console.log(chalk.green(HEADER2));
}

export function printAppFailed() {
    console.log(chalk.bgRed.white(`${HEADER3}`));
}

//

export function printAppVersion() {
    console.log(`The ${chalk.cyan(appName)} utility transfers files to/from an FTP server\nusing SFTP (SSH File Transfer Protocol). version ${appVersion}.`);
}

export function printMessageBeforeExit(msg: string) {
    console.log(`${chalk.redBright('\nTerminated:')}\n    ${msg}`);
}

// sftp loop

const opName = (s: string) => s === 'u' ? 'Upload to FTP' : s === 'd' ? 'Download from FTP' : s === 'l' ? 'List folder content' : '?';
const plural = (n: number) => n === 1 ? '' : 's';

export function printOnConnectionCloased() {
    return console.log(chalk.gray(`\n  SFTP connection closed.`));
}

export function printLoopStart(o: AppOptions, sftpWorkingDir: string) {
    printSftpStart();
    console.log(chalk.gray(`\n  Remote root: ${sftpWorkingDir}`));
    console.log(chalk.cyan(`\n  Stating ${o.filePairs.length} operation${plural(o.filePairs.length)}.`));
}

export function printLoopCurrentOp(item: Operation) {
    console.log(chalk.gray(`    Operation: ${opName(item.operation)}\n        Local: ${toUnix(item.local)}\n       Remote: ${item.remote}`));
}

export function printLoopEnd(o: AppOptions) {
    console.log(chalk.cyan(`  Successfully completed ${o.filePairs.length} operation${plural(o.filePairs.length)}.`));
}

export function printLoopEndError(error: unknown) {
    printOnExitError(error as Error);
}

function printOnExitError(error: Error) {
    console.log('\nSFTP error: ', chalk.redBright(error.message));
    console.log('\nSFTP stack: ', error.stack);
    console.log(chalk.red(`${HEADER3}`));
}

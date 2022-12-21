import chalk from 'chalk';
import type { ForegroundColor } from 'chalk';
import { Operation, AppOptions } from './app-types';
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
  └  ┴ ┴┴┴─┘└─┘─┴┘  `;

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
    console.log(`The ${chalk.cyan(appName)} utility transfers files to/from an FTP server\nusing SFTP (SSH File Transfer Protocol). ${appName} version is ${appVersion}.`);
}

export function printMessageBeforeExit(msg: string) {
    console.log(`${chalk.redBright('\nTerminated:')}\n    ${msg}`);
}

// sftp loop

const opName = (s: string) => s === 'u' ? 'Upload to FTP' : s === 'd' ? 'Download from FTP' : s === 'l' ? 'List folder content' : '?';
const plural = (n: number) => n === 1 ? '' : 's';

export function printOnConnectionClosed() {
    return console.log(chalk.gray(`\n  SFTP connection closed.`));
}

export function printLoopStart(o: AppOptions, sftpWorkingDir: string) {
    printSftpStart();
    console.log(chalk.gray(`\n  Remote root: ${sftpWorkingDir}`));
    console.log(chalk.cyan(`\n  Stating ${o.operations.length} operation${plural(o.operations.length)}.`));
}

export function printLoopCurrentOp(item: Operation) {
    console.log(chalk.gray(`    Operation: ${opName(item.operation)}\n        Local: ${toUnix(item.local)}\n       Remote: ${item.remote}`));
}

export function printLoopEnd(o: AppOptions) {
    console.log(chalk.cyan(`  Successfully completed ${o.operations.length} operation${plural(o.operations.length)}.`));
}

export function printLoopEndError(error: unknown) {
    printOnExitError(error as Error);
}

function printOnExitError(error: Error) {
    if (error.message?.match(/All configured authentication methods failed/)) {
        console.log('\nSFTP error: ', chalk.redBright(error.message));
    } else {
        console.log('\nSFTP error: ', chalk.redBright(error.message));
        console.log('SFTP stack: ', chalk.gray(error.stack));
    }
    console.log(chalk.red(`${HEADER3}`));
}

// SSH connection messages print

function printHandshakeOptions(msg: string, color: typeof ForegroundColor, newGroup: boolean) {
    const m = msg.match(/(Handshake: .*: )(.*)/);
    newGroup && console.log('');
    let list: string[] = m?.[2] ? m[2].split(',').map((str) => `    ${chalk[color](str.trim())}`) : undefined;
    if (list?.length > 1) {
        console.log(chalk[color](m[1]));
        list.forEach((str) => console.log(str));
    } else {
        console.log(chalk[color](msg));
    }
}

export function printConnectionVerbose(msg: string) {
    //console.log(msg); return;
    if (msg.match(/Handshake: \(remote\)/)) {
        printHandshakeOptions(msg, 'yellow', false);
    } else if (msg.match(/Handshake: \(local\)/)) {
        printHandshakeOptions(msg, 'blue', true);
    } else if (msg.match(/Handshake completed/)) {
        console.log(chalk.green(msg));
    } else if (msg.match(/_REQUEST/)) {
        console.log(chalk.cyan(msg));
    } else {
        console.log(chalk.gray(msg));
    }
}

//

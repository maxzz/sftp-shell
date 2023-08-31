import chalk from 'chalk';
import { Operation, AppOptions } from '../../types';
import { toUnix } from '../../../utils';
import { HEADER3, printSftpStart } from './job';

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

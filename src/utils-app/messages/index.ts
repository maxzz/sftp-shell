import chalk from 'chalk';

export const appName = 'sftp-shell'; //export const { name: progrmaName } = require('../../package.json');

//export const appVersion = '2.0.5'; //export const { version: progrmaName } = require('../../package.json');
//const pkg = require('../../../package.json');
// @ts-expect-error
import pkg from '../../../package.json';
export const { version: appVersion } = pkg;

export * from './arguments';
export * from './job';
export * from './sftp-options';
export * from './sftp-loop';
export * from './ssh-connection';

//

export function printAppVersion() {
    console.log(`The ${chalk.cyan(appName)} utility transfers files to/from an FTP server\nusing SFTP (SSH File Transfer Protocol). ${appName} version is ${appVersion}.`);
}

export function printMessageBeforeExit(msg: string) {
    console.log(`${chalk.redBright('\nTerminated:')}\n    ${msg}`);
}

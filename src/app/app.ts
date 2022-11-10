import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
const mkdir = require('mkdir-p');
import Client from 'ssh2-sftp-client';
import { OP, Operation, Options, SFTPConfig } from './app-types';
import { HEADER, HEADER0 } from './app-help';
import * as ut from '../utils/utils';

/*
//https://www.npmjs.com/package/ssh2-sftp-client#how-can-i-upload-files-without-having-to-specify-a-password

Another alternative is to just pass in the SSH key directly as part of the configuration.

let sftp = new Client();
sftp.connect({
  host: 'YOUR-HOST',
  port: 'YOUR-PORT',
  username: 'YOUR-USERNAME',
  privateKey: fs.readFileSync('/path/to/ssh/key')
}).then(() => {
  sftp.fastPut(/* ... * /)
}
*/

//host: appserver.live.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in
//port: 2222
//user: live.b82019b8-481a-44c8-88da-be3d2af3cfbb
//key: C:/Users/max/.ssh/id_rsa

//addr: /srv/bindings/463f1c6989094a37b0d02e70312a9d58/files/crossmatch/AltusAddons/g01
//addr: /srv/bindings/463f1c6989094a37b0d02e70312a9d58/files/crossmatch/AltusAddons
//addr: /srv/bindings/a6a833d30275429bb9e003114f17369f/files/crossmatch/AltusAddons
//cwd:  /srv/bindings/b9e2e7a79bdb4e1b89923a82203bd6db

const REMOTE_ROOT_URL = "/AltusAddons/g01/current";

export async function processSftp(options: Options) {
    const sftp = new Client();

    try {
        let config: SFTPConfig = {
            host: options.host,
            username: options.username,
            ...(options.password && { password: options.password }),
            ...(options.keyfile && { privateKey: options.keyfile }),
            ...(options.port && { port: +options.port }),
        };

        sftp.on('close', () => {
            console.log(`Connection closed\n`);
        });

        await sftp.connect(config);

        let cwd = await sftp.cwd();
        console.log(`  Remote root: ${cwd}`);

        let env = {
            start: cwd,
            ...options.aliasPairs
        };

        const opName = (s: string) => s === 'u' ? 'Upload to FTP' : s === 'd' ? 'Download from FTP' : s === 'l' ? 'List folder content' : '?';
        const plural = (n: number) => n === 1 ? '' : 's';

        console.log(chalk.cyan(`\n  Stating ${options.filePairs.length} operation${plural(options.filePairs.length)}.`));

        for (let i = 0; i < options.filePairs.length; i++) {
            let item: Operation = options.filePairs[i];

            item.remote = ut.formatDeep(item.remote, env);

            console.log(`    Operation: ${opName(item.operation)}\n        Local: ${path.normalize(item.local)}\n       Remote: ${item.remote}`);

            switch (item.operation) {
                case OP.upload: {
                    await sftp.fastPut(item.local, item.remote);
                }
                    break;
                case OP.download: {
                    mkdir.sync(path.dirname(item.local));
                    await sftp.fastGet(item.remote, item.local);
                }
                    break;
                case OP.list: {
                    const list = await sftp.list(item.remote);
                    mkdir.sync(path.dirname(item.local));
                    fs.writeFileSync(item.local, JSON.stringify(list, null, 4));
                }
                    break;
            }
        }//for async

        console.log(chalk.cyan(`  Completed ${options.filePairs.length} operation${plural(options.filePairs.length)}.`));
        console.log(`${HEADER}`);

        await sftp.end();
    } catch (err) {
        console.log('\nSFTP error: ', chalk.redBright(err.message));
        console.log('\nSFTP stack: ', err.stack);
        console.log(chalk.red(`${HEADER0}`));
        await sftp.end();
        process.exit(-2);
    }
}

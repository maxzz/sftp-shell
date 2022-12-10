import path from 'path';
import fs from 'fs';
import Client from 'ssh2-sftp-client';
import { OP, Operation, Options, SFTPConfig } from './app-types';
import { printLoopCurrentOp, printLoopEnd, printLoopStart, printLoopEndError, printOnConnectionCloased } from './app-messages';
import { formatDeep, mkDirSync } from '../utils/utils';

function getConnectConfig(o: Options): SFTPConfig {
    return  {
        host: o.host,
        username: o.username,
        ...(o.password && { password: o.password }),
        ...(o.keyfile && { privateKey: o.keyfile }),
        ...(o.port && { port: +o.port }),
    };
}

export async function processSftp(options: Options) {
    const sftp = new Client();
    sftp.on('close', printOnConnectionCloased);
    try {
        await sftp.connect(getConnectConfig(options));

        let sftpWorkingDir = await sftp.cwd();
        printLoopStart(options, sftpWorkingDir);

        let resolveEnv = {
            start: sftpWorkingDir,
            ...options.aliasPairs,
        };

        for (let i = 0; i < options.filePairs.length; i++) {
            let item: Operation = options.filePairs[i];

            item.remote = formatDeep(item.remote, resolveEnv);
            printLoopCurrentOp(item);

            switch (item.operation) {
                case OP.upload: {
                    await sftp.fastPut(item.local, item.remote);
                    break;
                }
                case OP.download: {
                    mkDirSync(path.dirname(item.local));
                    await sftp.fastGet(item.remote, item.local);
                    break;
                }
                case OP.list: {
                    mkDirSync(path.dirname(item.local));
                    const list = await sftp.list(item.remote);
                    fs.writeFileSync(item.local, JSON.stringify(list, null, 4));
                    break;
                }
            }
        }//for async

        printLoopEnd(options);
        await sftp.end();

    } catch (error) {
        printLoopEndError(error);
        await sftp.end();
        process.exit(-2);
    }
}

//TODO: handle path normalize before loop work

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

//const REMOTE_ROOT_URL = "/AltusAddons/g01/current";

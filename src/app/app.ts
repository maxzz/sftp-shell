import path from 'path';
import fs from 'fs';
import Client from 'ssh2-sftp-client';
import { OP, Operation, ArgsOptions, SFTPConfig, AppOptions, ArgsCredentials } from './app-types';
import { printLoopCurrentOp, printLoopEnd, printLoopStart, printLoopEndError, printOnConnectionCloased, printAppDone } from './app-messages';
import { formatDeep } from '../utils/utils-aliases';
import { mkDirSync } from '../utils/utils-os';

function getConnectConfig(c: ArgsCredentials): SFTPConfig {
    return {
        host: c.host,
        username: c.username,
        ...(c.password && { password: c.password }),
        ...(c.keyfile && { privateKey: c.keyfile }),
        ...(c.port && { port: +c.port }),
    };
}

function resolvePathes(operations: Operation[], sftpWorkingDir: string, appOptions: AppOptions): Operation[] {
    const resolveEnv = {
        start: sftpWorkingDir,
        ...appOptions.aliasPairs,
    };
    return operations.map((op) => {
        return {
            operation: op.operation,
            local: path.resolve(path.normalize(formatDeep(op.local, resolveEnv))),
            remote: formatDeep(op.remote, resolveEnv),
        };
    });
}

export async function processSftp(appOptions: AppOptions) {
    const sftp = new Client();
    sftp.on('close', printOnConnectionCloased);
    try {
        await sftp.connect(getConnectConfig(appOptions.credentials));
        const sftpWorkingDir = await sftp.cwd();
        
        printLoopStart(appOptions, sftpWorkingDir);
        const filePairs = resolvePathes(appOptions.filePairs, sftpWorkingDir, appOptions);

        for (let i = 0; i < filePairs.length; i++) {
            const item: Operation = filePairs[i];

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
                    const list = await sftp.list(item.remote);
                    mkDirSync(path.dirname(item.local));
                    fs.writeFileSync(item.local, JSON.stringify(list, null, 4));
                    break;
                }
            }
        }//for async

        printLoopEnd(appOptions);
        await sftp.end();
        printAppDone();

    } catch (error) {
        printLoopEndError(error);
        await sftp.end();
        process.exit(-2);
    }
}

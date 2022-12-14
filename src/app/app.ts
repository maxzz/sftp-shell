import path from 'path';
import fs from 'fs';
import Client from 'ssh2-sftp-client';
import { OP, Operation, ArgsOptions, SFTPConfig } from './app-types';
import { printLoopCurrentOp, printLoopEnd, printLoopStart, printLoopEndError, printOnConnectionCloased, printAppDone } from './app-messages';
import { formatDeep } from '../utils/utils-aliases';
import { mkDirSync } from '../utils/utils.-os';

function getConnectConfig(o: ArgsOptions): SFTPConfig {
    return {
        host: o.host,
        username: o.username,
        ...(o.password && { password: o.password }),
        ...(o.keyfile && { privateKey: o.keyfile }),
        ...(o.port && { port: +o.port }),
    };
}

function resolvePathes(filePairs: Operation[], sftpWorkingDir: string, options: ArgsOptions): Operation[] {
    const resolveEnv = {
        start: sftpWorkingDir,
        ...options.aliasPairs,
    };
    return filePairs.map((op) => {
        return {
            operation: op.operation,
            local: path.resolve(path.normalize(formatDeep(op.local, resolveEnv))),
            remote: formatDeep(op.remote, resolveEnv),
        };
    });
}

export async function processSftp(options: ArgsOptions) {
    const sftp = new Client();
    sftp.on('close', printOnConnectionCloased);
    try {
        await sftp.connect(getConnectConfig(options));
        const sftpWorkingDir = await sftp.cwd();
        
        printLoopStart(options, sftpWorkingDir);
        const filePairs = resolvePathes(options.filePairs, sftpWorkingDir, options);

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

        printLoopEnd(options);
        await sftp.end();
        printAppDone();

    } catch (error) {
        printLoopEndError(error);
        await sftp.end();
        process.exit(-2);
    }
}

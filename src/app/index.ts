import path from 'path';
import fs from 'fs';
import Client from 'ssh2-sftp-client';
import { OP, Operation, AppOptions, Aliases } from '../types';
import { printLoopCurrentOp, printLoopEnd, printLoopStart, printLoopEndError, printOnConnectionClosed, printAppDone } from '../utils-app';
import { formatDeep, mkDirSync } from '../utils';

export async function processSftp(appOptions: AppOptions) {
    const sftpClient = new Client();
    
    sftpClient.on('close', printOnConnectionClosed);
    try {
        await sftpClient.connect(appOptions.credentials);
        const sftpRemoteWorkingDir = await sftpClient.cwd();

        printLoopStart(appOptions, sftpRemoteWorkingDir);
        const operations = expandRemotePathes(appOptions.operations, sftpRemoteWorkingDir, appOptions.aliases);

        for (let i = 0; i < operations.length; i++) {
            const item: Operation = operations[i];

            printLoopCurrentOp(item);
            switch (item.operation) {
                case OP.upload: {
                    await sftpClient.fastPut(item.local, item.remote);
                    break;
                }
                case OP.download: {
                    mkDirSync(path.dirname(item.local));
                    await sftpClient.fastGet(item.remote, item.local);
                    break;
                }
                case OP.list: {
                    const list = await sftpClient.list(item.remote);
                    mkDirSync(path.dirname(item.local));
                    fs.writeFileSync(item.local, JSON.stringify(list, null, 4));
                    break;
                }
            }
        }//for async

        printLoopEnd(appOptions);
        await sftpClient.end();
        printAppDone();

    } catch (error) {
        printLoopEndError(error);
        await sftpClient.end();
        process.exit(-2);
    }
}

function expandRemotePathes(operations: Operation[], sftpWorkingDir: string, aliases: Aliases): Operation[] {
    const resolveEnv = {
        start: sftpWorkingDir,
        ...aliases,
    };
    return operations.map((op) => {
        return {
            operation: op.operation,
            local: op.local,
            remote: formatDeep(op.remote, resolveEnv),
        };
    });
}

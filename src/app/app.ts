import path from 'path';
import fs from 'fs';
import Client from 'ssh2-sftp-client';
import { OP, Operation, AppOptions, Aliases } from './app-types';
import { printLoopCurrentOp, printLoopEnd, printLoopStart, printLoopEndError, printOnConnectionClosed, printAppDone } from './app-messages';
import { formatDeep } from '../utils/utils-aliases';
import { mkDirSync } from '../utils/utils-os';
import chalk from 'chalk';

function resolvePathes(operations: Operation[], sftpWorkingDir: string, aliases: Aliases): Operation[] {
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

export async function processSftp(appOptions: AppOptions) {
    const sftp = new Client();
    sftp.on('close', printOnConnectionClosed);
    // sftp.on('keyboard-interactive', (name, instructions, instructionsLang, prompts) => { //https://github.com/theophilusx/ssh2-sftp-client/issues/230 never invoked
    //     console.log('++++++++++++++++++++++++++++ name %s, instructions %s, instructionsLang %s, prompts', name, instructions, instructionsLang, prompts);
    // });
    // sftp.on('ready', () => { //https://github.com/mscdex/ssh2/issues/890 <- this is breaking connection.
    //     console.log('++++++++++++++++++++++++++++ Ready event.');
    //     sftp.end();
    // });
    // sftp.on('end', () => {
    //     console.error('++++++++++++++++++++++++++++ End event.');
    // });
    // sftp.on('error', (error) => {
    //     console.error('++++++++++++++++++++++++++++ Error event.', error);
    // });
    // sftp.on('authentication', (ctx) => {
    //     console.log('++++++++++++++++++++++++++++ ctx', ctx);
    // });
    try {

        // const cfg: Client.ConnectOptions = appOptions.credentials;
        // cfg.debug = (msg) => {
        //     //console.log(msg); return;

        //     if (msg.match(/Handshake: \(remote\)/)) {
        //         console.log(chalk.yellow(msg));
        //     } else if (msg.match(/Handshake: \(local\)/)) {
        //         console.log(chalk.blue(msg));
        //     } else if (msg.match(/Handshake completed/)) {
        //         console.log(chalk.green(msg));
        //     } else if (msg.match(/_REQUEST/)) {
        //         console.log(chalk.cyan(msg));
        //     } else {
        //         console.log(chalk.gray(msg));
        //     }
        // };

        await sftp.connect(appOptions.credentials);
        const sftpWorkingDir = await sftp.cwd();

        printLoopStart(appOptions, sftpWorkingDir);
        const operations = resolvePathes(appOptions.operations, sftpWorkingDir, appOptions.aliases);

        for (let i = 0; i < operations.length; i++) {
            const item: Operation = operations[i];

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

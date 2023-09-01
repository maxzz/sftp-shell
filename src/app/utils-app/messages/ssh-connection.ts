import chalk from 'chalk';
import type { ForegroundColor } from 'chalk';

function printHandshakeOptions(msg: string, color: typeof ForegroundColor, newGroup: boolean) {
    const m = msg.match(/(Handshake: .*: )(.*)/);
    newGroup && console.log(chalk.gray('---------------------------------------'));

    let list: string[] = m?.[2] ? m[2].split(',').map((str) => `    ${chalk[color](str.trim())}`) : undefined;

    // if (list?.length === 1) {
    //     console.log(chalk[color](m[1]));
    //     list.forEach((str) => console.log(str));
    // } else
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
    }
    // else if (msg.match(/Handshake: (.*): (.*)/)) { // i.e. not local and not remote
    //     //TODO: handshake result
    // }

    else if (msg.match(/Handshake completed/)) {
        console.log(chalk.green(msg));
    } else if (msg.match(/_REQUEST/)) {
        console.log(chalk.cyan(msg));
    } else {
        console.log(chalk.gray(msg));
    }
}

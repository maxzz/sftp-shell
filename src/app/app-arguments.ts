import fs from 'fs';
import commandLineArgs from 'command-line-args';
import { OP, Operation, Options } from './app-types';
import { optionDefinitions } from './app-options';
import { terminate } from './app-errors';
import { help } from './app-help';
import { printSftpStart, printAppVersion } from './app-messages';
import { formatDeep } from '../utils/utils';

function validate(options: Options) {
    if (options.help || !Object.keys(options).length) {
        help();
        process.exit(0);
    }

    if (options._unknown) {
        terminate(`Unknown option(s):\n${options._unknown.map(_ => `        '${_}'\n`).join('')}`);
    }

    let totalCreds: number = +!!options.keyfile + +!!options.password + +!!options.key;
    if (totalCreds > 1) {
        terminate(`Specify only one from <password>, <keyfile>, or <key>.`);
    }

    if (options.keyfile) {
        try {
            options.keyfile = formatDeep(options.keyfile, process.env);
            options.keyfile = fs.readFileSync(options.keyfile).toString();
        } catch (error) {
            terminate(`Cannot read SFTP access key file: '${options.keyfile}'`);
        }
    }

    const basicOK = options.host && options.username && (options.password || options.keyfile || options.key);
    if (!basicOK) {
        terminate('Missing: host || username || password || keyfile');
    }

    // ftp pairs

    const ftpOK = options.ftp && options.ftp.length;
    if (!ftpOK) {
        terminate('Missing: <ftp> commands list to perform');
    }

    options.filePairs = options.ftp.map(_ => {
        const files = _.split('=');
        if (files.length !== 3) {
            terminate(`Wrong files pair: ${_}`);
        }

        const item: Operation = {
            local: files[0].trim(),
            operation: files[1].trim() as OP,
            remote: files[2].trim()
        };

        if (item.operation.length !== 1 || !~'udl'.indexOf(item.operation)) {
            terminate(`Invalid operation (not u | d | l) for:\n    ${_}`);
        }

        if (item.operation === OP.upload) {
            if (!fs.existsSync(item.local)) {
                console.log(`\nFile pairs: ${JSON.stringify(options.ftp, null, 4)}\n`);
                terminate(`File not exists: ${item.local}`);
            }
        }

        return item;
    });

    if (!options.filePairs.length) {
        console.log(`\nNo files to process. Done.`);
        help();
        printSftpStart();
        process.exit(0);
    }

    // aliases
    if (options.alias) {
        options.aliasPairs = options.alias.reduce((acc: any, _: string) => {
            let nameValue = _.split('=');
            if (nameValue.length !== 2) {
                terminate(`Invalid alias: '${_}'`);
            }
            acc[nameValue[0].trim()] = nameValue[1].trim();
            return acc;
        }, {});
    }
}

export function getVerifiedArguments(): Options {
    printAppVersion();
    printSftpStart();

    const options = commandLineArgs(optionDefinitions, { stopAtFirstUnknown: true }) as Options;
    validate(options);

    return options;
}

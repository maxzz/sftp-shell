import  * as fs from 'fs';
import * as chalk from 'chalk';//const chalk = require('chalk'); //import chalk from 'chalk';
const commandLineUsage = require('command-line-usage');
const commandLineArgs = require('command-line-args');
import * as ut from './utils';

export const HEADER0 =
`  _   _   _   _  
 / \\ / \\ / \\ / \\ 
( S . F . T . P )
 \\_/ \\_/ \\_/ \\_/`;

export const HEADER = chalk.green(HEADER0);

function printHeader(): void {
    console.log(HEADER);
}

 const optionDefinitions = [
    {
        name: 'host',
        type: String,
        description: 'Host name like "www.crossmatch.com"'
    },
    {
        name: 'port',
        type: String,
        description: 'SFTP port.'
    },
    {
        name: 'username',
        alias: 'u',
        type: String,
        description: 'User name for this session.'
    },
    {
        name: 'password',
        alias: 'p',
        type: String,
        description: 'User password.'
    },
    {
        name: 'keyfile',
        type: String,
        description: 'Path to key file. This will be expanded with environment variables.'
    },
    {
        name: 'key',
        type: String,
        description: 'User key'
    },
    {
        name: 'ftp',
        alias: 'f',
        type: String,
        multiple: true,
        description:
        `Every line must have: <local> = <oparation> = <remote>
            where opration is one of:
                "u" - upload to ftp,
                "d" - download from ftp,
                "l" - list ftp folder content.
                For example:
                    <localPathAndFileName> = u = <remotePathAndFileName>
                    <localPathAndFileName> = d = <remotePathAndFileName>
                    <localPathAndFileName> = l = <remotePath>
                * Existing local files will be overwritten silently.
                * It is possible for remote path to use macro \\{start\\}
                  which is start working folder.`
    },
    {
        name: 'alias',
        alias: 'a',
        type: String,
        multiple: true,
        description: 'Aliases to expand on remote path after start remote folder aquired from SFTP.'
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Show this help screen.'
    }
];

export function help() {
    const usage = commandLineUsage([
        {
            header: 'SFTP client shell',
            content: 'Transfer files to/from FTP server over SFTP protocol.'
        },
        {
            header: 'Options',
            optionList: optionDefinitions
        },
        {
            header: 'Example:',
            content: `{cyan sftp-shell}
            --host "appserver.live.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in"
            --port 2222
            --username "live.b82019b8-481a-44c8-88da-be3d2af3cfbb"
            --keyfile "\\{USERPROFILE\\}/.ssh/id_rsa"
            --alias "root = \\{start\\}/files/crossmatch"
            --alias "g01 = \\{root\\}/AltusAddons/g01"
            --ftp "test/listC.json = l = \\{start\\}/files/crossmatch/AltusAddons/g01"
            --ftp "test/listD.json = l = \\{g01\\}/current"`
        },
        {
            content: `Project owner: {underline maxz}`
        },
    ]);
    console.log(usage);
}

function terminate(msg) {
    console.log(`${chalk.redBright('\nTerminated:')}\n    ${msg}`);
    help();
    printHeader();
    process.exit(-1);
}

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
            options.keyfile = ut.formatDeep(options.keyfile, process.env);
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
        printHeader();
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

export function parse(): Options {
    let options = commandLineArgs(optionDefinitions, { stopAtFirstUnknown: true });
    validate(options);
    return options;
}

/*
interface IFilePairs {
    local: string,
    operation: 'u' | 'd' | 'l',
    remote: string
}

options.filePairs: IFilePairs;
*/

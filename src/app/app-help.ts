import commandLineUsage from 'command-line-usage';
import { appName } from './app-messages';
import { optionDefinitions } from './app-argument-options';

export function help() {
    const usage = commandLineUsage([
        // {
        //     header: 'SFTP client shell',
        //     content: 'Transfer files to/from FTP server over SFTP (SSH File Transfer Protocol).'
        // },
        {
            header: 'Options',
            optionList: optionDefinitions
        },
        {
            header: 'Example:',
            content: `{cyan ${appName}}
            --host "appserver.live.b82019b8-481a-44c8-88da-be3d2af3cfbb.drush.in"
            --port 2222
            --username "live.b82019b8-481a-44c8-88da-be3d2af3cfbb"
            --keyfile "\\{USERPROFILE\\}/.ssh/id_rsa"
            --alias "root = \\{start\\}/files/crossmatch"
            --alias "g01 = \\{root\\}/AltusAddons/g01"
            --alias "local = C:/Y/w/test"
            --ftp "test/listC.json = l = \\{start\\}/files/crossmatch/AltusAddons/g01"
            --ftp "test/listD.json = l = \\{g01\\}/current"`
        },
        {
            header: `Project owner:`,
            content: `maxz`
        },
    ]);
    console.log(usage);
}

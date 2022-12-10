import commandLineUsage from 'command-line-usage';
import { optionDefinitions } from './app-options';

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

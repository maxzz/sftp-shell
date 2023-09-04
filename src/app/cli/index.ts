import { getCLIVerifiedArguments } from './main-cli';
import { processSftp } from '..';

async function main() {
    const appOptions = getCLIVerifiedArguments();
    await processSftp(appOptions);
}

main().catch((error) => {
    console.log(error);
    process.exit(-1);
});

//TODO: handle path normalize before loop work - done
//TODO: new name sshell aka s-sh-sh-ell
//TODO: options by sshell.config.json (as usual for specific tasks) and sshell.common.json (as usual for creds) files; both have the same file format.
//TODO: we start sftp header to early
//TODO: show help w/ and wo/ examples

//TODO: add option verbose handshake print
//TODO: add connect algorithm options (https://github.com/mscdex/ssh2#client-methods)

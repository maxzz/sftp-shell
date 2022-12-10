import { getVerifiedArguments } from './app/app-arguments';
import { printHeaderAndVersion } from './app/app-messages';
import { processSftp } from './app/app';

function main() {
    printHeaderAndVersion();    
    const options = getVerifiedArguments();
    processSftp(options);
 }

main();

import { printHeaderAndVersion } from './app/app-help';
import { getVerifiedArguments } from './app/app-arguments';
import { processSftp } from './app/app';

function main() {
    printHeaderAndVersion();    
    const options = getVerifiedArguments();
    processSftp(options);
 }

main();

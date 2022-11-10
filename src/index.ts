import { printHeaderAndVersion } from './app/app-help';
import { parse } from './app/app-arguments';
import { processSftp } from './app/app';

function main() {
    printHeaderAndVersion();    
    const options = parse();
    processSftp(options);
 }

main();

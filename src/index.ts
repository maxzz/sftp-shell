import { HEADER } from './app/app-help';
import { parse } from './optionsInit';
import { processSftp } from './app/app';

function main() {
    console.log(`${HEADER}\n  version 1.2.0\n`);
    const options = parse();
    processSftp(options);
 }

main();

import { getVerifiedArguments } from './app/app-arguments';
import { processSftp } from './app/app';

function main() {
    const options = getVerifiedArguments();
    processSftp(options);
}

main();

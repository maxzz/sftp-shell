import chalk = require("chalk");
import { help, printHeader } from "./app-help";

export function terminate(msg) {
    console.log(`${chalk.redBright('\nTerminated:')}\n    ${msg}`);
    help();
    printHeader();
    process.exit(-1);
}

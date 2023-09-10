import { CLIOptions } from "../../types";
import chalk from "chalk";

export function printCommandLineArguments() {
    console.log(chalk.cyan(`\nCommand line arguments: \n${process.argv.map((str,idx)=>`    ${idx}: ${str}`).join('\n')}`));
}

export function printCLIOptions(cliOptions: CLIOptions) {
    console.log(chalk.cyan('\nargOptions = \n'), JSON.stringify(cliOptions, null, 4), '\n');
}

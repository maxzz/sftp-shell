import { Aliases } from '../../types';
import chalk from 'chalk';

export function printAliases(finalFilename: string, aliases: Aliases) {
    console.log(`\nFinal filename: ${finalFilename}`);
    console.log(`\nAliases:`);
    Object.entries(aliases).forEach(([key, val]) => {
        console.log(`    ${chalk.gray(key)}: ${chalk.gray(val)}`);
    });
}

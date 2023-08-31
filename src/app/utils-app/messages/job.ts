import chalk from "chalk";

const HEADER1 = `
o o o o o o o o o SFTP o o o o o o o o o`;

const HEADER2 = `
─┬┐┌─┐┌┐┌┌─┐
 │││ ││││├┤ 
─┴┘└─┘┘└┘└─┘
`;

export const HEADER3 = `
  ┌─┐┌─┐┬┬  ┌─┐┌┬┐  
  ├┤ ├─┤││  ├┤  ││  
  └  ┴ ┴┴┴─┘└─┘─┴┘  `;

export function printSftpStart() {
    console.log(chalk.cyan(HEADER1));
}

export function printAppDone() {
    console.log(chalk.green(HEADER2));
}

export function printAppFailed() {
    console.log(chalk.bgRed.white(`${HEADER3}`));
}

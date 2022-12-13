import chalk from 'chalk';

const wg = (txt: string) => console.log(chalk.bold.green(txt));
const wr = (txt: string) => console.log(chalk.bold.red(txt));

export function buildFailed(): void {
    wr("");
    wr("         _..--\"\\  `|`\"\"--.._");
    wr("      .-'       \\  |        `'-.");
    wr("     /           \\_|___...----'`\\");
    wr("    |__,,..--\"\"``(_)--..__      |");
    wr("    '\\     _.--'`.I._     ''--..'");
    wr("      `''\"`,#JGS/_|_\\###,.--'`");
    wr("        ,#'  _.:`___`:-._'#,              ____");
    wr("       #'  ,~'-;(oIo);-'~, '#            / __ \\");
    wr("       #   `~-(  |    )=~`  #           | |  | |  ___   _ __   ___ ");
    wr("       #       | |_  |      #           | |  | | / _ \\ | '_ \\ / __|");
    wr("       #       ; ._. ;      #           | |__| || (_) || |_) |\\__ \\");
    wr("       #  _..-;|\\ - /|;-._  #            \\____/  \\___/ | .__/ |___/");
    wr("       #-'   /_ \\\\_// _\\  '-#                          | |");
    wr("     /`#    ; /__\\-'__\\;    #`\\                        |_|");
    wr("    ;  #\\.--|  |O  O   |'-./#  ;");
    wr("    |__#/   \\ _;O__O___/   \\#__|");
    wr("     | #\\    [I_[_]__I]    /# |");
    wr("     \\_(#   ;  |O  O   ;   #)_/");
    wr("            |  |       |");
    wr("            |  ;       |");
    wr("            |  |       |");
    wr("            ;  |       |");
    wr("            |  |       |");
    wr("            |  |       ;");
    wr("            |  |       |");
    wr("            '-.;____..-'");
    wr("              |  ||  |");
    wr("              |__||__|");
    wr("              [__][__]");
    wr("            .-'-.||.-'-.");
    wr("           (___.'  '.___)");
}

export function buildOk(buildDescription: string): void {
    wg("                                                 ____    _");
    wg("                                                / __ \\  | |");
    wg("                                               | |  | | | | __");
    wg("                                               | |  | | | |/ /");
    wg("                                               | |__| | |   < ");
    wg("                                                \\____/  |_|\\_\\");
    wg("                                                          ");

    setTimeout(() => {
        console.log(`${chalk.gray(buildDescription)}`);
        console.log(`\nPress ${chalk.green('Ctrl+C')} to close this window.`);
    }, 500);
}

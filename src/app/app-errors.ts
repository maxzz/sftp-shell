import { printMessageBeforeExit } from "./app-help";

export function terminate(msg) {
    printMessageBeforeExit(msg);
    process.exit(-1);
}

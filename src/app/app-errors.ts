import { printMessageBeforeExit } from "./app-messages";

export function terminate(msg) {
    printMessageBeforeExit(msg);
    process.exit(-1);
}

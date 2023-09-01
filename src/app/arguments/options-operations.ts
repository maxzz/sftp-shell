import { Operation } from "../types";
import { terminate } from "../utils-app";

export function getOperations(ftp: string[] | string = []): Operation[] {
    if (typeof ftp === 'string') {
        ftp = [ftp];
    }

    const rv = ftp.map(
        (cur) => {
            const parts = cur.split('=').map((part) => part.trim());

            if (parts.length !== 3) {
                terminate(`Wrong files pair: ${cur}`);
            }

            const [local, operation, remote] = parts;
            const item = { local, operation, remote, } as Operation;

            if (item.operation.length !== 1 || !~'udl'.indexOf(item.operation)) {
                terminate(`Invalid operation. It should be one of: 'u' | 'd' | 'l' for:\n    ${cur}`);
            }

            return item;
        }
    );

    return rv;
}

import { OP, Operation } from "../types";
import { exist } from "../utils";
import { terminate } from "../utils-app";

function mapToOperation(operationStr: string): Operation {
    const parts = operationStr.split('=').map((part) => part.trim());

    if (parts.length !== 3) {
        terminate(`Wrong files pair: ${operationStr}`);
    }

    const [local, operation, remote] = parts;

    const notOne = operation.length !== 1 || !~'udl'.indexOf(operation);
    if (notOne) {
        terminate(`Invalid operation. It should be one of: 'u' | 'd' | 'l' for:\n    ${operationStr}`);
    }

    return {
        local,
        operation: operation as OP,
        remote,
    };
}

export function getOperations(ftp: string | string[] = []): Operation[] {
    const rv = (typeof ftp === 'string' ? [ftp] : ftp).map(mapToOperation);

    rv.forEach(({local, operation, remote}) => {
        const fileExist = exist(local);
        
        if (operation === 'u' && !fileExist) {
            terminate(`Invalid operation. Local file does not exist:\n${JSON.stringify({local, operation, remote}, null, 4)}`);
        }
    });

    return rv;
}

import { OP, Operation } from "../types";
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
    return (typeof ftp === 'string' ? [ftp] : ftp).map(mapToOperation);
}

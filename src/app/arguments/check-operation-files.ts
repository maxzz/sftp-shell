import fs from 'fs';
import path from 'path';
import { OP, Operation, Aliases } from '../types';
import { terminate } from '../utils-app';
import { formatDeep } from '../../utils';

export function checkOperationLocalFilesPresence(operations: Operation[], aliases: Aliases): void {
    operations.forEach(
        (item) => {
            item.local = path.resolve(path.normalize(formatDeep(item.local, aliases)));
            if (item.operation === OP.upload) {

                if (!fs.existsSync(item.local)) {
                    console.log(`\nFailed FTP pair: ${JSON.stringify(item)}\n`);
                    terminate(`File not exists: ${item.local}`);
                }
            }
        }
    );
}

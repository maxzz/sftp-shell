import path from 'path';
import fs from 'fs';
import JSON5 from 'json5';
import { makeDirSync } from './03-makeDirSync';

export function readSyncJson5(fname: string): any {
    try {
        const cnt = fs.readFileSync(fname).toString();
        return JSON5.parse(cnt);
    } catch (error) {
        console.error('\nFailed to read JSON:', fname, error);
        throw error;
    }
}

export function writeSyncJson5(fname: string, obj: {}): void {
    try {
        makeDirSync(path.dirname(fname));
        fs.writeFileSync(fname, JSON5.stringify(obj, null, 4));
    } catch (error) {
        console.error('\nFailed to write JSON:', fname, error);
        throw error;
    }
}

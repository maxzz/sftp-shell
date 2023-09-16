import path from 'path';
import fs from 'fs';
import { makeDirSync } from './03-makeDirSync';

export function readSyncJson(fname: string): any {
    try {
        const cnt = fs.readFileSync(fname).toString();
        return JSON.parse(cnt);
    } catch (error) {
        console.error('\nFailed to read JSON:', fname, error);
        throw error;
    }
}

export function writeSyncJson(fname: string, obj: {}): void {
    try {
        makeDirSync(path.dirname(fname));
        fs.writeFileSync(fname, JSON.stringify(obj, null, 4));
    } catch (error) {
        console.error('\nFailed to write JSON:', fname, error);
        throw error;
    }
}

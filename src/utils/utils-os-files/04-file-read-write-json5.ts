import path from 'path';
import fs from 'fs';
import JSON5 from 'json5';
import { makeDirSync } from './03-makeDirSync';

export function readJson5Sync(fname: string): any {
    try {
        const cnt = fs.readFileSync(fname).toString();
        return JSON5.parse(cnt);
    } catch (error) {
        console.error('\nFailed to read JSON:', fname, error);
        throw error;
    }
}

export function writeJson5Sync(fname: string, obj: {}): void {
    try {
        makeDirSync(path.dirname(fname));
        fs.writeFileSync(fname, JSON5.stringify(obj, null, 4));
    } catch (error) {
        console.error('\nFailed to write JSON:', fname, error);
        throw error;
    }
}

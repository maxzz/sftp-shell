import path from 'path';
import fs from 'fs';
import { mkDirSync } from './03-makeDirSync';

export function readJson(fname: string): any {
    try {
        const cnt = fs.readFileSync(fname).toString();
        return JSON.parse(cnt);
    } catch (error) {
        console.error('\nFailed to read JSON:', fname, error);
        throw error;
    }
}

export function writeJson(fname: string, obj: any): void {
    try {
        mkDirSync(path.dirname(fname));
        fs.writeFileSync(fname, JSON.stringify(obj, null, 4));
    } catch (error) {
        console.error('\nFailed to write JSON:', fname, error);
        throw error;
    }
}

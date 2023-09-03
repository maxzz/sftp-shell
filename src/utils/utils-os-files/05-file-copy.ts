import path from 'path';
import fs from 'fs';
import { mkDirSync } from './03-makeDirSync';

export function fileCopy(src: string, dest: string): void {
    // 0. will overwrite dest; will preserve modify time, but not create time; todo: file mode.
    // https://github.com/jprichardson/node-fs-extra/blob/master/lib/copy-sync/copy-sync.js#L68
    try {
        mkDirSync(path.dirname(dest));
        fs.copyFileSync(src, dest);
    } catch (error) {
        console.error('\nFailed to copy:', `${src} -> ${dest}`, error);
        throw error;
    }
}

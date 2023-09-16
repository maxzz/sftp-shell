import path from 'path';
import fs from 'fs';

//const mkdir = require('mkdir-p');
// export function mkDirSync(dirName: string): void {
//     mkdir.sync(dirName);
// }

function mkdirRecursively(dist: string): void {
    dist = path.resolve(dist);
    if (!fs.existsSync(dist)) {
        mkdirRecursively(path.dirname(dist));
        fs.mkdirSync(dist);
    }
}

export function makeDirSync(name: string): void {
    try {
        mkdirRecursively(name);
    } catch (error) {
        console.log('\nFailed to create:', name, error);
        throw error;
    }
}

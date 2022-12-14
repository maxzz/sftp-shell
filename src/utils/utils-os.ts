import path from 'path';
import fs from 'fs';
import child from 'child_process';

export function toUnix(fileName: string): string {
    const double = /\/\//;
    let res: string = fileName.replace(/\\/g, '/');
    while (res.match(double)) {
        res = res.replace(double, '/');
    }
    return res;
}

export function toWindows(fileName: string): string {
    let res: string = fileName.replace(/\//g, '/');
    res = res.replace(/\//g, '\\');
    return res;
}

//const mkdir = require('mkdir-p');
// export function mkDirSync(dirName: string): void {
//     mkdir.sync(dirName);
// }

export function exist(name: string): fs.Stats | undefined {
    try {
        return fs.statSync(name);
    } catch (error) {
    }
}

function mkdirRecursively(dist: string): void {
    dist = path.resolve(dist);
    if (!fs.existsSync(dist)) {
        mkdirRecursively(path.dirname(dist));
        fs.mkdirSync(dist);
    }
}

export function mkDirSync(name: string): void {
    try {
        mkdirRecursively(name);
    } catch (error) {
        console.log('\nFailed to create:', name, error);
        throw error;
    }
}

export function deleteFolderRecursive(path: string): void {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            const current = path + "/" + file;
            if (fs.lstatSync(current).isDirectory()) {
                deleteFolderRecursive(current);
            } else {
                fs.unlinkSync(current); // delete file
            }
        });
        fs.rmdirSync(path);
    }
}

export function unlink(name: string): void {
    // 0. Delete file / .lnk (just link, i.e. not following link) / folder (even non-empty).
    try {
        if (fs.existsSync(name)) {
            if (fs.lstatSync(name).isDirectory()) {
                deleteFolderRecursive(name);
            } else {
                fs.unlinkSync(name);
            }
        }
    } catch (error) {
        console.log('\nFailed to delete:', name, error);
        throw error;
    }
}

export function readJson(fname: string): any {
    try {
        const cnt = fs.readFileSync(fname).toString();
        return JSON.parse(cnt);
    } catch (error) {
        console.log('\nFailed to read JSON:', fname, error);
        throw error;
    }
}

export function writeJson(fname: string, obj: any): void {
    try {
        mkDirSync(path.dirname(fname));
        fs.writeFileSync(fname, JSON.stringify(obj, null, 4));;
    } catch (error) {
        console.log('\nFailed to write JSON:', fname, error);
        throw error;
    }
}

export function fileSize(fname: string): number {
    try {
        return fs.statSync(fname).size;
    } catch (error) {
        console.log('\nNo such file:', fname, error);
        throw error;
    }
}

export function fileCopy(src: string, dest: string): void {
    // 0. will overwrite dest; will preserve modify time, but not create time; todo: file mode.
    // https://github.com/jprichardson/node-fs-extra/blob/master/lib/copy-sync/copy-sync.js#L68
    try {
        mkDirSync(path.dirname(dest));
        fs.copyFileSync(src, dest);
    } catch (error) {
        console.log('\nFailed to copy:', `${src} -> ${dest}`, error);
        throw error;
    }
}

export function runScript(scriptFullFilename: string, scriptArgs?: string): boolean {
    const { tool, script, args } = { tool: 'node', script: scriptFullFilename, args: scriptArgs || '' };
    try {
        const cmd = `${tool} ${script} ${args}`.trim();
        const ret = child.execSync(cmd);
        if (ret) {
            const output = ret.toString();
            output && console.log(`${output}`);
        }
        return true;
    } catch (err) {
        if (err.stdout) {
            console.log(`Execution error:\n${err.stdout.toString()}`);
        } else {
            console.log(`Execution error:\n${err}`);
        }
    }
}

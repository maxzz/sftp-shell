import fs from 'fs';

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

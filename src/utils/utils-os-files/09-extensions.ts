import path from 'path';

export function replaceExt(fname: string, newExt: string) {
    return path.join(path.dirname(fname), path.basename(fname, path.extname(fname)) + newExt);
}

export function filterByExt(fnames: string[], ext: string): string[] {
    return fnames.filter((fname) => path.extname(fname).toLowerCase() === ext);
}

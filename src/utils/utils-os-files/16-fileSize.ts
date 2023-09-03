import fs from 'fs';

export function fileSize(fname: string): number {
    try {
        return fs.statSync(fname).size;
    } catch (error) {
        console.log('\nNo such file:', fname, error);
        throw error;
    }
}

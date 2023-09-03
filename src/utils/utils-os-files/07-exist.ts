import fs from 'fs';

export function exist(name: string): fs.Stats | undefined {
    try {
        return fs.statSync(name);
    } catch (error) {
    }
}

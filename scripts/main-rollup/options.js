// @ts-check

export const extensionSrc = '.build';

/**
 * 
 * @param {string} name 
 * @returns string
 */
export function suffix(name) {
    return `dist-ro-ts/${name}.js`;
}

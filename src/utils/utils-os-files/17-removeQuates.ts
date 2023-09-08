export function removeQuates(str: string) {
    return str.replace(/^\s*"\s*([^"]*)\s*"\s*$/, '$1');
}

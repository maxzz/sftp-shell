export function formatWith(str: string, obj: Object) {
    // 0. Replaces string patterns with named parameters: formatWith("A {key}", {key: "B"}) --> "A B"
    return str.replace(/{([\w\$_]+)}/gm, function fmt_(all, name) {
        if (typeof obj[name] !== 'undefined') { // check that obj[name] is undefined (i.e. not '' which is also falsy value).
            return obj[name];
        } else {
            return all;
        }
    });
}

export function formatDeep(str: string, obj: Object) {
    // 0. Replaces nested patterns.
    str = formatWith(str, obj);
    const more: RegExpExecArray = /{([\w\$_]+)}/.exec(str);
    if (more && typeof obj[more[1]] === 'string') {
        str = formatDeep(str, obj);
    }
    return str;
}

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

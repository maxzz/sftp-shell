export function formatWith(str: string, aliases: Record<string, string>): string {
    // 0. Replaces string patterns with named parameters: formatWith("A {key}", {key: "B"}) --> "A B"

    return str.replace(
        /{([\w\$_]+)}/gm,
        function fmt(all, name) {
            if (typeof aliases[name] !== 'undefined') { // check that obj[name] is undefined to allow '' (i.e. not '' which is also falsy value).
                return aliases[name];
            }
            return all;
        }
    );
}

function formatDeepRecursively(str: string, aliases: Record<string, string>, level: number, maxDepth: number): string {
    // 0. Replaces nested patterns.

    str = formatWith(str, aliases);

    if (level < maxDepth) {
        const more: RegExpExecArray | null = /{([\w\$_]+)}/.exec(str);

        if (more && typeof aliases[more[1]] === 'string') {
            str = formatDeepRecursively(str, aliases, level++, maxDepth);
        }
    }

    return str;
}

export function formatDeep(str: string, aliases: any, maxDepth = 10): string {
    return formatDeepRecursively(str, aliases as Record<string, string>, 0, maxDepth);
}

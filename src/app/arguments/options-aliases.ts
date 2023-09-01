import { Aliases } from "../types";
import { terminate } from "../utils-app";

export function getAliases(aliases: string[] | string = []): Aliases {
    if (typeof aliases === 'string') {
        aliases = [aliases];
    }

    const rv = aliases.reduce(
        (acc: Aliases, cur: string) => {
            const [key, val] = cur.split('=').map((value) => value.trim());
            if (!key || !val) {
                terminate(`Invalid alias: '${cur}'`);
            }
            acc[key] = val;
            return acc;
        }, {} as Aliases
    );

    return rv || {};
}

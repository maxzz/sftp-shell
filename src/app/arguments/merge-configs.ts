import { Operation, AppOptions } from '../types';

export function mergeOptions(all: AppOptions[]): AppOptions {
    const credentials = all.find((config) => !!config.credentials.username)?.credentials || {}; // We will use the first one w/ username

    const aliases = all.reduce(
        (acc, curr) => Object.assign({}, acc, curr.aliases), // The last aliases collection wins
        {}
    );

    const operations = all.reduce(
        (acc, curr) => {
            acc.push(...curr.operations);
            return acc;
        }, [] as Operation[]
    );

    return {
        credentials,
        aliases,
        operations,
    };
}

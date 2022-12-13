import {
    execSync as _execSync,
    ExecSyncOptionsWithStringEncoding,
    spawnSync as _spawnSync,
    SpawnSyncOptionsWithStringEncoding,
} from 'child_process'; // https://github.com/vercel/pkg/blob/main/test/utils.js

export function execSync(command: string, options: ExecSyncOptionsWithStringEncoding): string {
    const child = _execSync(command, options);
    return (child || '').toString();
}

export function spawnSync(command: string, args: readonly string[], opts?: SpawnSyncOptionsWithStringEncoding & { expect?: number; }): string | { stdout: string; stderr: string; } {
    if (!opts) opts = {} as SpawnSyncOptionsWithStringEncoding;

    opts = Object.assign({}, opts); // change own copy

    const d = opts.stdio;
    if (!d) {
        opts.stdio = ['pipe', 'pipe', 'inherit'];
    } else if (typeof d === 'string') {
        opts.stdio = [d, d, d];
    }

    let expect: boolean | number | null | string = opts.expect === undefined ? 0 : opts.expect;
    delete opts.expect; // to avoid passing to spawnSync

    const opts2 = Object.assign({}, opts); // 0.12.x mutates
    const child = _spawnSync(command, args, opts2);

    let s: number | string = child.status;
    if (child.signal) { s = null; } // conform old node vers to https://github.com/nodejs/node/pull/11288

    if (child.error || s !== expect) {
        if (opts.stdio[1] === 'pipe' && child.stdout) {
            process.stdout.write(child.stdout);
        } else if (opts.stdio[2] === 'pipe' && child.stderr) {
            process.stdout.write(child.stderr);
        }
        console.log('> ' + command + ' ' + args.join(' '));
    }

    if (child.error) {
        throw child.error;
    }

    if (s !== expect) {
        if (s === null) { s = 'null'; };
        if (expect === null) { expect = 'null'; };
        throw new Error('Status ' + s.toString() + ', expected ' + expect.toString());
    }

    if (opts.stdio[1] === 'pipe' && opts.stdio[2] === 'pipe') {
        return {
            stdout: child.stdout.toString(),
            stderr: child.stderr.toString(),
        };
    } else if (opts.stdio[1] === 'pipe') {
        return child.stdout.toString();
    } else if (opts.stdio[2] === 'pipe') {
        return child.stderr.toString();
    } else {
        return '';
    }
}

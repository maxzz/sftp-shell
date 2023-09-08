// @ts-check
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import { extensionSrc, suffix } from "./scripts/main-rollup/options.js";

function makePluginsList() {
    const rv = [];
    rv.push(nodeResolve());
    rv.push(commonjs());
    rv.push(typescript({ module: 'esnext' }));
    rv.push(json());
    return rv;
}

function createConfing({ input, name, output }) {
    return {
        input,
        output: {
            file: output,
            name,
            format: "esm",
            indent: true,
            extend: true,
            sourcemap: true,
        },
        external: ["ssh2-sftp-client"],
        plugins: makePluginsList(),
    };
}

function makeBuildsList() {
    //console.info('\noptions', JSON.stringify(options, null, 4)); // OK but too verbose to show every time

    const rv = [];
    rv.push(createConfing({ input: `src/app/api/index.ts`, name: 'sftpshell', output: `dist/index.js` }));
    rv.push(createConfing({ input: `src/app/cli/index.ts`, name: 'sftpshell', output: `dist/index-cli.js` }));
    return rv;
}

export default makeBuildsList();

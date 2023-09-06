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
    rv.push(typescript());
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
            globals: {
                "ssh2-sftp-client": "Client",
                //"ssh2": "ssh2",
            },
        },
        external: ["ssh2-sftp-client"],
        // external: ["ssh2-sftp-client", "ssh2"],
        plugins: makePluginsList(),
    };
}

function makeBuildsList() {
    //console.info('\noptions', JSON.stringify(options, null, 4)); // OK but too verbose to show every time

    const rv = [];
    // rv.push(createConfing({ input: `${extensionSrc}/main-deploy-history.js`, name: 'csdog', output: suffix('main-deploy-history') }));
    rv.push(createConfing({ input: `src/app/api/index.ts`, name: 'sftpshell', output: `dist-ro/index.ts` }));
    return rv;
}

export default makeBuildsList();

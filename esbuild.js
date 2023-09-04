const { nativeNodeModulesPlugin } = require("esbuild-native-node-modules-plugin");

const esbuildOptions = {
    entryPoints: ["./src/app/cli/index.ts"],
    bundle: true,
    outdir: "build-es", //outfile: "sshell.js", // can use only dir or name
    plugins: [nativeNodeModulesPlugin],
    platform: 'node',
    target: 'esnext',
    treeShaking: true,
    //minify: true,
};

require('esbuild').build(esbuildOptions).catch(() => process.exit(1));

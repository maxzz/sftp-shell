const { nativeNodeModulesPlugin } = require("esbuild-native-node-modules-plugin");

require('esbuild').build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    outdir: "build-es",
    //outfile: "sshell.js", // can use only dir or name
    plugins: [nativeNodeModulesPlugin],
    platform: 'node',
    target: 'esnext',
    treeShaking: true,
    //minify: true,
}).catch(() => process.exit(1));

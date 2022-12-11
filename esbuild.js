const { nativeNodeModulesPlugin } = require("esbuild-native-node-modules-plugin");

require('esbuild').build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    outdir: "build-es",
    plugins: [nativeNodeModulesPlugin],
    platform: 'node',
    target: 'esnext',
    treeShaking: true
}).catch(() => process.exit(1));

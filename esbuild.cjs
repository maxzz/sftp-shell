const esbuild = require("esbuild");
const { nativeNodeModulesPlugin } = require("esbuild-native-node-modules-plugin");
//const { dtsPlugin } = require("esbuild-plugin-d.ts");

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

esbuild.build(esbuildOptions).catch(() => process.exit(1));

// const esbuildLib = {
//     entryPoints: ["./src/app/api/index.ts"],
//     bundle: true,
//     outdir: "dist",
//     plugins: [nativeNodeModulesPlugin, dtsPlugin()],
//     external: ['ssh2-sftp-client'],
//     platform: 'node',
//     format: 'esm',
//     target: 'esnext',
//     treeShaking: true,
//     //minify: true,
// };

// esbuild.build(esbuildLib).catch(() => process.exit(1)); // TODO: this is really slow, and doesn't build the single d.ts file

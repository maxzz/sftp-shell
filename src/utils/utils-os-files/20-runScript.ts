import child from 'child_process';

export function runScript(scriptFullFilename: string, scriptArgs?: string): boolean | undefined {
    const { tool, script, args } = { tool: 'node', script: scriptFullFilename, args: scriptArgs || '' };
    try {
        const cmd = `${tool} ${script} ${args}`.trim();
        const ret = child.execSync(cmd);
        if (ret) {
            const output = ret.toString();
            output && console.log(`${output}`);
        }
        return true;
    } catch (error) {
        if ((error as any).stdout) {
            console.log(`Execution error:\n${(error as any).stdout.toString()}`);
        } else {
            console.log(`Execution error:\n${error}`);
        }
    }
}

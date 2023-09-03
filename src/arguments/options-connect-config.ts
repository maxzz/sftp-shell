import fs from 'fs';
import { ArgCredentials, SSHConnectConfig } from "../types";
import { printConnectionVerbose, terminate } from "../utils-app";
import { formatDeep } from '../utils';

export function getConnectConfig(c: ArgCredentials): SSHConnectConfig {
    if (c.keyfile) {
        try {
            c.keyfile = formatDeep(c.keyfile, process.env);
            c.keyfile = fs.readFileSync(c.keyfile, { encoding: 'utf8' });
        } catch (error) {
            terminate(`Cannot read SFTP access key file: '${c.keyfile}'`);
        }
    }

    const rv: SSHConnectConfig = {
        username: c.username,
        host: c.host,
        ...(c.port && { port: +c.port }),
        ...(c.password && { password: c.password }),
        ...(c.keyfile && { privateKey: c.keyfile }),
        ...(c.verbose && { debug: printConnectionVerbose }),
    };

    return rv;
}

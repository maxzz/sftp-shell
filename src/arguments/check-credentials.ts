import { SSHConnectConfig } from '../types';
import { terminate } from '../utils-app';

export function checkCreads(options: SSHConnectConfig) {
    if (!options.username) {
        terminate('There is no username to login.');
    }

    const totalCreds: number = +!!options.privateKey + +!!options.password;
    if (totalCreds > 1) {
        terminate(`Specify only one of: <password>, <keyfile>.`);
    }

    const basicOK = options.host && options.username && (options.password || options.privateKey);
    if (!basicOK) {
        terminate('Missing: host || username || password || keyfile');
    }
}

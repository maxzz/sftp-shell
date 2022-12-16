export const optionDefinitions = [
    {
        name: 'host',
        type: String,
        description: 'Host name like "www.crossmatch.com"',
    },
    {
        name: 'port',
        type: String,
        description: 'SFTP port.',
    },
    {
        name: 'username',
        type: String,
        description: 'User name for this session.',
        alias: 'u',
    },
    {
        name: 'password',
        type: String,
        description: 'User password.',
        alias: 'p',
    },
    {
        name: 'keyfile',
        type: String,
        description: 'Path to key file. This will be expanded with environment variables.',
    }, // { name: 'key', type: String, description: 'User key', }, // not used anymore
    {
        name: 'ftp',
        type: String,
        multiple: true,
        description: `Each line must be in format: {gray <local> = <operation> = <remote>}
            where the operation is one of:
                {gray     u - upload file to ftp,}
                {gray     d - download file from ftp,}
                {gray     l - download ftp folder contents list.}
            For example:
                {gray     "<localPathAndFileName> = u = <remotePathAndFileName>"}
                {gray     "<localPathAndFileName> = d = <remotePathAndFileName>"}
                {gray     "<localPathAndFileName> = l = <remotePath>"}
            * Existing local files will be overwritten silently.`,
        alias: 'f',
    },
    {
        name: 'alias',
        type: String,
        multiple: true,
        description: `Aliases to expand any path after start remote folder aquired from SFTP.
            For example:
                {gray     --alias "root = \\{start\\}/files/crossmatch"}
                {gray     --alias "g01 = \\{root\\}/AltusAddons/g01"}
            The {underline start} alias is automatically added as the initial working directory of the SFTP server.`,
        alias: 'a',
    },
    {
        name: 'config',
        type: String,
        multiple: true,
        description: `Optional additional config filename can have any CLI options except 'config (to avoid xlinks).'`,
        alias: 'c',
    },
    {
        name: 'help',
        type: Boolean,
        description: 'Show extended help.',
        alias: 'h',
    }
];

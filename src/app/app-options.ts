export const optionDefinitions = [
    {
        name: 'host',
        type: String,
        description: 'Host name like "www.crossmatch.com"'
    },
    {
        name: 'port',
        type: String,
        description: 'SFTP port.'
    },
    {
        name: 'username',
        alias: 'u',
        type: String,
        description: 'User name for this session.'
    },
    {
        name: 'password',
        alias: 'p',
        type: String,
        description: 'User password.'
    },
    {
        name: 'keyfile',
        type: String,
        description: 'Path to key file. This will be expanded with environment variables.'
    },
    {
        name: 'key',
        type: String,
        description: 'User key'
    },
    {
        name: 'ftp',
        alias: 'f',
        type: String,
        multiple: true,
        description: `Each line must be in format: <local> = <operation> = <remote>
            where the operation is one of:
                "u" - upload file to ftp,
                "d" - download file from ftp,
                "l" - download ftp folder contents list.
            * For example:
            <localPathAndFileName> = u = <remotePathAndFileName>
            <localPathAndFileName> = d = <remotePathAndFileName>
            <localPathAndFileName> = l = <remotePath>
            * It is possible for remote path to use macro \\{start\\}
                which is start working folder on server.
            * Existing local files will be overwritten silently.`
    },
    {
        name: 'alias',
        alias: 'a',
        type: String,
        multiple: true,
        description: `Aliases to expand any path after start remote folder aquired from SFTP.
            For example:
                "--alias", "root = \\{start\\}/files/crossmatch"
                "--alias", "g01 = \\{root\\}/AltusAddons/g01"
            The {underline start} alias is automatically added as the initial working directory of the SFTP server.`
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Show this help screen.'
    }
];

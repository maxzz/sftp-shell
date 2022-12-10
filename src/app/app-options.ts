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
        description: `Every line must have: <local> = <oparation> = <remote>
            where opration is one of:
                "u" - upload to ftp,
                "d" - download from ftp,
                "l" - list ftp folder content.
                For example:
                    <localPathAndFileName> = u = <remotePathAndFileName>
                    <localPathAndFileName> = d = <remotePathAndFileName>
                    <localPathAndFileName> = l = <remotePath>
                * Existing local files will be overwritten silently.
                * It is possible for remote path to use macro \\{start\\}
                  which is start working folder.`
    },
    {
        name: 'alias',
        alias: 'a',
        type: String,
        multiple: true,
        description: 'Aliases to expand on remote path after start remote folder aquired from SFTP.'
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Show this help screen.'
    }
];

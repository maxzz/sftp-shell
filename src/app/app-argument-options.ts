import commandLineUsage from "command-line-usage";

const optionDefinitionsConst = [
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
        name: 'verbose',
        type: Boolean,
        description: `Verbose output of connection information`,
        alias: 'v',
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
] as const;

export const optionDefinitions = optionDefinitionsConst as OptionDefinitions;

export type OptionDefinitions = Writeable<typeof optionDefinitionsConst>;
export type OptionDefinitionsKeys = (typeof optionDefinitions)[number]['name']

// helpers

export type Writeable<T> = { -readonly [K in keyof T]: T[K] }; // https://stackoverflow.com/questions/42999983/typescript-removing-readonly-modifier

export type DeepWriteable<T> = { -readonly [K in keyof T]: DeepWriteable<T[K]> };

/*
//https://github.com/ts-essentials/ts-essentials

export type IsAny<Type> = 0 extends 1 & Type ? true : false;
export type IsUnknown<Type> = IsAny<Type> extends true ? false : unknown extends Type ? true : false;
export type Primitive = string | number | boolean | bigint | symbol | undefined | null;
export type Builtin = Primitive | Function | Date | Error | RegExp;

export type DeepWritable<Type> = Type extends Exclude<Builtin, Error>
  ? Type
  : Type extends Map<infer Key, infer Value>
  ? Map<DeepWritable<Key>, DeepWritable<Value>>
  : Type extends ReadonlyMap<infer Key, infer Value>
  ? Map<DeepWritable<Key>, DeepWritable<Value>>
  : Type extends WeakMap<infer Key, infer Value>
  ? WeakMap<DeepWritable<Key>, DeepWritable<Value>>
  : Type extends Set<infer Values>
  ? Set<DeepWritable<Values>>
  : Type extends ReadonlySet<infer Values>
  ? Set<DeepWritable<Values>>
  : Type extends WeakSet<infer Values>
  ? WeakSet<DeepWritable<Values>>
  : Type extends Promise<infer Value>
  ? Promise<DeepWritable<Value>>
  : Type extends {}
  ? { -readonly [Key in keyof Type]: DeepWritable<Type[Key]> }
  : IsUnknown<Type> extends true
  ? unknown
  : Type;

export type OptionDefinitions3 = DeepWritable<typeof optionDefinitionsConst>;
*/

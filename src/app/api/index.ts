import { processSftp } from "..";
import { ValidateOptions, validate } from "../../arguments";
import { AppOptions } from "../../types";

export function execute(validateOptions: ValidateOptions) {
    const appOptions: AppOptions = validate(validateOptions);
    processSftp(appOptions);
}

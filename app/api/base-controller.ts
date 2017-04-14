import * as bunyan  from "bunyan";
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";
import { ApiController } from "./api-controller";

export class BaseController implements ApiController{
    authenticator: PassportLocalAuthenticator;
    logger: bunyan;
    constructor(auther: PassportLocalAuthenticator, logger: any){
        this.authenticator = auther;
        this.logger = logger;
    }

    public getLogger() {
        return this.logger;
    }
}

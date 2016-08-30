/// <amd-dependency path="./api-controller"/>
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";
import { ApiController } from "./api-controller";

export class BaseController implements ApiController{
    authenticator: PassportLocalAuthenticator;

    constructor(auther: PassportLocalAuthenticator){
        this.authenticator = auther;
    }
}

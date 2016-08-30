import * as Express from "express-serve-static-core";
import { Configuration } from "../services/settings/config-model";
import { BaseController } from "./base-controller";
import { VerificationEmailer } from "../services/mailing/verification-email";
import { AzureDownloader} from "../services/azure-storage/downloader";
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";
import { db } from "../data/db";

export class ProfileController extends BaseController {
    config: Configuration;
    mailer: VerificationEmailer;
    repository: db;

    constructor(configuration: Configuration, auther: PassportLocalAuthenticator) {
        super(auther);
        this.config = configuration;
        this.repository = new db(this.config);

        this["Profile:path"] = "/profile/:userId:";
    }

    public getProfile = (req: Express.Request, res: Express.Response, next, params) => {
        this.repository = new db(this.config);
        let id: string = "";
        this.repository.Profile.getProfileByUserId(req.user._id, (error, profile) => {
            if(error){
                res.sendStatus(500);
            }
            else{
                res.send(profile);
            }
        });
    }
}

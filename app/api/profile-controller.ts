import * as Express from "express";
import * as ExpressExtensions from "../interops/express-extensions";
import { Configuration } from "../services/settings/config-model";
import { BaseController } from "./base-controller";
import { VerificationEmailer } from "../services/mailing/verification-email";
import { AzureDownloader } from "../services/azure-storage/downloader";
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";
import { db } from "../data/db";

export class ProfileController extends BaseController {
    config: Configuration;
    mailer: VerificationEmailer;
    repository: db;

    constructor(configuration: Configuration, auther: PassportLocalAuthenticator, logger: any) {
        super(auther, logger);
        this.config = configuration;
        this.repository = new db(this.config);

        this["Profile:path"] = "/profile/:userId:";
    }

    public getProfile = (req: Express.Request, res: Express.Response, next, params) => {
        let id: string = "";
        this.repository.Profile.getProfileByUserId(req.user._id, (error, profile) => {
            if (error) {
                this.logger.error(error, "Profile for userId not found:" + req.user._id);
                res.sendStatus(500);
            }
            else {
                res.send(profile);
            }
        });
    }

    public putProfile = (req: Express.Request & ExpressExtensions.Request, res: Express.Response, next, params) => {
        this.logger.info({ req: req }, "putProfile");
        this.repository.Profile.update(req.body, (error, profile) => {
            if (error) {
                res.sendStatus(500);
            }
            else {
                res.send(profile);
            }
        });
    }
}

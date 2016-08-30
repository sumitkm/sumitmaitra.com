import * as Express from "express-serve-static-core";
import { BaseController } from "./base-controller";
import { Configuration } from "../services/settings/config-model";
import { VerificationEmailer } from "../services/mailing/verification-email";
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";
import { db } from "../data/db";
import { AzureDownloader } from "../services/azure-storage/downloader";


var Account = require("../data/account");

export class ContentController extends BaseController {
    config: Configuration;
    repository: db;

    constructor(configuration: Configuration, auther: PassportLocalAuthenticator) {
        super(auther);
        this.config = configuration;
        this.repository = new db(this.config);

        this["Content:path"] = "/content/{ownerId}/{contentId}";
    }

    public getContent = (req, res, next, params) => {
        //console.log("going to get content:" + JSON.stringify(params));
        let downloader = new AzureDownloader(this.config);
        downloader.getImageFromBlob(params.contentId, params.ownerId, (error, result) => {
            try {
                res.send(result);

            } catch (err) {

            }
        });
        //res.send("Came here");
    }
}

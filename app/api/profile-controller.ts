/// <amd-dependency path="./api-controller"/>
import * as Express from "express-serve-static-core";
import { Configuration } from "../services/settings/config-model";
import { VerificationEmailer } from "../services/mailing/verification-email";
import { AzureDownloader} from "../services/azure-storage/downloader";
import { db } from "../data/db";

export class ProfileController {
    config: Configuration;
    mailer: VerificationEmailer;
    repository: db;

    constructor(configuration: Configuration) {
        this.config = configuration;
        this.repository = new db(this.config);

        this["Profile:path"] = "/profile/:userId:";
    }


    public getProfile = (req: Express.Request, res: Express.Response, next, params) => {
        console.log("going to get profile:" + JSON.stringify(params));
        this.repository = new db(this.config);
        let id: string = "";
        this.repository.Profile.getProfileByUserId(req.user._id, (error, profile) => {
            if(error){
                res.sendStatus(500);
            }
            else{
                console.log(profile);
                res.send(profile);
            }
        });
    }
}

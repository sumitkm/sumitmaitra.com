/// <amd-dependency path="./api-controller"/>
import { Configuration } from "../services/settings/config-model";
import { VerificationEmailer } from "../services/mailing/verification-email";
import { db } from "../data/db";
import { AzureDownloader } from "../services/azure-storage/downloader";

var Account = require("../data/account");

export class ContentController implements ApiController {
    config: Configuration;
    repository: db;

    constructor(configuration: Configuration) {
        this.config = configuration;
        this.repository = new db(this.config);

        this["Content:path"] = "/content/{ownerId}/{contentId}";
    }

    public getContent = (req, res, next, params) => {
        console.log("going to get content:" + JSON.stringify(params));
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

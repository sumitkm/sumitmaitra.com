/// <amd-dependency path="./api-controller"/>
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


        this["Profile:path"] = "/profile/get/:username:";
    }


    public getProfile = (req, res, next, params) => {
        console.log("going to get profile");
        this.repository = new db(this.config);
        let id: string = "";
        this.repository.Profile.getProfileByUserId(req.user._id, (error, profile) => {
            if (profile.userId != null && profile.logoId != null) {
                let downloader = new AzureDownloader(this.config);
                downloader.getImageFromBlob(profile.logoId,profile.userId, (error, image)=>{
                    console.log("Got image from Blob");
                    res.send(image);
                });

            }
        });
    }
}

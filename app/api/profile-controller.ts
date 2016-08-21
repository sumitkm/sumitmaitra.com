/// <amd-dependency path="./api-controller"/>
import { Configuration } from "../services/settings/config-model";
import { VerificationEmailer } from "../services/mailing/verification-email";
import { db } from "../data/db";

export class ProfileController{
    config: Configuration;
    mailer: VerificationEmailer;
    repository: db;

    constructor(configuration: Configuration) {
        this.config = configuration;
        this.repository = new db(this.config);


        this["Profile:path"] = "/profile/get/:username:";
    }


    public getProfileByName = (name: string) => {
        this.repository.Profile.get
    }
}

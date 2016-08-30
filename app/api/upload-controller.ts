import * as Express from "express-serve-static-core";
import { Configuration } from "../services/settings/config-model";
import { BaseController } from "./base-controller";
import { VerificationEmailer } from "../services/mailing/verification-email";
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";
import { db } from "../data/db";
import { AzureUploader } from "../services/azure-storage/uploader";

var Account = require("../data/account");

export class UploadController extends BaseController {
    config: Configuration;
    mailer: VerificationEmailer;
    repository: db;
    uploader: AzureUploader;

    constructor(configuration: Configuration, auther: PassportLocalAuthenticator) {
        super(auther);
        this.config = configuration;
        this.repository = new db(this.config);
        this.uploader = new AzureUploader(this.config);

        this["Upload:path"] = "/uploader/files";
    }

    postUpload = (req, res, net, params) => {
        try {
            req.files.forEach((file) => {
                //console.log("Saving" + file + " for user: " + JSON.stringify(req.user));
                let newContent = new this.repository.Content({
                    ownerId: req.user._id,
                    name: file.name,
                    url: file.url,
                    filetype: file.filetype,
                    assetetag: "",
                    lastupdated: new Date(),
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size
                });
                this.repository.Content.create(newContent, (error) => {
                    //console.log(error);
                    //console.log(newContent._id);
                });
                this.uploader.saveFileToBlob(newContent._id, newContent.ownerId, file.path, (error, result) => {
                    //console.log(result.etag.toString());

                    this.repository.Content.findById(newContent._id, (err, content) => {
                        if (err) {
                            //console.log("FAILED TO FIND: " + content._id);
                        }
                        content.assetetag = result.etag.toString();
                        content.save((err) => {
                            if (err) {
                            }
                            res.send(content);
                        });
                    });

                    this.repository.Profile.getProfileByUserId(req.user._id, (error, result) => {
                        if (error) {
                            //console.log("Profile is ERRORED");
                        }
                        else {
                            if (result == null) {
                                //console.log("Profile is NULL");
                                this.repository.Profile.create(new this.repository.Profile({
                                    userId: req.user._id,
                                    nickname: "",
                                    birthdate: null,
                                    fullname: "",
                                    logoUrl: "",
                                    logoId: newContent._id
                                }));
                            }
                            else {
                                //console.log("Profile to be updated");
                                this.repository.Profile.findById(result._id, (err, profile) => {
                                    if (err) {
                                        //console.log("FAILED TO FIND: " + profile._id);
                                    }
                                    profile.logoId = newContent._id;
                                    profile.save((err) => {
                                        if (err) {
                                        }
                                        //console.log("updated!");
                                    });
                                });
                            }
                        }
                    });
                });
            });
        }
        catch (error) {
            console.error("ERROR:" + error);
        }
    }
}

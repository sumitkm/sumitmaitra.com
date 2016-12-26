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

    constructor(configuration: Configuration, auther: PassportLocalAuthenticator, logger: any) {
        super(auther, logger);
        this.config = configuration;
        this.repository = new db(this.config);
        console.log("Constructor of Upload Controller: " + (logger == null));
        this.uploader = new AzureUploader(this.config, logger);

        this["Upload:path"] = "/uploader/files";
    }

    postUpload = (req, res, net, params) => {
        try {
            req.files.forEach((file) => {
                req.logger.info({ file: file }, "Uploading file");
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
                    req.logger.info({ content: newContent }, "Uploading file");
                });
                this.uploader.saveFileToBlob(newContent._id, newContent.ownerId, file.path, (error, result) => {
                    if (error != null) {
                        req.logger.error({ error: error }, "Saving file to BLOB");
                    }
                    this.repository.Content.findById(newContent._id, (err, content) => {
                        if (err) {
                            req.logger.error({ error: err }, "Content findById error");
                        }
                        content.assetetag = result.etag.toString();
                        content.save((err) => {
                            if (err) {
                                req.logger.error({ error: err }, "Content Save");
                            }
                            res.send(content);
                        });
                    });

                    this.repository.Profile.getProfileByUserId(req.user._id, (error, result) => {
                        if (error) {
                            req.logger.error({ error: error }, "Get Profile by UserId");
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
                                        req.logger.error({ error: err }, "Get Profile by Id");
                                    }
                                    profile.logoId = newContent._id;
                                    profile.save((err) => {
                                        if (err) {
                                            req.logger.error({ error: err }, "Save Profile by Id");

                                        }
                                    });
                                });
                            }
                        }
                    });
                });
            });
        }
        catch (error) {
            req.logger({ error: error }, "upload-controller: Unhandled error in upload-controller");
        }
    }
}

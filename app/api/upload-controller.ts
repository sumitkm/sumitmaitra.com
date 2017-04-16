import * as Express from "express";
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
        this.uploader = new AzureUploader(this.config, logger);

        this["Upload:path"] = "/uploader/files";
    }

    postUpload = (req, res, net, params) => {
        this.logger.info("Uploading file");

        try {
            req.files.forEach((file) => {
                this.logger.info({ file: file }, "Uploading file");
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
                    this.logger.info({ content: newContent }, "Uploading file");
                });
                this.uploader.saveFileToBlob(newContent._id, newContent.ownerId, file.path, (error, result) => {
                    if (error != null) {
                        this.logger.error(error, "Error: Saving file to BLOB");
                    }
                    this.repository.Content.findById(newContent._id, (err, content) => {
                        if (err) {
                            this.logger.error(err, "Content findById error");
                        }
                        content.assetetag = result.etag.toString();
                        content.save((err) => {
                            if (err) {
                                this.logger.error(err, "Content Save");
                            }
                            res.status(200).send(content);
                        });
                    });

                    this.repository.Profile.getProfileByUserId(req.user._id, (error, result) => {
                        if (error) {
                            this.logger.error({ error: error }, "Get Profile by UserId");
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
                                        this.logger.error({ error: err }, "Get Profile by Id");
                                    }
                                    profile.logoId = newContent._id;
                                    profile.save((err) => {
                                        if (err) {
                                            this.logger.error({ error: err }, "Save Profile by Id");

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
            this.logger.error(error, "upload-controller: Unhandled error in upload-controller");
        }
    }
}

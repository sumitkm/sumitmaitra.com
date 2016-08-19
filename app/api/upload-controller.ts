/// <amd-dependency path="./api-controller"/>
import { Configuration } from "../services/settings/config-model";
import { VerificationEmailer } from "../services/mailing/verification-email";
import { db } from "../data/db";
import { AzureUploader } from "../services/azure-storage/uploader";

var Account = require("../data/account");

export class UploadController implements ApiController {
    config: Configuration;
    mailer: VerificationEmailer;
    repository: db;
    uploader: AzureUploader;

    constructor(configuration: Configuration) {
        this.config = configuration;
        this.repository = new db(this.config);
        this.uploader = new AzureUploader(this.config);

        this["Upload:path"] = "/uploader/files";
    }

    postUpload = (req, res, net, params) => {
        console.log("going to post Uploader/files")
        try {
            console.log(req.files);
            req.files.forEach((file) => {
                console.log("Saving" + file);
                let newContent = new this.repository.Content({
                    ownerId: req.user.username,
                    name: file.name,
                    url: file.url,
                    filetype: file.filetype,
                    assetetag: "put azure id here",
                    lastupdated: new Date(),
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size
                });
                this.repository.Content.create(newContent, (error) => {
                    console.log(error);
                    console.log(newContent._id);
                });
                this.uploader.saveFileToBlob(newContent._id, newContent.ownerId, file.path, (error, result) => {
                    console.log(result.etag.toString());

                    this.repository.Content.findById(newContent._id, (err, content) => {
                        if (err) {
                            console.log("FAILED TO FIND: " + content._id);
                        }

                        content.assetetag = result.etag.toString();
                        content.save(function(err) {
                            if (err) {
                            }
                            res.send(content);
                        });
                    });
                });
            });

        }
        catch (error) {
            console.error("ERROR:" + error);
        }
    }
}

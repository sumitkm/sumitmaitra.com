import { Configuration } from "../settings/config-model";
import * as bunyan from "bunyan";
import * as Jimp from 'jimp';
let azure = require("azure-storage");
let fs = require('fs');
let path = require("path");

export class AzureDownloader {
    private configuration: Configuration;
    private logger: bunyan;
    private blobSvc;
    private cacheFolder = "";
    private cacheFile = "";
    private ownerId = "";
    private contentId = "";
    private callback: any;

    constructor(configuration: Configuration, logger: bunyan) {
        this.configuration = configuration;
        this.logger = logger;
        this.blobSvc = azure.createBlobService(this.configuration.azureStorageConnectionString);
    }

    public getImageFromBlob = (contentId: string, ownerId: string, callback) => {
        try {
            this.callback = callback;
            this.ownerId = ownerId;
            this.contentId = contentId;
            this.cacheFolder = path.resolve('.') + '/cache/' + ownerId;
            this.cacheFile = path.resolve('.') + '/cache/' + ownerId + '/' + contentId;
            fs.stat(this.cacheFile, (err, stats) => {
                if (stats == null) {
                    fs.mkdir(this.cacheFolder, this.writeToCache);
                }
                else {
                    Jimp.read(this.cacheFile)
                        .then(image => {
                            this.logger.info("Returning scaled image");
                            image.scale(0.5);
                            image.getBuffer('image/jpg', callback);
                        })
                        .catch(err => {
                            if (err) {
                                this.logger.error(err, "getImageFromBlob: Retrieving from cache errored out.");
                            }
                        });
                }
            });
        }
        catch (err) {
            //console.log("Something blew up" + err);
            this.logger.error(err, "Unhandled error in downloader");

        }
    }

    private writeToCache = (error, result) => {
        try {
            let stream = fs.createWriteStream(this.cacheFile);
            this.blobSvc.getBlobToStream(this.configuration.containerName, this.ownerId + "/" + this.contentId, stream,
                (error, result, response) => {
                    if (!error) {
                        fs.readFile(this.cacheFile, (err, buffer) => {
                            // check err
                            Jimp.read(buffer)
                                .then(image => {

                                    //console.log("Returning scaled image");
                                    //console.log(image);
                                    this.logger.debug(image, "Scaled Image");
                                    if (this.callback != null) {
                                        image.scale(0.5, this.callback);
                                    }

                                })
                                .catch(err => {
                                    if (err) {
                                        this.logger.error({ error: err }, "writeToCache: Retrieving from cache errored out.");
                                    }
                                });
                        });
                    } else {
                        this.logger.error({ error: error }, "getBlobToStream errored out");

                    }
                });
        } catch (err) {
            this.logger.error(err, "Caching errored out.");
        }
    }
}

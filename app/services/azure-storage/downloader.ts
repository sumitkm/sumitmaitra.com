import { Configuration } from "../settings/config-model";
let azure = require("azure-storage");
let lwip = require('lwip');

export class AzureDownloader {
    private configuration: Configuration;
    private logger: any;

    constructor(configuration: Configuration, logger: any) {
        this.configuration = configuration;
        this.logger = logger;
    }

    public getImageFromBlob = (contentId: string, ownerId: string, callback) => {
        //console.log("Before Service Created" + contentId + "by: " + ownerId);
        try {

            let blobSvc = azure.createBlobService(this.configuration.azureStorageConnectionString);
            let fs = require('fs');
            let path = require("path");
            let cacheFolder = path.resolve('.') + '/cache/' + ownerId;

            let cacheFile = path.resolve('.') + '/cache/' + ownerId + '/' + contentId;
            fs.stat(cacheFile, (err, stats) => {
                //console.log("cacheStat:" + JSON.stringify(stats));
                if (stats == null) {
                    fs.mkdir(cacheFolder, (error, result) => {
                        try {
                            let stream = fs.createWriteStream(cacheFile);
                            blobSvc.getBlobToStream(this.configuration.containerName, ownerId + "/" + contentId, stream,
                                (error, result, response) => {
                                    if (!error) {
                                        // blob retrieved
                                        let fs = require('fs'),
                                            lwip = require('lwip');

                                        fs.readFile(cacheFile, (err, buffer) => {
                                            // check err
                                            lwip.open(buffer, 'jpg', (err, image) => {
                                                // check 'err'. use 'image'.
                                                if (err) {
                                                    //console.log(err);

                                                }
                                                else {
                                                    //console.log("Returning scaled image");
                                                    //console.log(image);
                                                    this.logger.log(image, "Scaled Image");
                                                    image.scale(0.5, callback);
                                                }
                                            });
                                        });
                                    } else {

                                    }
                                });
                        } catch (err) {
                            this.logger.error({ error: err }, "Caching errored out.");

                            //console.log(err);
                        }
                    });
                }
                else {
                    //console.log("trying to load from cache: " + cacheFile);
                    //fs.readFile(cacheFile, (err, buffer) => {
                        // check err
                        lwip.open(cacheFile, 'jpg', (err, image) => {
                            // check 'err'. use 'image'.
                            if (err) {
                                //console.log(err);
                                this.logger.error({ error: err }, "Retrieving from cache errored out.");
                            }
                            else {
                                //console.log("Returning scaled image");
                                this.logger.info("Returning scaled image");
                                image.scale(0.5, (err, result)=>{
                                    image.toBuffer('jpg', callback);
                                });
                            }
                        });
                    //});
                }
            });
        }
        catch (err) {
            //console.log("Something blew up" + err);
            this.logger.error({ error: err }, "Unhandled error in downloader");

        }
    }
}

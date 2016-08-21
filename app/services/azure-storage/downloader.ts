import { Configuration } from "../settings/config-model";
let azure = require("azure-storage");
let lwip = require('lwip');

export class AzureDownloader {
    private configuration: Configuration;
    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    public getImageFromBlob(contentId: string, ownerId: string, callback) {
        console.log("Before Service Created" + contentId + "by: " + ownerId);
        try {
            let blobSvc = azure.createBlobService(this.configuration.azureStorageConnectionString);
            let fs = require('fs');
            blobSvc.getBlobToStream(this.configuration.containerName, ownerId + "/" + contentId, fs.createWriteStream(),
                (error, result, response) => {
                    if (!error) {
                        // blob retrieved
                    }
                });
        }
        catch (err) {
            console.log("Something blew up" + err);
        }
    }
}

import { Configuration } from "../settings/config-model";
let azure = require("azure-storage");

export class AzureUploader {
    private configuration : Configuration;
    constructor(configuration: Configuration) {

    }

    public saveToBlob(id: string, owner: string, content: any) {
        console.log("Before Service Created" + id + "content: " + content);
        try {
            var blobSvc = azure.createBlobService(this.configuration.azureStorageConnectionString);
            blobSvc.createContainerIfNotExists(this.configuration.containerName, null, (error, result, response) => {
                if (!error) {
                    // if result = true, container was created.
                    // if result = false, container already existed.
                    console.log("Container Result: " + result);
                    blobSvc.createBlockBlobFromText(this.configuration.containerName, owner + '/' + id + '.html', content.post, null, (error, result, response) => {
                        if (!error) {
                            // file uploaded
                            console.log("File Result: " + JSON.stringify(result));
                        }
                        else {
                            console.log("Failed to create blob " + JSON.stringify(error));
                        }
                    });
                }
                else {
                    console.error("Failed to create container: " + error);
                }
            });
        }
        catch (err) {
            console.log("Something blew up" + err);
        }
    }
}

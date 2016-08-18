import { Configuration } from "../settings/config-model";
let azure = require("azure-storage");

export class AzureUploader {
    private configuration : Configuration;
    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    public saveFileToBlob(id: string, owner: string, localFileName: string, callback)  {
        console.log("Before Service Created" + id + "content: " + localFileName);
        try {
            var blobSvc = azure.createBlobService(this.configuration.azureStorageConnectionString);
            blobSvc.createContainerIfNotExists(this.configuration.containerName, null, (error, result, response) => {
                if (!error) {
                    // if result = true, container was created.
                    // if result = false, container already existed.
                    console.log("Container Result: " + result);
                    blobSvc.createBlockBlobFromLocalFile(this.configuration.containerName, owner + '/'+ id, localFileName, (error, result, response) => {
                        if (!error) {
                            console.log("File Result: " + JSON.stringify(result));
                            callback(null, result);
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

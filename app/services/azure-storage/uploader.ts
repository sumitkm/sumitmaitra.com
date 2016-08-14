import { Configuration } from "../settings/config-model";

public class AzureUploader {
    constructor(configuration: Configuration) {

    }

    public saveToBlob(id: string, owner: string, content: any) {
        console.log("Before Service Created" + id + "content: " + content);
        try {
            var blobSvc = azure.createBlobService(configuration.azureStorageConnectionString);
            blobSvc.createContainerIfNotExists(configuration.containerName, null, (error, result, response) => {
                if (!error) {
                    // if result = true, container was created.
                    // if result = false, container already existed.
                    console.log("Container Result: " + result);
                    blobSvc.createBlockBlobFromText(configuration.containerName, owner + '/' + id + '.html', content.post, null, (error, result, response) => {
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

import { Configuration } from "./app/services/settings/config-model";
export class SpaEngine {
    private configuration: Configuration;

    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    public renderer = (filename: string, options, callback) => {
        console.log("In renderer!!!! looking for " + filename + " at " + __dirname + "/app/www/index.html");
        let fs = require('fs');
        fs.readFile(__dirname + "/app/www/index.html", 'UTF8', (err, data) => {
            //console.log("Calling back");
            //console.log(err);
            callback(null, data);
        });
    }
}

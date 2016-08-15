/// <amd-dependency path="./api-controller"/>
import { Configuration } from "../services/settings/config-model";
import { VerificationEmailer } from "../services/mailing/verification-email";

var Account = require("../data/account");
var express = require('express');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;


export class UploadController implements ApiController {
    config: Configuration;
    mailer: VerificationEmailer;

    constructor(configuration: Configuration) {
        this.config = configuration;
        this["Upload:path"] = "/uploader/files";

    }

    postUpload = (req, res, net, params )=>{
        console.log("going to post Uploader/files")
        try{
            console.log(req.body);
            console.log(req.file);
            console.log(req.files);
        }
        catch(error){
            console.error("ERROR:" + error);
        }
        res.send({ done: "10%" });
    }
}

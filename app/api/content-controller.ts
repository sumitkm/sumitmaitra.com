/// <amd-dependency path="./api-controller"/>
import { Configuration } from "../services/settings/config-model";
import { VerificationEmailer } from "../services/mailing/verification-email";
import { db } from "../data/db";
import { AzureUploader } from "../services/azure-storage/uploader";

var Account = require("../data/account");

export class ContentController implements ApiController {

}

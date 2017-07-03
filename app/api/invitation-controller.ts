import * as Express from "express";
import * as ExpressExtensions from "../interops/express-extensions";
import { Configuration } from "../services/settings/config-model";
import { BaseController } from "./base-controller";
import { InvitesEmailer } from "../services/mailing/invites-emailer";
import { AzureDownloader } from "../services/azure-storage/downloader";
import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";
import { db } from "../data/db";

export class InvitationController extends BaseController {
    config: Configuration;
    mailer: InvitesEmailer;
    repository: db;

    constructor(configuration: Configuration, auther: PassportLocalAuthenticator, logger: any) {
        super(auther, logger);
        this.config = configuration;
        this.repository = new db(this.config);
        this.mailer = new InvitesEmailer(this.config);

        this["Invitation:path"] = "/invitations/new";
        this["Invitations:path"] = "/invitations";
    }

    public getInvitations = (req: Express.Request & ExpressExtensions.Request, res: Express.Response, next, params) => {
        console.log("get invitations");
        if (this.isLoggedIn(req)) {
            this.repository.Invite.getInvitesByUserId(req.user._id, (error, values) => {
                if (error != null) {
                    res.status(500).send({ message: error.message });
                }
                else {
                    res.send(values);
                }
            });
        }
        else {
            res.status(403).send({ message: "Unauthorized: Please login" });
        }

    }

    public postInvitation = (req: Express.Request & ExpressExtensions.Request, res: Express.Response, next, params) => {
        console.log("post invitation");
        try {
            this.repository.Invite.createInvite(req.body, req.user._id, (error, value) => {
                if (error) {
                    res.status(500).send({ message: "Error saving invite!" });
                }
                else {
                    this.repository.Profile.getProfileByUserId(req.user._id, (error, profile) => {
                        if (error) {
                            this.logger.error(error, "Profile for userId not found:" + req.user._id);
                            res.status(500).send({ message: "Failed to get profile" });
                        }
                        else {
                            this.mailer.sendEmail(value, profile, (error, value) => {
                                if(error){
                                    console.log(error);
                                    res.status(500).send({ message: "Failed to send email" });
                                }
                                else {
                                    res.status(200).send(value);
                                }
                            });
                        }
                    });

                }
            });
        }
        catch (ex) {
            console.log(ex);
        }
    }
}

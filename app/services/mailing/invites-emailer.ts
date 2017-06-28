import { Configuration } from "../settings/config-model";
var SparkPost = require('sparkpost');

export class InvitesEmailer {
    client: any;
    config: Configuration;
    constructor(configuration: Configuration) {
        this.config = configuration;
        this.client = new SparkPost(configuration.sparkPostApiKey);
    }

    public sendEmail = (invite: any, user: any, cb) =>{
        console.log("Invite:" + JSON.stringify(invite));
        console.log("User  :" + JSON.stringify(user));
        let html = "<html><body><p>Hi " +
                    invite.inviteName + "<br /> " +
                    user.fullname +  " would like you you to checkout their account profile at https://sumitmaitra.com/invitation/" + invite._id +
                    "</p></body></html>";
        let text = "Hi "+ invite.inviteName + "\r\n " +
                    user.fullname +  " would like you you to checkout their account profile at https://sumitmaitra.com/invitation/" + invite._id;

        this.client.transmissions.send({
            transmissionBody: {
                content: {
                    from: this.config.verifyFromEmail,
                    subject: user.fullname + ' has invited you to join sumitmaitra.com',
                    html: html
                },
                recipients: [
                    { address: invite.inviteEmail }
                ]
            }
        }, (err, res) => {
            if (err) {
                if (cb != null) {
                    cb(err, null);
                }
            } else {
                if (cb != null) {
                    cb(null, null);
                }
            }
        });
    }
}

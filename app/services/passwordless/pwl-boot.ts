var passwordless = require('passwordless');
var MongoStore = require('passwordless-mongostore');
import { Configuration } from "../settings/config-model";

export class PasswordlessBoot {
    constructor(app, configuration:Configuration){
        passwordless.init(new MongoStore(configuration.mongodbUri, {
        				server: { auto_reconnect: true },
        			    mongostore: { collection: 'tokens' }}));

        passwordless.addDelivery('email',
            (tokenToSend, uidToSend, recipient, callback) => {
                var host = 'localhost:3000';

                var sg = require('sendgrid').SendGrid(configuration.sendgridApiKey);
                var request = sg.emptyRequest();
                request.body = {
                    "personalizations": [
                    {
                        "to": [
                        {
                            "email": "sumitkm@gmail.com"
                        }
                      ],
                      "subject": "Hello World from the SendGrid Node.js Library!"
                    }
                  ],
                  "from": {
                    "email": "sumitkm+sendgrid@protonmail.com"
                  },
                  "content": [
                    {
                      "type": "text/plain",
                      "value": 'Hello!\nAccess your account here: http://'
                      + host + '?token=' + tokenToSend + '&uid='
                      + encodeURIComponent(uidToSend)
                    }
                  ]
                };
                request.method = 'POST';
                request.path = '/v3/mail/send';
                sg.API(request, (response) => {
                  console.log(response.statusCode);
                  console.log(response.body);
                  console.log(response.headers);
                });
        });

        app.use(passwordless.sessionSupport());
        app.use(passwordless.acceptToken({
            successFlash: 'You are logged in. Welcome to Passwordless!',
    		failureFlash: 'The supplied token is not valid (anymore). Please request another one.',
            successRedirect: '/'}
        ));

        app.use((req, res, next) => {
            // if(req.user) {
            //     User.findById(req.user, function(error, userdoc) {
            //         res.locals.user = userdoc;
            //         next();
            //     });
            // } else {
                next();
            // }
        });

    }
}

/// <amd-dependency path="./api-controller"/>
import { User } from "../services/data/user";
var express = require('express');
var router = express.Router();
var passwordless = require('passwordless');
var flash = require('connect-flash');

export class PasswordlessController implements ApiController {
    constructor() {
        this["sendToken:path"] = "/login/sendToken";
    }

    public sendToken = (req, res, next, callback) => {
        console.log("inside PasswordlessController.sendToken");

        req.checkBody('user', 'Please provide a valid email address').isLength(1, 200).isEmail();
        req.sanitize('user').toLowerCase();
        req.sanitize('user').trim();
        var errors = req.validationErrors(true);
        if (errors) {
            console.error("ValidationErrors");
            req.flash('validation', errors);
            res.redirect('/account/login');
        } else {
            let email = req.param('user');

            console.log("NO ValidationErrors: " + email);
            // Request token
            try {
                console.log(typeof (passwordless.requestToken));

                console.log("RequestToken for: " + email);

                //Return user, if she exists, create new if she doesn't
                User.findUser(email, (error, user) => {
                    console.log("User.findUser for: " + email);
                    if (error) {
                        console.log("ERROR User.findUser for: " + email);

                        next(error.toString());
                    } else if (user) {
                        console.log("EXISTS User.findUser for: " + user.id);

                        //callback(null, user.id);
                        next(null, user.id);
                    } else {
                        console.log("CREATEORUPDATE User.findUser for: " + email);

                        User.createOrUpdateUser(email, '', '', function(error, user) {
                            if (error) {
                                callback(error.toString());
                            } else {
                                console.log("CREATE SUCCESS User.findUser for: " + email);

                                next(null, user.id);
                            }
                        })
                    }
                });
                //callback(null, email);

                // {
                //     failureRedirect: '/',
                // 	failureFlash: 'We had issues sending out this email... Could you try it at a later moment?',
                // 	successFlash: 'You should have an email in your inbox in a couple of seconds...!'
                // }),
                (req, res) => {
                    console.log("Redirecting to '/': ");

                    res.redirect('/');
                };
            } catch (error) {
                console.error(error);
            }
        }
        //    next();
    }
}

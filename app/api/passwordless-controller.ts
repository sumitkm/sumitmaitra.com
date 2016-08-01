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
    private validate = (req, res, next) => {
        req.checkBody('user', 'Please provide a valid email address').isLength(1, 200).isEmail();
        req.sanitize('user').toLowerCase();
        req.sanitize('user').trim();
        var errors = req.validationErrors(true);
        if (errors) {
            console.error("ValidationErrors");
            req.flash('validation', errors);
            res.redirect('/account/login');
        }
        else {
            console.log("NO ValidationErrors: ");

            next();
        }
    }
    public sendToken = (req, res, next) => {
        console.log("inside PasswordlessController.sendToken");
        return this.validate(req, res, next),
            // Request token
            passwordless.requestToken(
                function(email, delivery, callback) {
                    console.log(email);
                    // Return user, if she exists, create new if she doesn't
                    User.findUser(email, (error, user) => {
                        if (error) {
                            console.log("ERROR RequestToken for: " + email);

                            callback(error.toString());
                        } else if (user) {
                            console.log("USER EXISTS RequestToken for: " + email);

                            callback(null, user.id);
                        } else {
                            User.createOrUpdateUser(email, '', '', (error, user) => {
                                console.log("USER CREATE RequestToken for: " + email);

                                if (error) {
                                    console.log("USER CREATE FAILED RequestToken for: " + email);

                                    callback(error.toString());
                                } else {
                                    console.log("USER CREATED RequestToken for: " + email);

                                    callback(null, user.id);
                                }
                            })
                        }
                    })
                },
                {
                    failureRedirect: '/',
                    failureFlash: 'We had issues sending out this email... Could you try it at a later moment?',
                    successFlash: 'You should have an email in your inbox in a couple of seconds...!'
                }),
            function(req, res) {
                res.redirect('/');
            };
    }
}

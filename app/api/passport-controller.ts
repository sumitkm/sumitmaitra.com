/// <amd-dependency path="./api-controller"/>
import { Configuration } from "../services/settings/config-model";
import {VerificationEmailer} from "../services/mailing/verification-email";

var Account = require("../services/data/account");
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose'); // TODO: Bad Sumit, no DB in controllers


export class PassportLocalController implements ApiController {
    config: Configuration;
    mailer: VerificationEmailer;

    constructor(configuration: Configuration) {
        this.config = configuration;
        this.mailer = new VerificationEmailer(configuration);
        this["Register:path"] = "/accounts/register";
        this["Login:path"] = "/accounts/login";
        this["Logout:path"] = "/accounts/logout";
        this["Verify:path"] = "/accounts/verify";
        this["VerifyResend:path"] = "/accounts/verifyresend";
    }

    public getVerify = (req, res, next, params) => {
        console.log("Going to GET verification user" + JSON.parse(params));
        if ((req.session.passport != null && req.session.passport.user != null)) {
            res.send({ username: req.sessions.passport.user });
        } else if (req.session.userId != null) {
            res.send({ username: req.session.username });
        } else {
            res.send({ username: 'unknown' });
        }
    }

    public postVerify = (req, res, next) => {
        console.log("Going to POST verify");
        if (req.body.verificationcode != '' && req.body.verificationcode != null) {
            Account.verifyAccount(req.body.verificationcode, (err, account) => {
                if (err) {
                    res.send({ message: "Verification Failed", error: err });
                } else {
                    res.send({ message: "Verification complete, please <a href='/' title='Login'>login to continue</a>", error: null });
                }
            });
        }
        else {
            res.send({ username: req.session.username, message: "" });
        }
    }

    public postVerifyResend = (req, res, next) => {
        console.log("Going to POST resend verification email");
        if (req.session.username != null) {
            console.log("Session UserId: " + req.session.username);
            Account.findByUsername(req.session.username, false, (err, user) => {
                console.log("Session Loaded User: " + user);
                if (user != null && user.email != '') {
                    console.log(JSON.stringify(user));
                    this.mailer.sendEmail(user.verificationCode.toString(), user.email, (error, result) => {
                        if (error) {
                            res.send({ message: "Error sending verification email", error: error });
                        }
                        else {
                            res.send({ message: "Verification email sent successfully", error: error });
                        }
                    });
                }
            });
        }
    }

    public postRegister = (req, res, next) => {
        console.log("Going to register");
        let code = new mongoose.Types.ObjectId;
        let acc = new Account({
            username: req.body.username,
            isVerified: false,
            email: req.body.email,
            verificationCode: code
        });
        Account.register(acc, req.body.password, (err) => {
            if (err) {
                console.log('error while user register!', err);
                return next(err);
            }
            console.log('user registered!');
            this.mailer.sendEmail(code.toString(), req.body.email, (error, data) => {
                res.redirect('/');
            });
        });
    }

    public postLogin = (req, res, next) => {
        console.log("Going to sign in");
        try {
            var func = passport.authenticate('local', (err, authResult, message) => {
                console.log("Error: " + err);
                console.log("AuthResult  :" + authResult.username);
                console.log("Message  :" + message);

                if (authResult != false) {
                    if (authResult.isVerified) {
                        console.log("Account is verified");

                        req.login(authResult, (err) => {
                            if (err) {
                                res.redirect('/login');
                            } else {
                                res.redirect('/');
                            }
                        });
                    } else {
                        console.log("Account is not verified");
                        req.session.username = authResult.username;
                        res.redirect('/verify')
                    };
                }
                else {
                    res.redirect('/login');
                }
            })(req, res, next);
        } catch (error) {
            console.log(error);
        }
    }

    public getLogin = (req, res, next) => {
        console.log("Getting Login: " + JSON.stringify({ user: req.user }));

        res.send({ user: req.user });
    }

    public postLogout = (req, res, next) => {
        console.log("Going to sign out: " + JSON.stringify(req.user));
        req.logout();
        res.redirect('/');
    }
}

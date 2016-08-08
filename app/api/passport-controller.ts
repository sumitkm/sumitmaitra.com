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
            this.mailer.sendEmail(code.toString(), req.body.email);

            res.redirect('/');
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
                    req.login(authResult, (err) => {
                        if (err) {
                            res.redirect('/login');
                        } else {
                            if (authResult.isVerified) {
                                res.redirect('/');
                            }
                            else {
                                res.redirect('/verify')
                            }
                        }
                    });
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

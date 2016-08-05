/// <amd-dependency path="./api-controller"/>

var Account = require("../services/data/account");
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

export class PassportLocalController implements ApiController {
    constructor() {
        this["Register:path"] = "/accounts/register";
        this["Login:path"] = "/accounts/login";
        this["Logout:path"] = "/accounts/logout";
    }

    public postRegister = (req, res, next) => {
        console.log("Going to register");
        Account.register(new Account({ username: req.body.username }), req.body.password,
            (err, account) => {
                if (err) {
                    console.error(err);
                    return res.render('register', { error: err.message });
                }

                passport.authenticate('local');

                req.session.save((err) => {
                    if (err) {
                        console.log("Session save succeeded");

                        return next(err);
                    }
                    res.redirect('/');
                });
            });
    }

    public postLogin = (req, res, next) => {
        console.log("Going to sign in");
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true });
        console.log("Login done: " + JSON.stringify(req.user));
        req.session.save((err) => {
            console.log("Session saved");
            if (err) {
                console.log("Session login failed");

                return next(err);
            }
            console.log("Session save succeeded");

            res.redirect('/');
        });
    }

    public postLogout = (req, res, next) => {
        console.log("Going to sign out: " + JSON.stringify(req.user));
        req.logout();
        req.session.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    }
}

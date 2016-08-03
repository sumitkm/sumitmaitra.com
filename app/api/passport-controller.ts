/// <amd-dependency path="./api-controller"/>

var Account = require("../services/data/account");
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

export class PassportLocalController implements ApiController {
    constructor() {
        this["register:path"] = "/accounts/register";
        this["login:path"] = "/accounts/login";
    }

    private register = (req, res, next) => {
        console.log("Going to register");
        Account.register(new Account({ username: req.body.username }), req.body.password,
            (err, account) => {
                if (err) {
                    console.error(err);
                    return res.render('register', { error: err.message });
                }

                passport.authenticate('local')(req, res, () => {
                    req.session.save((err) => {
                        if (err) {
                            return next(err);
                        }
                        res.redirect('/');
                    });
                });
            });
    }

    private login = (req, res, next) => {
        console.log("Going to sign in");

        Account.findOne({ username: req.body.username }, function(err, user) {
            if (err) { return next(err); }
            if (!user) {
                return next(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(req.body.password)) {
                return next(null, false, { message: 'Incorrect password.' });
            }
            return next(null, user);
        });

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    }
}

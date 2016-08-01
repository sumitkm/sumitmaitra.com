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
    }

    private register = (req, res, next) => {
        console.log("Going to register");
        Account.register(new Account({ username : req.body.username }), req.body.password,
        function(err, account) {
                if (err) {
                    console.error(err);

                  return res.render('register', { error : err.message });
                }

                passport.authenticate('local')(req, res, function () {
                    req.session.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        res.redirect('/');
                    });
                });
            });
    }
}

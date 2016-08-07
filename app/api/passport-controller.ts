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
        Account.register(new Account({username: req.body.username}), req.body.password, (err) => {
            if (err) {
              console.log('error while user register!', err);
              return next(err);
            }

            console.log('user registered!');
            res.redirect('/');
          });
    }

    public postLogin = (req, res, next) => {
        console.log("Going to sign in");
        try
        {
            var func = passport.authenticate('local', (err, authResult, message)=>{
                console.log("Error: " + err);
                console.log("AuthResult  :" + authResult);
                console.log("Message  :" + message);
                if(authResult != false){
                    req.user = authResult;
                    res.redirect('/');
                }
                else{
                    res.redirect('/login');
                }
            });
            func(req, res);
        } catch(error){
            console.log(error);
        }
    }

    public getLogin = (req, res, next) => {
        console.log("Getting Login: " + JSON.stringify({ user: req.user, some: 'dummy'}));

        res.send({ user: req.user, some: 'dummy'});
    }

    public postLogout = (req, res, next) => {
        console.log("Going to sign out: " + JSON.stringify(req.user));
        req.logout();
        res.redirect('/');
    }
}

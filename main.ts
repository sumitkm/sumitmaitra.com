/// <reference path="./typings/index.d.ts"/>

import * as express from "express";
import nconf = require('nconf');
import { Config } from "./app/services/settings/config";
import { Container } from "./app/di/container";
import { CrossRouter } from "./app/services/routing/cross-router";
import { Configuration } from "./app/services/settings/config-model";
import { PassportLocalBoot } from "./app/services/passport-local/boot";
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var MongoDBStore = require('connect-mongodb-session')(session);
var email = require("emailjs");
var flash = require('connect-flash');
var configService = new Config();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data
var Account = require('./app/services/data/account');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

configService.load((config: Configuration) => {
    console.log("CONFIG:" + JSON.stringify(config, null, 2));
    let app = express();

    let pathToMongoDb = config.mongodbUri;
    let store = new MongoDBStore(
        {
            uri: pathToMongoDb,
            collection: 'WebSessions'
        });

    // Catch errors
    store.on('error', (error) => {
        // assert.ifError(error);
        // assert.ok(false);
        console.error(error);
    });
    app.use(logger('dev'));
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    app.use(cookieParser());
    app.use(require('express-session')({
        secret: config.sessionSecret,
        // cookie: {
        //     maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        // },
        // store: store,
        resave: false,
        saveUninitialized: false
    }));

    var router = new CrossRouter();
    Container.router = router;
    Container.inject();

    app.use('/api', router.route);
    app.use('/', express.static(__dirname + '/app/www/'));
    app.use('/login', express.static(__dirname + '/app/www/'));
    app.use('/projects', express.static(__dirname + '/app/www/'));
    app.use('/register', express.static(__dirname + '/app/www/'));
    app.use(passport.initialize());
    app.use(flash());
    app.use(passport.session());
    passport.use(new LocalStrategy(Account.authenticate));
    passport.serializeUser(Account.serializeUser());
    passport.deserializeUser(Account.deserializeUser());

    mongoose.connect(config.mongodbUri);

    var server = app.listen(3001, () => {
        var host = server.address().address;
        var port = server.address().port;
        console.log('sumitmaitra.com running at http://%s:%s', host, port);
    });


    if (app.get('env') === 'development') {
        app.use((err, req, res, next: any) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }
});

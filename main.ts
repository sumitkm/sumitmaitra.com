/// <reference path="./typings/index.d.ts"/>

import nconf = require('nconf');
import { Config } from "./app/services/settings/config";
import { Container } from "./app/di/container";
import { CrossRouter } from "./app/services/routing/cross-router";
import { Configuration } from "./app/services/settings/config-model";

var configService = new Config();
var express = require('express');

var multer = require('multer');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');


var app = express();
var http = require('http');
var https = require('https');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/uploads/temp');
  },
  filename: (req, file, cb) => {
      console.log(file);
    cb(null, Date.now() + '-' + file.originalname);
  }
})
var upload = multer({ storage: storage });

var serializeUser = (params) => {
    console.log("local serializeUser: " + JSON.stringify(params));
}

var deserializeUser = (params) => {
    console.log("local deserializeUser: " + JSON.stringify(params));
}

configService.load((config: Configuration) => {
    var credentials = {
        key: fs.readFileSync(__dirname + config.key, 'utf8'),
        cert: fs.readFileSync(__dirname + config.cert, 'utf8')
    };

    console.log("Config Loaded:" + (config !== null));
    // Connect mongoose
    mongoose.connect(config.mongodbUri, (err) => {
        if (err) {
            console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
        }
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    var MongoStore = require('connect-mongo')(session);

    app.use(session({
        cookie: {
            maxAge: 3600000
        },
        secret: config.sessionSecret,
        saveUninitialized: true,
        resave: true,
        store: new MongoStore({ url: config.mongodbUri })
    }));

    // Configure passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // Configure passport-local to use account model for authentication
    var Account = require('./app/data/account');
    passport.use(Account.createStrategy());

    passport.serializeUser(Account.serializeUser());
    passport.deserializeUser(Account.deserializeUser());


    var crossRouter = new CrossRouter();
    Container.router = crossRouter;
    Container.inject(config);

    // Register routes
    app.set("view options", { layout: false });
    app.use('/', express.static(__dirname + '/app/www/'));
    app.use('/projects', express.static(__dirname + '/app/www/'));
    app.use('/register', express.static(__dirname + '/app/www/'));
    app.use('/login', express.static(__dirname + '/app/www/'));
    app.use('/profile', express.static(__dirname + '/app/www/'));
    app.use('/verify', express.static(__dirname + '/app/www/')); // Really express ????
    app.use('/verify/:verificationCode', express.static(__dirname + '/app/www/'));
    app.post('/api/uploader/files', upload.any(), crossRouter.route);
    app.use('/api', crossRouter.route);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });

    // error handlers
    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    var pkg = require('./package.json');
    var httpServer = http.createServer(app);
    var httpsServer = https.createServer(credentials, app);
    httpServer.listen(3001, () => {
        console.log(pkg.name, 'listening on port ', httpServer.address().port);
    });
    httpsServer.listen(3444, () => {
        console.log(pkg.name, 'listening on port ', httpsServer.address().port);
    });
});

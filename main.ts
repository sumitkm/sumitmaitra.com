/// <reference path="./typings/index.d.ts"/>

import nconf = require('nconf');
import { Config } from "./app/services/settings/config";
import { SpaEngine } from "./spa-engine";
import { Container } from "./app/di/container";
import { CrossRouter } from "./app/services/routing/cross-router";
import { Configuration } from "./app/services/settings/config-model";
import { PassportLocalAuthenticator } from "./app/services/passport-local/passport-local-authenticator";

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
var bunyan = require('bunyan');
var logger = bunyan.createLogger({
    name: 'sumitmaitra.com',
    serializers: {
        req: bunyan.stdSerializers.req,     // standard bunyan req serializer
        err: bunyan.stdSerializers.err      // standard bunyan error serializer
    },
    streams: [
        {
            level: 'info',                  // loging level
            path: __dirname + '/logs/foo.log'
        }
    ]
});
var configService = new Config(logger);

try {
    logger.info("Start");
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '/uploads/temp');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        }
    })
    var upload = multer({ storage: storage });


    configService.load((config: Configuration) => {
        console.log("Configuration Loaded");

        Container.apiRouter = new CrossRouter("/api");
        Container.webRouter = new CrossRouter();
        Container.inject(config, null, logger);
        console.log("Container injected");

        var credentials = {
            key: fs.readFileSync(__dirname + config.key, 'utf8'),
            cert: fs.readFileSync(__dirname + config.cert, 'utf8')
        };

        // Connect mongoose
        mongoose.connect(config.mongodbUri, (err) => {
            if (err) {
                //console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
                logger.info({ error: err }, 'Connect error');
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
        // let bootPassport = new PassportLocalAuthenticator(app, passport, config);
        // bootPassport.init();
        app.use(passport.initialize());
        app.use(passport.session());

        // Configure passport-local to use account model for authentication
        var Account = require('./app/data/account');
        passport.use(Account.createStrategy());
        passport.serializeUser(Account.serializeUser());
        passport.deserializeUser(Account.deserializeUser());


        app.use('/', function(req, res, next) {
            req.logger = logger;
            next();
        });
        // Register routes
        app.use(express.static(__dirname + '/app/www/')); // All static stuff from /app/wwww
        // SpaEngine - Handle server side requests by rendering the same index.html pages
        // for all routes

        var spaEngine = new SpaEngine(config);
        app.set('views', __dirname + '/app/www');
        app.set("view options", { layout: false });
        app.engine('html', spaEngine.renderer);
        app.set('view engine', 'html');
        // Special route for File upload handling
        app.post('/api/uploader/files', upload.any(), Container.apiRouter.route);
        // All HTTP API requests
        app.use('/api', Container.apiRouter.route);
        // All content requests that are not in static
        app.use('/', Container.webRouter.route);

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
            app.use((err, req, res, next) => {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        app.use((err, req, res, next) => {
            logger.info({ error: err }, 'Internal server error');

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
}
catch (err) {
    // console.error(err);
    logger.info({ error: err }, 'Unhandled error');

}

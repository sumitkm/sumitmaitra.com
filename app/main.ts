import nconf = require('nconf');
import { Config } from "./services/settings/config";
import { SpaEngine } from "./spa-engine";
import { Container } from "./di/container";
import { CrossRouter } from "./services/routing/cross-router";
import { Configuration } from "./services/settings/config-model";
import { PassportLocalAuthenticator } from "./services/passport-local/passport-local-authenticator";
import * as bunyan from "bunyan";
import * as ExpressExtensions from "./interops/express-extensions";
var express = require('express');
var multer = require('multer');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');
var app = express();
var http = require('http');
var https = require('https');

export class main {
    logger: bunyan;
    config: Config;

    constructor() {
        this.logger = bunyan.createLogger({
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
        this.config = new Config(this.logger);
    }

    public start = () => {
        try {
            this.logger.info("Start");
            var storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, __dirname + '/uploads/temp');
                },
                filename: (req, file, cb) => {
                    cb(null, Date.now() + '-' + file.originalname);
                }
            })
            var upload = multer({ storage: storage });


            this.config.load((config: Configuration) => {
                console.log("Configuration Loaded");

                Container.apiRouter = new CrossRouter("/api");
                Container.webRouter = new CrossRouter();
                Container.inject(config, null, this.logger);
                console.log("Container injected");

                var credentials = {
                    key: fs.readFileSync(__dirname + config.key, 'utf8'),
                    cert: fs.readFileSync(__dirname + config.cert, 'utf8')
                };

                // Connect mongoose
                var options = {
        			server: { auto_reconnect: true },
        			auth: {
        	        	authSource: "admin"
        	    	},
        	    	user: "piotsuperuser",
        	    	pwd: "db2play201&"
        		}
                mongoose.connect(config.mongodbUri, options, (err) => {
                    if (err) {
                        //console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
                        this.logger.info({ error: err }, 'Connect error');
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
                var Account = require('./data/account');
                passport.use(Account.createStrategy());
                passport.serializeUser(Account.serializeUser());
                passport.deserializeUser(Account.deserializeUser());


                app.use('/', (req : any, res, next) => {
                    req.logger = this.logger;
                    next();
                });
                // Register routes
                app.use(express.static(__dirname + '/www/')); // All static stuff from /wwww
                // SpaEngine - Handle server side requests by rendering the same index.html pages
                // for all routes

                var spaEngine = new SpaEngine(config);
                app.set('views', __dirname + '/www');
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
                        this.logger.error(err, 'Internal server error');
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
                    this.logger.info({ error: err }, 'Internal server error');

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
            this.logger.info({ error: err }, 'Unhandled error');

        }
    }
}

var application = new main();
application.start();

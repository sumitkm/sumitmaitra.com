
import { Configuration } from "../settings/config-model";

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

export class PassportLocalBoot {
    private app;
    private configuration: Configuration;

    constructor(app, config: Configuration) {
        this.app = app;
        this.configuration = config;
    }

    public init() {
        var Account = require('../data/account');
        this.app.use(passport.initialize());
        this.app.use(flash());
        this.app.use(passport.session());
        passport.use(new LocalStrategy(Account.authenticate()));
        passport.serializeUser(Account.serializeUser());
        passport.deserializeUser(Account.deserializeUser());

    }
}

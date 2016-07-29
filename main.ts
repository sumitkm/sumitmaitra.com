/// <reference path="./typings/index.d.ts"/>

import * as express from "express";
import { CrossRouter } from "./app/services/routing/cross-router";
import { Container } from "./app/di/container";

var passwordless = require('passwordless');
var MongoStore = require('passwordless-mongostore');
var email   = require("emailjs");

var smtpServer  = email.server.connect({
   user:    "yourEmail",
   password: "yourPwd",
   host:    "yourSmtp",
   ssl:     true
});
var pathToMongoDb = 'mongodb://192.168.0.57/sumitmaitra';
app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ successRedirect: '/'}));

passwordless.init(new MongoStore(pathToMongoDb));
passwordless.addDelivery(
    function(tokenToSend, uidToSend, recipient, callback) {
        var host = 'localhost:3000';
        smtpServer.send({
            text:    'Hello!\nAccess your account here: http://'
            + host + '?token=' + tokenToSend + '&uid='
            + encodeURIComponent(uidToSend),
            from:    "yourEmail",
            to:      recipient,
            subject: 'Token for ' + host
        }, function(err, message) {
            if(err) {
                console.log(err);
            }
            callback(err);
        });
});

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data

var app = express();
var bodyParser = require('body-parser');

app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ successRedirect: '/'}));


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('./app/www/'));


var router = new CrossRouter();

Container.router = router;
Container.inject();

app.use('/api', router.route);

var server = app.listen(3001, () =>
{
    var host = server.address().address;
    var port = server.address().port;
    console.log('sumitmaitra.com running at http://%s:%s', host, port);
});

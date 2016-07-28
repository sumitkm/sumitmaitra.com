/// <reference path="./typings/index.d.ts"/>

import * as express from "express";
import { CrossRouter } from "./app/services/routing/cross-router";
import { Container } from "./app/di/container";

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); // for parsing multipart/form-data

var app = express();
var bodyParser = require('body-parser');

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

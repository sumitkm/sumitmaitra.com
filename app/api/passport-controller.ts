/// <amd-dependency path="./api-controller"/>

import { User } from "../services/data/user";
var express = require('express');
var router = express.Router();
var passwordless = require('passwordless');
var flash = require('connect-flash');

export class PasswordlessController implements ApiController {
    constructor() {
        this["sendToken:path"] = "/login/sendToken";
    }

    private validate = (req, res, next) => {

    }
}

/// <amd-dependency path="./api-controller"/>

import * as express from "express";

export class HomeController implements ApiController
{
    constructor() {
        this["Home:path"] = "/";
    }

    public getHome = (req, res, next) => {
        console.log({ user: req.user });
        console.log("inside HomeController.getAllProjects");
        next();
    }
}

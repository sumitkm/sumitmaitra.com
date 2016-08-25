/// <amd-dependency path="./api-controller"/>

import * as Express from "express-serve-static-core";

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

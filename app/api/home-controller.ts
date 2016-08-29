/// <amd-dependency path="./api-controller"/>

import * as Express from "express-serve-static-core";

export class HomeController implements ApiController {
    constructor() {
        this["Home:path"] = "/:route*:";
    }

    public getHome = (req: Express.Request, res: Express.Response, next) => {
        //debugger;
        this.renderSpa(req, res, next);
    }

    private renderSpa = (req: Express.Request, res: Express.Response, next) => {
        //debugger;

        res.status(200);
        if (req.url.lastIndexOf("www") > 0 ||
        req.url.lastIndexOf("libs") > 0 ||
            req.url.lastIndexOf("api") > 0 ||
            req.url.lastIndexOf("scripts") > 0 ||
            req.url.lastIndexOf("static") > 0 ||
            req.url.lastIndexOf("images") > 0 ||
            req.url.lastIndexOf("styles") > 0 ){
            next();
        }
        else {
            res.render("index");
        }
    }
}

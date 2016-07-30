/// <amd-dependency path="./api-controller"/>

import * as express from "express";

export class HomeController implements ApiController
{
    constructor() {
        this["getAllProjects:path"] = "/home/getAllProjects/:name:";
    }

    public getAllProjects = () => {
        console.log("inside HomeController.getAllProjects");
    }
}

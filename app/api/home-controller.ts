/// <amd-dependency path="./api-controller"/>

import * as express from "express";

export class HomeController implements ApiController
{
    constructor() {
        this["getAllProjectsGet:path"] = "/home/getAllProjects/:name:";
    }

    public allProjectsGet = () => {
        console.log("inside HomeController.getAllProjects");
    }
}

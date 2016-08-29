// This is the routing middleware that uses crossroads.js
/// <reference path="../../../typings/index.d.ts"/>

import * as express from "express";
import { CrossRoute } from "./cross-route";
import { EventEmitter } from "events";

var crossroads: CrossroadsJs.CrossRoadsStatic = require("crossroads");

export class CrossRouter extends EventEmitter {
    private nxt: any;
    private services = [];
    private router = crossroads.create();
    public rootPath: string = "";

    constructor(rootPath: string = "") {
        super();
        this.rootPath = rootPath;
        this.router.ignoreState = true;
        this.router.normalizeFn = crossroads.NORM_AS_OBJECT;

        this.router.bypassed.add((url) => {
            console.log("Bypassed " + url + " by " + this.rootPath + " rootpath router");
            if (this.nxt != null) {
                this.nxt();
            }
        });
    }

    public registerRoute = (currentRoute: CrossRoute) => {

        this.router.addRoute(currentRoute.route, (req, res, next, params) => {
            try {
                let controller = <any>currentRoute.controller;
                let funcName = req.method.toLowerCase() + currentRoute.name;
                console.log("RootPath: "  + this.rootPath+ " : funcName: " + funcName + " for req.url: " + req.url);

                controller[funcName].call(controller[funcName], req, res, next, params);
            } catch (error) {
                console.error("registerRoute blew up: ", error);
            }
        });
    }

    // All routes that start with /api are sent to this function.
    // This is as per the middleware configuration in app.ts
    // e.g.
    //  var navigator = require("./navigation/cross-router");
    //  var nav = new navigator.crossRouter();
    //  app.use('/api', nav.route);
    public route = (req: express.Request, res: express.Response, next: any) => {
        this.nxt = next;
        //console.log("crossRouter: Requested Url:" + req.url);
        try {
            this.router.parse(req.url, [req, res, next]);
        }
        catch (e) {
            console.error("ERROR: Route " + req.url + " blew up: " , e);
        }
    }
}

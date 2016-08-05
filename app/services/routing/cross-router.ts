// This is the routing middleware that uses crossroads.js
/// <reference path="../../../typings/index.d.ts"/>

import * as express from "express";
import { CrossRoute } from "./cross-route";
import { EventEmitter } from "events";

var crossroads : CrossroadsJs.CrossRoadsStatic = require("crossroads");

export class CrossRouter extends EventEmitter {
  private nxt: any;
  private services = [];

  constructor() {
      super();
      crossroads.ignoreState = true;
      crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;

      crossroads.bypassed.add((url) => {
          console.log("bypassed: " + url);
          this.nxt();
      });
  }

  public registerRoute = (currentRoute: CrossRoute) => {
      crossroads.addRoute(currentRoute.route, (req, res, next, params) => {
          try
          {
              console.log('CrossRouter - Request (req):' + req);
              let controller = <any>currentRoute.controller;
              let funcName = req.method.toLowerCase() + currentRoute.name;
              console.log("Function Name: " + funcName);
              controller[funcName].call(controller[funcName], req, res, next);
          } catch (error) {
              console.log("registerRoute blew up: " + error);
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
    console.log("crossRouter: Requested Url:" + req.url );
    try {
        crossroads.parse(req.url, [req, res, next]);
    }
    catch (e) {
        console.error("route blew up: ", e);
    }
    //next();
  }
}

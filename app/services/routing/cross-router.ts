// This is the routing middleware that uses crossroads.js
/// <reference path="../../../typings/index.d.ts"/>

import * as express from "express";
import { CrossRoute } from "./cross-route";
import { EventEmitter } from "events";
import { HomeController } from "../../api/home-controller";

var crossroads = require("crossroads");

//import * as navigation from "./route-registry";
export class CrossRouter extends EventEmitter {
  private nxt: any;
  private services = [];

  constructor() {
      super();
      crossroads.ignoreState = true;
      crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;

      crossroads.bypassed.add((url) => {
          console.log("bypassed: " + url);
      });
  }

  public registerRoute = (currentRoute: CrossRoute) => {
      crossroads.addRoute(currentRoute.route, (req, res, next, params) => {
          try
          {
              console.log("params: " + JSON.stringify(params));
              console.log("currentRoute:"+  JSON.stringify(currentRoute));
              let controller = <any>currentRoute.controller;
              controller[currentRoute.name].apply();
          } catch (error) {
              console.log("Routed blew up: " + error);
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
    console.log("crossRouter: Requested Url:" + req.url );
    try {
        crossroads.parse(req.url, [req, res, next]);
    }
    catch (e) {
        console.log("Parse blew up: " + JSON.stringify(e, null, 2));
    }
    next();
  }
}

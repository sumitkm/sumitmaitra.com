/// <reference path="../../typings/index.d.ts"/>

import * as ko from "knockout";
import { Router } from "./st-router";
import { Route } from "./st-route";

export class app {

  router : Router;

  constructor() {
      this.router = new Router();
  }

  public startUp = () => {
      this.registerComponent("home-page", "./ui/pages/home-page/home-page")
      this.registerComponent("projects", "./ui/pages/projects/projects")
      this.registerComponent("print-preview", "./ui/print-preview/print-preview");
      this.registerComponent("st-nav-menu", "./ui/components/generic/st-nav-menu/st-nav-menu");
      this.registerRoutes();
  }

  public registerRoutes = () => {
      this.registerRoute(Router.newRouteFactory("/projects/:routeParams*:","projects",this.router, "Projects | The lazy blogger!") );
      var homeRoute : Route = Router.newRouteFactory("/:routeParams*:","home-page",this.router, "Home | The lazy blogger!") ;
      this.registerRoute(homeRoute);
      this.router.currentRoute(homeRoute);
      ko.applyBindings(this.router.currentRoute);
  }

  public registerRoute = (newRoute: Route) =>{
      this.router.registerRoute(newRoute);
  }

  public registerComponent = (name: string, location: string) => {
      ko.components.register(name, { require: location });
  }
}

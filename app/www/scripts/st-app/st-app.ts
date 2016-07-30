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
      this.registerComponent("home", "./ui/pages/home/home")
      this.registerComponent("projects", "./ui/pages/projects/projects")
      this.registerComponent("login", "./ui/pages/login/login")
      this.registerComponent("print-preview", "./ui/print-preview/print-preview");
      this.registerComponent("st-nav-menu", "./ui/components/generic/st-nav-menu/st-nav-menu");
      this.registerRoutes();
  }

  private registerRoutes = () => {
      this.registerRoute(Router.newRouteFactory("/projects/:routeParams*:","projects",this.router, "Projects | The lazy blogger!") );
      this.registerRoute(Router.newRouteFactory("/login/:routeParams*:","login",this.router, "Login | The lazy blogger!") );

      var homeRoute : Route = Router.newRouteFactory("/:routeParams*:","home",this.router, "Home | The lazy blogger!") ;
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

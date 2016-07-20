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
      this.router.registerRoute({ path: ko.observable("/"), pageComponent: ko.observable("home-page")} );
      this.router.registerRoute({ path: ko.observable("/projects/:routeParams*:"), pageComponent: ko.observable("projects")} );
      this.router.currentRoute(this.router.routes()[0]);
      ko.applyBindings(this.router.currentRoute);

  }

  public registerComponent = (name: string, location: string) => {
      ko.components.register(name, { require: location });
  }
}

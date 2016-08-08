/// <reference path="../../typings/index.d.ts"/>

import * as ko from "knockout";
import { Router } from "./st-router";
import { Route } from "./st-route";

export class app {

    router: Router;

    constructor() {
        this.router = new Router();
    }

    public startUp = () => {
        this.registerComponents();
        this.registerRoutes();
    }

    private registerComponents = () => {
        this.registerComponent("home", "./ui/pages/home/home");
        this.registerComponent("projects", "./ui/pages/projects/projects");
        this.registerComponent("login", "./ui/pages/login/login");
        this.registerComponent("profile", "./ui/pages/profile/profile");
        this.registerComponent("verify", "./ui/pages/verify/verify");
        this.registerComponent("register", "./ui/pages/register/register");
        this.registerComponent("print-preview", "./ui/print-preview/print-preview");
        this.registerComponent("st-nav-menu", "./ui/components/generic/st-nav-menu/st-nav-menu");
    }

    private registerRoutes = () => {
        this.registerRoute(Router.newRouteFactory("/projects/:routeParams*:", "projects", this.router, "Projects | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/login/:routeParams*:", "login", this.router, "Login | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/profile/:routeParams*:", "profile", this.router, "Profile | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/verify/:routeParams*:", "verify", this.router, "Verify Account | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/register/:routeParams*:", "register", this.router, "Register | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/:routeParams*:", "home", this.router, "Home | The lazy blogger!"));

        this.router.parseCurrentRoute();
        ko.applyBindings(this.router.currentRoute);
    }

    public registerRoute = (newRoute: Route) => {
        this.router.registerRoute(newRoute);
    }

    public registerComponent = (name: string, location: string) => {
        ko.components.register(name, { require: location });
    }
}

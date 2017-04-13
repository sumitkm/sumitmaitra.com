import * as ko from "knockout";
import { Router } from "./st-router";
import { Route } from "./st-route";
import { MenuItem } from "../st-ui/view-models/st-nav-menu/st-menu-item";

export class app {
    router: Router;

    constructor() {
        this.router = new Router();
    }

    public startUp = () => {
        this.registerMenuItems();
        this.registerComponents();
        this.registerRoutes();
    }

    private registerMenuItems = () => {
        //console.log("Registering menu items.");
        this.router.leftMenuItems.push(MenuItem.factory('&#xf015;', '/', 'nav-header nav-menu-item', 'fa', false, []));
        this.router.leftMenuItems.push(MenuItem.factory('Projects', '/projects', 'nav-menu-item', '', false, []));
        this.router.leftMenuItems.push(MenuItem.factory('Blog', '', 'nav-menu-item', '', false, []));
        this.router.leftMenuItems.push(MenuItem.factory('Reflection', '/feed', 'nav-menu-item', '', true, ['owner']));
        this.router.leftMenuItems.push(MenuItem.factory('Events', '/events', 'nav-menu-item', '', true, ['owner']));
    }

    private registerComponents = () => {
        this.registerComponent("home", "./ui/pages/home/home");
        this.registerComponent("blog", "./ui/pages/blog/blog");
        this.registerComponent("projects", "./ui/pages/projects/projects");
        this.registerComponent("login", "./ui/pages/login/login");
        this.registerComponent("profile", "./ui/pages/profile/profile");
        this.registerComponent("verify", "./ui/pages/verify/verify");
        this.registerComponent("register", "./ui/pages/register/register");
        this.registerComponent("reflections", "./ui/pages/reflections/reflections");

        this.registerComponent("print-preview", "./ui/print-preview/print-preview");
        this.registerComponent("st-nav-menu", "./st-ui/components/st-nav-menu/st-nav-menu");
        this.registerComponent("st-nav-tab", "./st-ui/components/st-nav-tab/st-nav-tab");
        this.registerComponent("st-image-uploader", "./st-ui/components/st-image-uploader/st-image-uploader");
        this.registerComponent("st-feed-list", "./st-ui/components/st-feed-list/st-feed-list");
    }

    private registerRoutes = () => {
        this.registerRoute(Router.newRouteFactory("/projects/:routeParams*:", "projects",  "Projects | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/login/:routeParams*:", "login",  "Login | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/profile/:tab:/:routeParams*:", "profile",  "Profile | :tab: | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/profile/:routeParams*:", "profile",  "Profile | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/verify/:verificationCode:/:routeParams*:", "verify",  "Verify Account | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/register/:routeParams*:", "register",  "Register | The lazy blogger!"));
        this.registerRoute(Router.newRouteFactory("/feed/:routeParams*:", "reflections",  "My Reflections"));
        this.registerRoute(Router.newRouteFactory("/:routeParams*:", "home",  "Home | The lazy blogger!"));

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

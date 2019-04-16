import * as ko from "knockout";
import * as toastr from "toastr";
import { Router } from "./st-router";
import { stMenuItem } from "../st-ui/view-models/st-nav-menu/st-menu-item";

export class silkthread implements SilkThread{
    public router: Router;

    constructor() {
        this.router = new Router();
    }

    public startUp = () => {
        this.registerComponents();
        this.registerRoutes();
    }

    private registerComponents = () => {

        this.registerComponent("st-nav-menu", "./st-ui/components/st-nav-menu/st-nav-menu");
        this.registerComponent("st-nav-tab", "./st-ui/components/st-nav-tab/st-nav-tab");
        this.registerComponent("st-side-nav", "./st-ui/components/st-side-nav/st-side-nav");
        this.registerComponent("st-image-uploader", "./st-ui/components/st-image-uploader/st-image-uploader");
        this.registerComponent("st-feed-list", "./st-ui/components/st-feed-list/st-feed-list");
        this.registerComponent("st-modal", "./st-ui/components/st-modal/st-modal");
    }

    private registerRoutes = () => {

        this.registerRoute(Router.newRouteFactory("/:routeParams*:", "home",  "Home | The lazy blogger!"));

        this.router.parseCurrentRoute();
        ko.applyBindings(this.router.currentRoute);
    }

    public registerMenu = (text: string, url: string, menuCssClass: string, menuHrefClass: string, authenticated: boolean, roles: Array<string> ) => {
        this.router.leftMenuItems.push(stMenuItem.factory(text, url, menuCssClass, menuHrefClass, authenticated, roles));
    }

    public registerRoute = (newRoute: Route) => {
        this.router.registerRoute(newRoute);
    }

    public registerComponent = (name: string, location: string) => {
        ko.components.register(name, { require: location });
    }
}

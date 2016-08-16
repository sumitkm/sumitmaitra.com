import * as ko from "knockout";
import { Route } from "./st-route";
import { MenuItem } from "../ui/components/generic/st-nav-menu/st-menu-item";
import * as cr from "crossroads";

var Historyjs : Historyjs = <any> History;
var crossroads = cr;

class Router {
    currentRoute: KnockoutObservable<Route> = ko.observable<Route>();
    routes: KnockoutObservableArray<Route> = ko.observableArray<Route>([]);
    leftMenuItems: KnockoutObservableArray<MenuItem> = ko.observableArray<MenuItem>([]);
    rightMenuItems: KnockoutObservableArray<MenuItem> = ko.observableArray<MenuItem>([]);

    constructor() {
        $(document).on('click', 'a', this.handleAnchorClick);
        this.activateCrossroads();
        this.leftMenuItems.push(MenuItem.factory('&#xf015;', '/', 'nav-header nav-menu-item', 'fa'));
        this.leftMenuItems.push(MenuItem.factory('Projects', '/projects', 'nav-menu-item', ''));
        this.leftMenuItems.push(MenuItem.factory('Blog', '', 'nav-menu-item', ''));

    }

    public static newRouteFactory = (routePath: string, pageComponent: string, router: Router, title?: string, roles? : Array<string>) => {
        let newRoute = new Route(routePath, title, pageComponent, router, roles);
        newRoute.router = router;
        newRoute.title(title);
        return newRoute;
    }

    public registerRoute = (newRoute: Route) => {
        this.routes.push(newRoute);

        crossroads.addRoute(newRoute.path(), (crRoute) => {
            let selectedRoute = ko.utils.arrayFirst<Route>(this.routes(), r=>r.path()==newRoute.path());
            selectedRoute.crRoute(crRoute);
            $.get( "/api/accounts/login", ( data ) => {
                this.rightMenuItems.removeAll();
                if(data.user!=null)
                {
                    this.rightMenuItems.push(MenuItem.factory(data.user.username, '/profile', 'nav-menu-item', ''));

                    selectedRoute.userName(data.user.username);
                    selectedRoute.userId(data.user._id);
                }
                else
                {
                    this.rightMenuItems.push(MenuItem.factory('Login', '/login', 'nav-menu-item', ''));

                }
                console.log( data );
                if(selectedRoute!=null)
                {
                    selectedRoute.leftMenuItems = this.leftMenuItems;
                    selectedRoute.rightMenuItems = this.rightMenuItems;
                    this.currentRoute(selectedRoute);
                    document.title = newRoute.title();
                }
            });
        });
    }

    public parseCurrentRoute = ()=>{
        this.historyStateChanged();
    }

    private handleAnchorClick = (event) => {
        console.log(JSON.stringify($(event.target).attr("href"), null, 2));
        try {
            let url = $(event.target).attr("href");
            Historyjs.pushState({ url: url }, "", url);
        }
        catch(error) {
            //todo: log
        }
        return false;
    }

    private historyStateChanged = () => {
        let state = <any>Historyjs.getState();
        if(state.data && state.data.url != null)
        {
            return crossroads.parse(state.data.url);
        }
        else if (state.hash.length > 1) {
            var fullHash = state.hash;
            return crossroads.parse(fullHash);
        }
        else
        {
            return crossroads.parse('/');
        }
    }

    private getRoute = (url: string) => {
        var selectedRoute = ko.utils.arrayFirst<Route>(this.routes(), r=>r.path()==url);
        return selectedRoute;
    }

    private activateCrossroads = () => {
        Historyjs.Adapter.bind(window, "statechange", this.historyStateChanged);
        crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
    }

}

export { Router };

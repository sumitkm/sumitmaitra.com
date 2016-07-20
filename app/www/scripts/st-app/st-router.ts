import * as crossroads from "crossroads";
import * as ko from "knockout";
import { Route } from "./st-route";

var Historyjs : Historyjs = <any> History;

class Router {
    currentRoute: KnockoutObservable<Route> = ko.observable<Route>();
    routes: KnockoutObservableArray<Route> = ko.observableArray<Route>([]);

    constructor() {
        $(document).on('click', 'a', this.handleAnchorClick);
        this.activateCrossroads();
    }

    private handleAnchorClick = (event) =>
    {
        console.log(JSON.stringify($(event.target).attr("href"), null, 2));
        try {
            let url = $(event.target).attr("href");
            Historyjs.pushState({ }, url, url);
        }
        catch(error) {
            //todo: log
        }
        return false;
    }

    public registerRoute = (newRoute: Route) => {
        this.routes.push(newRoute);
        crossroads.addRoute(newRoute.path(), () => {
            var selectedRoute = ko.utils.arrayFirst<Route>(this.routes(), r=>r.path()==newRoute.path());
            if(newRoute!=null)
            {
                this.currentRoute(newRoute);
            }
        });
    }

    public static newRouteFactory = (routeName: string, routePath: string, roles? : Array<string>) => {
        let newRoute = new Route(routeName, routePath, roles);
        return newRoute;
    }

    private activateCrossroads = () => {
        Historyjs.Adapter.bind(window, "statechange", this.historyStateChanged);
        //crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
    }

    public historyStateChanged = () => {
        let state: HistoryState = Historyjs.getState();
        if (state.hash.length > 1) {
            var fullHash = state.hash;
            return crossroads.parse(fullHash);
        }
        else {
            return crossroads.parse('/');
        }
    }
}

export { Router };

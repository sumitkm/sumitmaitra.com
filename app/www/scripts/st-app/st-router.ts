import * as ko from "knockout";
import { Route } from "./st-route";

var Historyjs : Historyjs = <any> History;
var crossroads : CrossroadsJs.CrossRoadsStatic = require("crossroads");

class Router {
    currentRoute: KnockoutObservable<Route> = ko.observable<Route>();
    routes: KnockoutObservableArray<Route> = ko.observableArray<Route>([]);

    constructor() {
        $(document).on('click', 'a', this.handleAnchorClick);
        this.activateCrossroads();
    }

    public static newRouteFactory = (routeName: string, routePath: string,  router: Router, title?: string, roles? : Array<string>) => {
        let newRoute = new Route(routeName, routePath, router, roles);
        newRoute.router = router;
        newRoute.title(title);
        return newRoute;
    }

    public registerRoute = (newRoute: Route) => {
        this.routes.push(newRoute);
        crossroads.addRoute(newRoute.path(), () => {
            var selectedRoute = ko.utils.arrayFirst<Route>(this.routes(), r=>r.path()==newRoute.path());
            if(selectedRoute!=null)
            {
                this.currentRoute(selectedRoute);
                document.title = newRoute.title();
            }
        });
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
        let state: HistoryState = Historyjs.getState();
        if(state.data.url != '')
        {
            return crossroads.parse(state.data.url);
        }
        else if (state.url.length > 1) {
            var fullHash = state.url;
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

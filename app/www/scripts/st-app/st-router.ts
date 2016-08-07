import * as ko from "knockout";
import { Route } from "./st-route";
import * as cr from "crossroads";

var Historyjs : Historyjs = <any> History;
var crossroads = cr;

class Router {
    currentRoute: KnockoutObservable<Route> = ko.observable<Route>();
    routes: KnockoutObservableArray<Route> = ko.observableArray<Route>([]);

    constructor() {
        $(document).on('click', 'a', this.handleAnchorClick);
        this.activateCrossroads();
    }

    public static newRouteFactory = (routePath: string, pageComponent: string, router: Router, title?: string, roles? : Array<string>) => {
        let newRoute = new Route(routePath, title, pageComponent, router, roles);
        newRoute.router = router;
        newRoute.title(title);
        return newRoute;
    }

    public registerRoute = (newRoute: Route) => {
        this.routes.push(newRoute);

        crossroads.addRoute(newRoute.path(), () => {
            let selectedRoute = ko.utils.arrayFirst<Route>(this.routes(), r=>r.path()==newRoute.path());
            $.get( "/api/accounts/login", ( data ) => {
                if(data.user!=null)
                {
                    selectedRoute.userName(data.user.username);
                    selectedRoute.userId(data.user._id);
                }
                console.log( data );
                if(selectedRoute!=null)
                {
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

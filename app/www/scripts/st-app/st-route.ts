import * as ko from "knockout";
import {Router} from "./st-router";

class Route {
    path : KnockoutObservable<string> = ko.observable<string>();
    title : KnockoutObservable<string> = ko.observable<string>("");
    roles : KnockoutObservableArray<string> = ko.observableArray<string>([]);
    pageComponent: KnockoutObservable<string> = ko.observable<string>();
    router: Router = null;

    constructor(newPath: string, newPageComponent: string, router: Router, newRoles?: Array<string>) {
        this.path(newPath);
        this.pageComponent(newPageComponent);
        this.router = router;
        newRoles = newRoles || [];
        ko.utils.arrayPushAll<string>(this.roles, newRoles);
    }
}

export { Route } ;

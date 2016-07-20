import * as ko from "knockout";

class Route {
    path: KnockoutObservable<string> = ko.observable<string>();
    roles? : KnockoutObservableArray<string> = ko.observableArray<string>([]);
    pageComponent: KnockoutObservable<string> = ko.observable<string>();

    constructor(newPath: string, newPageComponent: string, newRoles?: Array<string>)
    {
        this.path(newPath);
        this.pageComponent(newPageComponent);
        newRoles = newRoles || [];
        ko.utils.arrayPushAll<string>(this.roles, newRoles);
    }
}

export { Route } ;

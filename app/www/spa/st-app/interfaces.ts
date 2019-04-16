interface Document
{
    app: SilkThread;
}

interface SilkThread {
    startUp : () => void;
    registerRoute : (newRoute: Route) => void;
    registerComponent : (name: string, location: string) => void;
    registerMenu : (text: string, url: string, menuCssClass: string, menuHrefClass: string, authenticated: boolean, roles: Array<string> ) => void;
}


interface Route {
    path : KnockoutObservable<string> ;
    title : KnockoutObservable<string> ;
    pageComponent: KnockoutObservable<string> ;
    roles : KnockoutObservableArray<string> ;
    userName: KnockoutObservable<string>;
    userId: KnockoutObservable<string>;
    crRoute: KnockoutObservable<any>;
    leftMenuItems: KnockoutObservableArray<MenuItem>;
    rightMenuItems: KnockoutObservableArray<MenuItem>;
}

interface Router {
    
}
interface MenuItem {
    text: KnockoutObservable<string>;
    href: KnockoutObservable<string> ;
    css: KnockoutObservable<string> ;
    styles: KnockoutObservable<string> ;
    isVisible: KnockoutObservable<boolean> ;
    hrefCss: KnockoutObservable<string> ;
    needsAuthentication: KnockoutObservable<boolean> ;
    authorizedForRoles: KnockoutObservableArray<string>;
}

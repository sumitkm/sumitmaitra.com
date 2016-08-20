import * as ko from "knockout";

export class TabItem{
    text: KnockoutObservable<string> = ko.observable<string>("");
    href: KnockoutObservable<string> = ko.observable<string>("");
    css: KnockoutObservable<string> = ko.observable<string>("tab-nav");
    styles: KnockoutObservable<string> = ko.observable<string>("");
    isVisible: KnockoutObservable<boolean>;
    active: KnockoutObservable<boolean> = ko.observable<boolean>(false);
    hrefCss: KnockoutObservable<string> = ko.observable<string>("");

    public static factory = (text: string, href?: string, css?: string, hrefCss: string = "", isActive: boolean = false) : TabItem =>{
        let newMenuItem = new TabItem();
        newMenuItem.text(text);
        newMenuItem.href(href);
        newMenuItem.css(css);
        newMenuItem.hrefCss(hrefCss);
        newMenuItem.active(isActive);
        return newMenuItem;
    }
}

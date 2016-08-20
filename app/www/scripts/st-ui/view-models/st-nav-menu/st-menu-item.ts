import * as ko from "knockout";

export class MenuItem{
    text: KnockoutObservable<string> = ko.observable<string>("");
    href: KnockoutObservable<string> = ko.observable<string>("");
    css: KnockoutObservable<string> = ko.observable<string>("");
    styles: KnockoutObservable<string> = ko.observable<string>("");
    isVisible: KnockoutObservable<boolean>;
    hrefCss: KnockoutObservable<string> = ko.observable<string>("");

    public static factory = (text: string, href: string, css: string, hrefCss: string) : MenuItem =>{
        let newMenuItem = new MenuItem();
        newMenuItem.text(text);
        newMenuItem.href(href);
        newMenuItem.css(css);
        newMenuItem.hrefCss(hrefCss);
        return newMenuItem;
    }
}

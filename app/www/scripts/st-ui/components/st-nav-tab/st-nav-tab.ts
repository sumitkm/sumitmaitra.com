/// <amd-dependency path="text!./st-nav-tab.html"/>
import * as ko from "knockout";
import { BaseComponent } from "../st-base-component/base-component";
import { TabItem } from "../../view-models/st-nav-tab/st-tab-item";

export var template = require("text!./st-nav-tab.html");

export class viewModel extends BaseComponent{

    userName: KnockoutObservable<string> = ko.observable<string>("");
    loggedIn: KnockoutComputed<boolean> = ko.pureComputed<boolean>(() => {
        return this.userName() !== null && this.userName()!= '';
    });

    tabItems: KnockoutObservable<TabItem> = ko.observable<TabItem>();

    constructor(params){
        super(params);
        this.id(params.id || "st-nav-menu");
        if(params.userName && params.userName())
        {
            this.userName(params.userName());
        }
        if(params.tabItems != null){
            this.tabItems = params.tabItems;
        }
    }
}

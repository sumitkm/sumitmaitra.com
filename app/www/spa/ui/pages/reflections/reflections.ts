/// <amd-dependency path="text!./reflections.html" />

import * as ko from "knockout";
import { BaseComponent } from "../../../st-ui/components/st-base-component/base-component";
import { HttpBase } from "../../../st-services/base/http-base";

export var template = require("text!./reflections.html");

export class viewModel extends BaseComponent{
    title: KnockoutObservable<string> = ko.observable<string>("");
    body: KnockoutObservable<string> = ko.observable<string>("");
    feedItems: KnockoutObservableArray<any> = ko.observableArray<any>([]);
    getFeeditemsService: HttpBase;
    saveFeeditemsService: HttpBase;

    constructor(params){
        super(params);
        this.initServices();
        this.loadFeed();
    }


    initServices = () => {
        this.getFeeditemsService = new HttpBase("GET", "/api/feed", this.feedLoaded, this.feedNotLoaded);
        this.saveFeeditemsService = new HttpBase("POST", "/api/feed", this.feedItemSaved, this.feedItemNotSaved);
    }

    loadFeed = () => {
        this.getFeeditemsService.execute({});
    }

    saveFeedItem = () => {
        this.saveFeeditemsService.execute({ title: this.title(), body: this.body() })
    }

    feedItemSaved = (data) => {

    }

    feedItemNotSaved = (error) => {

    }

    feedLoaded = (data) => {
        console.log(this.feedItems().length);
        
        console.log("feedLoaded: " + JSON.stringify(data, null, 1));
        ko.utils.arrayPushAll(this.feedItems, data);
        console.log(this.feedItems().length);
    }

    feedNotLoaded = (data) => {

    }

}

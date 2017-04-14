/// <amd-dependency path="text!./reflections.html" />

import * as ko from "knockout";
import * as amplify from "amplify";
import { BaseComponent } from "../../../st-ui/components/st-base-component/base-component";
import { HttpBase } from "../../../st-services/base/http-base";
import { FeedListEvents } from "../../../st-ui/components/st-feed-list/st-feed-list-events";
export var template = require("text!./reflections.html");

export class viewModel extends BaseComponent{
    title: KnockoutObservable<string> = ko.observable<string>("");
    body: KnockoutObservable<string> = ko.observable<string>("");
    feedItems: KnockoutObservableArray<any> = ko.observableArray<any>([]);
    getFeeditemsService: HttpBase;
    saveFeeditemsService: HttpBase;
    deleteFeedItemService: HttpBase;

    constructor(params){
        super(params);
        amplify.subscribe(FeedListEvents.DeleteFeedItem, this, this.deleteFeedItem);
        this.initServices();
        this.loadFeed();

    }


    initServices = () => {
        this.getFeeditemsService = new HttpBase("GET", "/api/feed", this.feedLoaded, this.feedNotLoaded);
        this.saveFeeditemsService = new HttpBase("POST", "/api/feed", this.feedItemSaved, this.feedItemNotSaved);
        this.deleteFeedItemService = new HttpBase("DELETE", "/api/feed", this.feedItemDeleted, this.feedItemNotDeleted)
    }

    loadFeed = () => {
        this.getFeeditemsService.execute({});
    }

    saveFeedItem = () => {
        this.saveFeeditemsService.execute({ title: this.title(), body: this.body() })
    }

    feedItemSaved = (data) => {
        console.log("Feeditem saved");
    }

    feedItemNotSaved = (error) => {
        console.log("Feeditem not saved");
    }

    feedLoaded = (data) => {
        console.log(this.feedItems().length);

        console.log("feedLoaded: " + JSON.stringify(data, null, 1));
        ko.utils.arrayPushAll(this.feedItems, data);
        console.log(this.feedItems().length);
    }

    feedNotLoaded = (data) => {
        console.log("Feed not loaded");
    }

    feedItemDeleted = (data) => {
        console.log("Feed item deleted");

    }

    feedItemNotDeleted = (data) => {
        console.log("Feed item not deleted");
    }

    deleteFeedItem = (item) => {
        console.log(JSON.stringify(ko.toJS(item)));
        this.deleteFeedItemService.execute( ko.toJS(item));
    }
}

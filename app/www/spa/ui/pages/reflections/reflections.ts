/// <amd-dependency path="text!./reflections.html" />

import * as ko from "knockout";
import * as amplify from "amplify";
import { BaseComponent } from "../../../st-ui/components/st-base-component/base-component";
import { HttpBase } from "../../../st-services/base/http-base";
import { FeedListEvents } from "../../../st-ui/components/st-feed-list/st-feed-list-events";
import { Notifications } from "../../../st-app/st-notifications";

export var template = require("text!./reflections.html");

export class viewModel extends BaseComponent{
    title: KnockoutObservable<string> = ko.observable<string>("");
    body: KnockoutObservable<string> = ko.observable<string>("");
    feedItems: KnockoutObservableArray<any> = ko.observableArray<any>([]);
    getFeeditemsService: HttpBase;
    saveFeeditemsService: HttpBase;
    deleteFeedItemService: HttpBase;
    selectedItem : KnockoutObservable<any> = ko.observable<any>();

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
        Notifications.showSuccessToast("Success", "You posted successfully!");
        this.title("");
        this.body("");
        this.feedItems.unshift(data);
    }

    feedItemNotSaved = (error) => {
        console.log("Feeditem not saved");
        Notifications.showErrorToast("Error", "Failed to save your reflection. <br />Error: " + error.message);
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
        Notifications.showSuccessToast("Success", "Your post was deleted successfully");
        this.feedItems.remove(item => item._id == this.selectedItem()._id );
    }

    feedItemNotDeleted = (error) => {
        Notifications.showErrorToast("Error", "Failed to delete reflection. <br />Error: " + error.message);
    }

    deleteFeedItem = (item) => {
        console.log(JSON.stringify(ko.toJS(item)));
        this.selectedItem(item);
        this.deleteFeedItemService.execute( ko.toJS(item));
    }
}

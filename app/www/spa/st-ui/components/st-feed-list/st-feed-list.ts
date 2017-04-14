import "text!./st-feed-list.html";
import * as ko from "knockout";
import * as amplify from "amplify";
import { FeedListEvents } from "./st-feed-list-events";

export var template = require("text!./st-feed-list.html");
export class viewModel {
    recents: KnockoutObservableArray<any> = ko.observableArray<any>([]);
    past: KnockoutObservableArray<any> = ko.observableArray<any>([]);
    beginning: KnockoutObservableArray<any> = ko.observableArray<any>([]);

    dataSource: KnockoutObservableArray<any>;
    subscriptions = [];

    constructor(params) {
        console.log("List:" + params.feedItems());
        if (params.feedItems != null) {
            this.dataSource = params.feedItems;
            this.subscriptions.push(this.dataSource.subscribe((newValues) => {
                console.log("Data source changed: " + JSON.stringify(newValues, null, 1));
                ko.utils.arrayPushAll(this.recents, newValues);

            }));
            ko.utils.arrayPushAll(this.recents, params.feedItems());
        }
    }

    deleteClick = (item: any, event: Event) => {
        amplify.publish(FeedListEvents.DeleteFeedItem, item);
    }

    dispose() {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].dispose();
        }
    }
}

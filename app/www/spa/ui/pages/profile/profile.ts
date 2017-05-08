import "text!./profile.html";
import * as ko from "knockout";
import { BaseComponent } from "../../../st-ui/components/st-base-component/base-component";
import { TabItem } from "../../../st-ui/view-models/st-nav-tab/st-tab-item";
import { TabStrip } from "../../../st-ui/view-models/st-nav-tab/st-tab-strip";
import { Route } from "../../../st-app/st-route";

export var template = require("text!./profile.html");

export class viewModel extends BaseComponent {
    userName: KnockoutObservable<string> = ko.observable("");
    tabStrip: KnockoutObservable<TabStrip> = ko.observable<TabStrip>(new TabStrip());
    selectedTab: KnockoutObservable<string> = ko.observable<string>("profile-editor");


    constructor(params: Route) {
        super(params);
        this.id((params && params.pageComponent()) || "profile");
        if (params.userName() != null && params.userName() != '') {
            this.userName(params.userName());
        }
        if (params.crRoute().tab != null) {
            this.selectedTab(params.crRoute().tab);
        }
        else{
            this.selectedTab("profile-editor");
        }
        this.tabStrip().tabItems().push(TabItem.factory("Profile", "profile-editor", "/profile", "tab-nav", "", "profile-editor"));
        this.tabStrip().tabItems().push(TabItem.factory("Invites", "invitations", "/profile/invitations", "tab-nav", "", "invitations-list"));
        this.tabStrip().tabItems().push(TabItem.factory("Permissions", "permissions", "/profile/permissions", "tab-nav", "", "permissions-editor"));

        if (this.selectedTab != null) {
            this.tabStrip().selectTabByName(this.selectedTab());
        }


    }


}

/// <amd-dependency path="text!./profile.html" />
import * as ko from "knockout";
import { BaseComponent } from "../../../st-ui/components/st-base-component/base-component";
import { TabItem } from "../../../st-ui/view-models/st-nav-tab/st-tab-item";
import { TabStrip } from "../../../st-ui/view-models/st-nav-tab/st-nav-tab-strip";
import { Route } from "../../../st-app/st-route";
import { HttpBase } from "../../../st-services/base/http-base";
import { Profile } from "../../view-models/profile-vm";

export var template = require("text!./profile.html");
export class viewModel extends BaseComponent {
    userName: KnockoutObservable<string> = ko.observable("");
    tabStrip: KnockoutObservable<TabStrip> = ko.observable<TabStrip>(new TabStrip());
    selectedTab: KnockoutObservable<string> = ko.observable<string>("");
    currentProfile: KnockoutObservable<Profile> = ko.observable<Profile>();
    getProfileService: HttpBase;

    profileLogoUrl = ko.pureComputed(()=>{
        if(this.currentProfile()!=null)
        {
            return "/api/content/" + this.currentProfile().userId() + "/" + this.currentProfile().logoId();
        }
        return "";
    });

    constructor(params: Route) {
        super(params);
        //console.log("profile Constructor");
        this.id((params && params.pageComponent()) || "profile");
        if (params.userName() != null && params.userName() != '') {
            this.userName(params.userName());
        }
        if (params.crRoute().tab != null) {
            this.selectedTab(params.crRoute().tab);
        }
        this.tabStrip().tabItems().push(TabItem.factory("Profile", "home", this.selectedTab().toLowerCase() == '', "/profile", "tab-nav", ""));
        this.tabStrip().tabItems().push(TabItem.factory("Pictures", "pictures", this.selectedTab().toLowerCase() == 'pictures', "/profile/pictures", "tab-nav", ""));
        this.tabStrip().tabItems().push(TabItem.factory("Feed", "feed", this.selectedTab().toLowerCase() == 'feed', "/profile/feed", "tab-nav"));
        this.initServices();
        this.getProfileService.execute();

    }

    initServices = () => {
        this.getProfileService = new HttpBase("GET", "/api/profile", this.profilesLoaded, this.profilesNotLoaded);
    }

    profilesLoaded = (data) => {
        //console.log("Profile Loaded" + JSON.stringify(data));
        this.currentProfile(Profile.fromJS(data));
    }

    profilesNotLoaded = (error) => {
        //console.log("Profile Not Loaded" + JSON.stringify(error));
    }
}

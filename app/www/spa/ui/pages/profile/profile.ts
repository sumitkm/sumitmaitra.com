/// <amd-dependency path="text!./profile.html" />
import * as ko from "knockout";
import { BaseComponent } from "../../../st-ui/components/st-base-component/base-component";
import { TabItem } from "../../../st-ui/view-models/st-nav-tab/st-tab-item";
import { TabStrip } from "../../../st-ui/view-models/st-nav-tab/st-nav-tab-strip";
import { Route } from "../../../st-app/st-route";
import { Notifications } from "../../../st-app/st-notifications";
import { HttpBase } from "../../../st-services/base/http-base";
import { Profile } from "./profile-vm";

export var template = require("text!./profile.html");
export class viewModel extends BaseComponent {
    userName: KnockoutObservable<string> = ko.observable("");
    tabStrip: KnockoutObservable<TabStrip> = ko.observable<TabStrip>(new TabStrip());
    selectedTab: KnockoutObservable<string> = ko.observable<string>("home");
    currentProfile: KnockoutObservable<Profile> = ko.observable<Profile>();
    getProfileService: HttpBase;
    saveProfileService: HttpBase;
    years: KnockoutObservableArray<any> = ko.observableArray<any>([]);
    months: KnockoutObservableArray<any> = ko.observableArray<any>([]);
    profileLogoUrl = ko.pureComputed(() => {
        if (this.currentProfile() != null) {
            return "/api/content/" + this.currentProfile().userId() + "/" + this.currentProfile().logoId();
        }
        return "";
    });

    constructor(params: Route) {
        super(params);
        this.initBirthdaySelector();
        this.id((params && params.pageComponent()) || "profile");
        if (params.userName() != null && params.userName() != '') {
            this.userName(params.userName());
        }
        if (params.crRoute().tab != null) {
            this.selectedTab(params.crRoute().tab);
        }
        this.tabStrip().tabItems().push(TabItem.factory("Profile", "home", "/profile", "tab-nav", ""));
        this.tabStrip().tabItems().push(TabItem.factory("Pictures", "pictures", "/profile/pictures", "tab-nav", ""));
        this.tabStrip().tabItems().push(TabItem.factory("Feed", "feed", "/profile/feed", "tab-nav"));

        if (this.selectedTab != null) {
            this.tabStrip().selectTabByName(this.selectedTab());
        }
        this.initServices();
        this.getProfileService.execute();

    }

    initBirthdaySelector = () => {
      let currentYear = new Date().getFullYear();
      this.years.push({ value: "0", text: "Year" });
      for(let i=0; i < 110; i++) {
        this.years.push({ value: currentYear.toString(), text: currentYear.toString() });
        currentYear--;
      }

      this.months.push( { value: "0", text: "Month" });
      for(let m=0; m < 12; m++) {
        this.months.push({ value: (m+1).toString(), text: (m+1).toString() });
      }
    }

    initServices = () => {
        this.getProfileService = new HttpBase("GET", "/api/profile", this.profilesLoaded, this.profilesNotLoaded);
        this.saveProfileService = new HttpBase("PUT", "/api/profile", this.profileSaved, this.profileNotSaved);
    }

    profilesLoaded = (data) => {
        //console.log("Profile Loaded" + JSON.stringify(data));
        this.currentProfile(Profile.fromJS(data));
    }

    profilesNotLoaded = (error) => {
        //console.log("Profile Not Loaded" + JSON.stringify(error));
    }

    saveProfile = () => {
        console.log(ko.toJS("Current Profile"+ this.currentProfile()));
        this.saveProfileService.execute(ko.toJS(this.currentProfile()));
    }

    profileSaved = (updatedProfile) => {
        Notifications.showSuccessToast("Success", "Updated profile successfully");
        Profile.updateFromJS(this.currentProfile, updatedProfile);

        //console.log("profile saved");
    }

    profileNotSaved = () =>{
        Notifications.showErrorToast("Error", "Failed to update profile successfully");

        console.log("profile not saved");
    }
}

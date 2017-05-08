import "text!./profile-editor.html";
import * as ko from "knockout";
import { BaseComponent } from "../../../st-ui/components/st-base-component/base-component";
import { Profile } from "./profile-vm";
import { HttpBase } from "../../../st-services/base/http-base";
import { Notifications } from "../../../st-app/st-notifications";

export var template = require("text!./profile-editor.html");
export class viewModel extends BaseComponent {

    currentProfile: KnockoutObservable<Profile> = ko.observable<Profile>();
    getProfileService: HttpBase;
    saveProfileService: HttpBase;
    years: KnockoutObservableArray<any> = ko.observableArray<any>([]);
    months: KnockoutObservableArray<any> = ko.observableArray<any>([]);
    tabStrip : KnockoutObservable<any>;

    profileLogoUrl = ko.pureComputed(() => {
        if (this.currentProfile() != null) {
            return "/api/content/" + this.currentProfile().userId() + "/" + this.currentProfile().logoId();
        }
        return "";
    });

    constructor(params: any) {
        super(params);
        this.initBirthdaySelector();
        this.initServices();
        this.getProfileService.execute();
        this.tabStrip = params.tabStrip;
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

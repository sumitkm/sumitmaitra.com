/// <amd-dependency path="text!./profile.html" />
import * as ko from "knockout";
import { BaseComponent } from "../../../st-ui/components/st-base-component/base-component";
import { TabItem } from "../../components/generic/st-nav-tab/st-tab-item";
import { Route } from "../../../st-app/st-route";
import { HttpBase } from "../../../st-services/base/http-base";

export var template = require("text!./profile.html");
export class viewModel extends BaseComponent{
    userName : KnockoutObservable<string> = ko.observable("");
    tabItems : KnockoutObservableArray<TabItem> = ko.observableArray<TabItem>([]);

    getProfileService : HttpBase;

    constructor(params: Route){
        super(params);
        this.id((params && params.pageComponent()) || "profile");
        if(params.userName() != null && params.userName() !='')
        {
            this.userName (params.userName());
        }
        this.tabItems.push(TabItem.factory("Profiles", "/profile", "tab-nav", "", true ));
        this.tabItems.push(TabItem.factory("Pictures", "/profile/" + this.userName() + "/pictures", "tab-nav", "" ));
        this.tabItems.push(TabItem.factory("Feed", "/profile", "tab-nav"));
        this.initServices();
    }

    initServices = () =>{
        this.getProfileService = new HttpBase("GET", "/api/profiles/services", this.profilesLoaded, this.profilesNotLoaded);
    }

    profilesLoaded = (data) => {

    }

    profilesNotLoaded = (error) =>{
        
    }
}

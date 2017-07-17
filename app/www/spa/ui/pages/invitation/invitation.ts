import * as ko from "knockout";
import { Route } from "../../../st-app/st-route";
import { HttpBase } from "../../../st-services/base/http-base";
import { BaseComponent } from "../../../st-ui/components/st-base-component/base-component";

import "text!./invitation.html";
export var template = require("text!./invitation.html");
export class viewModel extends BaseComponent
{
    invitationId: KnockoutObservable<string> = ko.observable<string>("");

    updateInvitationQuery: HttpBase;

    constructor(params: Route){
        super(params);
        this.id(params.pageComponent());
        this.invitationId(params.crRoute().invitationid);

        this.initQueries();
        this.loadData();
        console.log("invitation constructor:" + this.invitationId());
    }

    private initQueries = () => {
        this.updateInvitationQuery = new HttpBase("PUT", "/api/invitation/update", this.invitationUpdated, this.invitationUpdateFailed);
    }

    private loadData =() => {
        this.updateInvitationQuery.getPromise({ id: this.invitationId(), status: 2 })
        .then((data)=>{
                console.log(JSON.stringify(data));
        })
        .catch((error)=>{

        });
    }
    private invitationUpdated = (data: any) => {

    }

    private invitationUpdateFailed = (data: any) => {

    }
}

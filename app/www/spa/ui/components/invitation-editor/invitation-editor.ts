import "text!./invitation-editor.html";
import * as ko from "knockout";

import { HttpBase } from "../../../st-services/base/http-base";
import { Invitation } from "../../view-models/invitation";
export var template=require("text!./invitation-editor.html");

export class viewModel{
    postInvitationQuery: HttpBase;
    currentInvite : KnockoutObservable<Invitation> = ko.observable<Invitation>(new Invitation());

    constructor(params) {
        this.initServices();
    }

    private sendInvitation = () =>{
        this.postInvitationQuery.execute(ko.toJS(this.currentInvite))
    }

    private initServices = () => {
        this.postInvitationQuery = new HttpBase("POST", "/api/invitations/new", this.invitationSent, this.invitationNotSent);
    }

    private invitationSent = (data: any) => {
    }

    private invitationNotSent = (error) => {

    }

}

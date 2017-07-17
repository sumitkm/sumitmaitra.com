import "text!./invitation-editor.html";
import * as ko from "knockout";
import * as amplify from "amplify";
import { HttpBase } from "../../../st-services/base/http-base";
import { Invitation } from "../../view-models/invitation";
import { Notifications} from "../../../st-app/st-notifications";

export var template=require("text!./invitation-editor.html");

export class viewModel{
    postInvitationQuery: HttpBase;
    currentInvite : KnockoutObservable<Invitation> = ko.observable<Invitation>(new Invitation());

    constructor(params) {
        this.initServices();
    }

    private initServices = () => {
        this.postInvitationQuery = new HttpBase("POST", "/api/invitation/new", this.invitationSent, this.invitationNotSent);
    }

    private sendInvitation = () =>{
        this.postInvitationQuery.execute(ko.toJS(this.currentInvite));
    }


    private invitationSent = (data: any) => {
        Notifications.showSuccessToast("Success", "Invite sent successfully");
        amplify.publish("Invitation.New.Success", data);
    }

    private invitationNotSent = (error) => {
        Notifications.showErrorToast("Error", "Error sending invite. Message from server: " + error.message);
        amplify.publish("Invitation.New.Error", error);
    }

}

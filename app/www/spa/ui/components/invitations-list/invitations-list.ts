import "text!./invitations-list.html";
import * as ko from "knockout";
import * as amplify from "amplify";
import { ModalConfig } from "../../../st-ui/view-models/st-modal/st-modal-config";
export var template = require("text!./invitations-list.html");

export class viewModel{
    childComponent: KnockoutObservable<string> = ko.observable<string>("");
    childComponentParams: KnockoutObservable<any> = ko.observable<any>();
    modalConfig : KnockoutObservable<ModalConfig> = ko.observable<ModalConfig>(new ModalConfig());

    constructor(params){
        this.childComponent("invitation-editor");
        this.childComponentParams();
        this.modalConfig().headerText("Invite a friend");
        this.modalConfig().isVisible(false);
        this.modalConfig().showClose(true);
        this.modalConfig().showFooter(false);

        amplify.subscribe("Invitation.New.Success", this, this.newInviteSent);
        amplify.subscribe("Invitation.New.Error", this, this.newInviteSendError);
    }

    showModal = (event) => {
        this.modalConfig().isVisible(true);
    }

    private newInviteSent = (data) => {
        this.modalConfig().isVisible(false);
    }

    private newInviteSendError = (error) => {
        this.modalConfig().isVisible(false);
    }

    dispose(){
        amplify.unsubscribe("Invitation.New.Success", this.newInviteSent);
        amplify.unsubscribe("Invitation.New.Error", this.newInviteSendError);
    }
}

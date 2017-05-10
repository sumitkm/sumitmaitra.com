import "text!./invitations-list.html";
import * as ko from "knockout";
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
    }

    showModal = (event) => {
        this.modalConfig().isVisible(true);
    }
}

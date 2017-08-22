import "text!./login.html";
import * as ko from "knockout";
import { BaseComponent } from "../../../st-ui/components/st-base-component/base-component";

export var template = require("text!./login.html");
export class viewModel extends BaseComponent{
    tab : KnockoutObservable<string> = ko.observable("");

    constructor(params: Route){
        super(params);
        this.id((params && params.pageComponent()) || "login");
        this.tab((params && params.pageComponent()) || "login");
    }
}

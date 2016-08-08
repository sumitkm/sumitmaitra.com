/// <amd-dependency path="text!./verify.html" />
import * as ko from "knockout";
import { baseViewModel } from "../../components/generic/base/base-model";
import { Route } from "../../../st-app/st-route";

export var template = require("text!./verify.html");
export class viewModel extends baseViewModel{
    tab : KnockoutObservable<string> = ko.observable("");
    constructor(params: Route){
        super(params);
        this.id((params && params.pageComponent()) || "verify");
    }
}

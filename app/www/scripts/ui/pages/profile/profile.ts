/// <amd-dependency path="text!./profile.html" />
import * as ko from "knockout";
import { baseViewModel } from "../../components/generic/base/base-model";
import { Route } from "../../../st-app/st-route";

export var template = require("text!./profile.html");
export class viewModel extends baseViewModel{
    userName : KnockoutObservable<string> = ko.observable("");
    constructor(params: Route){
        super(params);
        this.id((params && params.pageComponent()) || "profile");
        if(params.userName() != null && params.userName() !='')
        {
            this.userName (params.userName());
        }
    }
}

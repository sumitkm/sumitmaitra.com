/// <amd-dependency path="text!./st-nav-menu.html"/>
import * as ko from "knockout";

import { baseViewModel } from "../base/base-model";

export var template = require("text!./st-nav-menu.html");
export class viewModel extends baseViewModel{
    userName: KnockoutObservable<string> = ko.observable<string>("");

    loggedIn: KnockoutComputed<boolean> = ko.pureComputed<boolean>(() => {
        return this.userName() !== null && this.userName()!= '';
    });

    constructor(params){
        super(params);
        this.id(params.id || "st-nav-menu");
        if(params.userName && params.userName())
        {
            this.userName(params.userName());
        }
    }
}

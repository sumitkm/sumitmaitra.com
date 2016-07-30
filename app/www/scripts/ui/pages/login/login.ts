/// <amd-dependency path="text!./login.html" />

import { baseViewModel } from "../../components/generic/base/base-model";

export var template = require("text!./login.html");
export class viewModel extends baseViewModel{
    constructor(params: any){
        super(params);
        this.id((params && params.id) || "login");

    }
}

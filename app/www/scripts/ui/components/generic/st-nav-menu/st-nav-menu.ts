/// <amd-dependency path="text!./st-nav-menu.html"/>
import { baseViewModel } from "../base/base-model";

export var template = require("text!./st-nav-menu.html");
export class viewModel extends baseViewModel{
    constructor(params){
        super(params);
        this.id(params.id || "st-nav-menu");
        $.get( "/api/accounts/login", ( data ) => {

          console.log( data );
        });
    }
}

/// <amd-dependency path="text!./verify.html" />
import * as ko from "knockout";
import { baseViewModel } from "../../components/generic/base/base-model";
import { Route } from "../../../st-app/st-route";

export var template = require("text!./verify.html");
export class viewModel extends baseViewModel{
    tab : KnockoutObservable<string> = ko.observable("");
    userName: KnockoutObservable<string> = ko.observable("");
    verificationCode: KnockoutObservable<string> = ko.observable("");
    loading: KnockoutObservable<boolean> = ko.observable<boolean>(true);
    message: KnockoutObservable<string> = ko.observable("");
    hasError: KnockoutObservable<boolean> = ko.observable(false);

    constructor(params: Route){
        super(params);
        this.id((params && params.pageComponent()) || "verify");
        if(params!=null && params.crRoute().verificationCode !=null){
            this.verificationCode(params.crRoute().verificationCode);
        }
        this.verifyAccount();
    }

    resendVerification = () => {
        this.loading(true);
        $.post("/api/accounts/verifyresend", (data)=>{
            this.loading(false);
            this.message(data.message);
            

            if(data.username != ''){
                this.userName(data.username);
            }
        });
    }

    verifyAccount = () => {
        $.post("/api/accounts/verify", { username: this.userName, verificationcode: this.verificationCode() }, (data)=>{
            this.loading(false);
            console.log(JSON.stringify(data));
            if(data.error == null){
                this.hasError(false);
                this.message(data.message);
            }else{
                this.hasError(true);
                this.message(data.message + "<br />" + data.error.error);
            }
        });
    }
}

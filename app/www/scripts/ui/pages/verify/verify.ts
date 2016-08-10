/// <amd-dependency path="text!./verify.html" />
import * as ko from "knockout";
import { baseViewModel } from "../../components/generic/base/base-model";
import { Route } from "../../../st-app/st-route";

export var template = require("text!./verify.html");
export class viewModel extends baseViewModel{

    tab : KnockoutObservable<string> = ko.observable("");
    verificationCode: KnockoutObservable<string> = ko.observable("");
    userName: KnockoutObservable<string> = ko.observable("");

    constructor(params: Route){
        super(params);
        this.id((params && params.pageComponent()) || "verify");
        if(params!=null && params.crRoute().verificationCode !=null){
            this.verifyAccount(params.crRoute().verificationCode);
        } else{
            $.get("/api/accounts/verify", (data)=>{
                if(data.username != ''){
                    this.userName(data.username);
                }
            });
        }
    }

    resendVerification = () => {
        $.post("/api/accounts/verify", { username: this.userName }, (data)=>{
            if(data.username != ''){
                this.userName(data.username);
            }
        });
    }

    verifyAccount = (verificationCode: string) => {
        $.post("/api/accounts/verify", { username: this.userName, verificationcode: verificationCode }, (data)=>{
            if(data.username != ''){
                this.userName(data.username);
            }
        });
    }
}

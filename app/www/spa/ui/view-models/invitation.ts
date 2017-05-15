import * as ko from "knockout";

export class Invitation{
    name: KnockoutObservable<string> = ko.observable<string>("");
    email: KnockoutObservable<string> = ko.observable<string>("");
    message: KnockoutObservable<string> = ko.observable<string>("");

    public static fromJS = (source : any): Invitation  =>{
        let newInvitation = new Invitation();
        if(source!=null){
            newInvitation.name(source.name);
            newInvitation.email(source.email);
            newInvitation.message(source.message);
        }
        return newInvitation;
    }
}

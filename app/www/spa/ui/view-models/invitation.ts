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

export class Invite {
    inviteName: KnockoutObservable<string> = ko.observable<string>("");
    inviteEmail: KnockoutObservable<string> = ko.observable<string>("");
    inviteMessage: KnockoutObservable<string> = ko.observable<string>("");
    _id: KnockoutObservable<string> = ko.observable<string>("");
    sentDate: KnockoutObservable<Date> = ko.observable<Date>();
    status: KnockoutObservable<number> = ko.observable<number>(0);
    inviteType: KnockoutObservable<InviteType> = ko.observable<InviteType>();

    public static fromJS = (source: any): Invite => {
        let newInvite = new Invite();
        newInvite._id(source._id);
        newInvite.inviteEmail(source.inviteEmail);
        newInvite.inviteMessage(source.inviteMessage);
        newInvite.inviteName(source.inviteName);
        newInvite.sentDate(source.sentDate);
        newInvite.status(source.status);
        newInvite.inviteType(source.inviteType);
        return newInvite;
    }
}

export enum InviteType{

}

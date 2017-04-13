import * as ko from "knockout";

export class Profile {
    _id: KnockoutObservable<string> = ko.observable<string>();
    userId: KnockoutObservable<string> = ko.observable<string>();
    nickname: KnockoutObservable<string> = ko.observable<string>();
    birthdate: KnockoutObservable<Date> = ko.observable<Date>();
    birthYear: KnockoutObservable<string> = ko.observable<string>();
    birthMonth: KnockoutObservable<string> = ko.observable<string>();
    birthDay: KnockoutObservable<string> = ko.observable<string>();
    fullname: KnockoutObservable<string> = ko.observable<string>();
    logoUrl: KnockoutObservable<string> = ko.observable<string>();
    logoId: KnockoutObservable<string> = ko.observable<string>();
    headerUrl: KnockoutObservable<string> = ko.observable<string>();
    headerId: KnockoutObservable<string> = ko.observable<string>();
    containerId: KnockoutObservable<string> = ko.observable<string>();

    public static fromJS = (inData) => {
        let newProfile = new Profile();
        if (inData != null) {
            newProfile._id(inData._id);
            newProfile.userId(inData.userId);
            newProfile.nickname(inData.nickname);
            newProfile.birthdate(new Date(inData.birthdate));
            newProfile.fullname(inData.fullname);
            newProfile.logoUrl(inData.logoUrl);
            newProfile.logoId(inData.logoId);
            newProfile.headerUrl(inData.headerUrl);
            newProfile.headerId(inData.headerId);
            newProfile.containerId(inData.containerId);
            newProfile.birthDay(inData.birthDay);
            newProfile.birthYear(inData.birthYear);
            newProfile.birthMonth(inData.birthMonth);
        }
        return newProfile;
    }
}

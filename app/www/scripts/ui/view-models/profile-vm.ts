import * as ko from "knockout";

export class Profile {
    id: KnockoutObservable<string> = ko.observable<string>();
    logoId: KnockoutObservable<string> = ko.observable<string>();
}

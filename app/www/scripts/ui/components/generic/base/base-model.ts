import * as ko from "knockout";
export class baseViewModel {
    id: KnockoutObservable<string> = ko.observable<string>("");
    constructor(params){
    }
}

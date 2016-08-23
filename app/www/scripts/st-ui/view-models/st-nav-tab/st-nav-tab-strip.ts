import * as ko from "knockout";
import { TabItem } from "./st-tab-item";
export class TabStrip{
    tabItems: KnockoutObservableArray<TabItem> = ko.observableArray<TabItem>([]);
    selectedTabItem: KnockoutObservable<TabItem> = ko.observable<TabItem>();

    constructor() {
    }

    selectTabByName = (tabName : string) => {
        let selectedTab = ko.utils.arrayFirst<TabItem>(this.tabItems(), t => t.text() == tabName);
        if(selectedTab !=null){
            this.selectedTabItem(selectedTab);
        }
    }
}

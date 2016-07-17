/// <reference path="../../typings/index.d.ts"/>

import * as ko from "knockout";
export class SilkthreadConfig {

  constructor() {
    this.registerComponents();
    ko.applyBindings();
  }

  public registerComponents() {
    this.registerComponent("home-page", "pages/home-page/home-page")
    this.registerComponent("print-preview", "components/print-preview/print-preview");
    this.registerComponent("st-nav-menu", "scripts/ui/components/generic/st-nav-menu/st-nav-menu");

  }

  public registerComponent(name: string, location: string) {
    ko.components.register(name, { require: location });
  }
}

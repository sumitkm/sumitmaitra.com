import * as express from "express";

import { Configuration } from "../services/settings/config-model";
import { HomeController } from "../api/home-controller";
import { PassportLocalController } from "../api/passport-controller";
import { UploadController } from "../api/upload-controller";
import { ProfileController } from "../api/profile-controller";
import { CrossRouter } from "../services/routing/cross-router";
import { CrossRoute } from "../services/routing/cross-route";

export class Container {
    private static config: Configuration;
    public static router: CrossRouter;

    public static inject = (configuration: Configuration) => {
        Container.config = configuration;
        Container.injectController(new HomeController());
        Container.injectController(new PassportLocalController(Container.config));
        Container.injectController(new UploadController(Container.config));
        Container.injectController(new ProfileController(Container.config));
    }

    private static injectController = (controller: ApiController) => {
        let keys = Object.keys(controller);
        keys.forEach((key: string)=>{
            if(typeof(controller[key]) == "string"){
                console.log("Registered Path:" + controller[key]);
                Container.router.registerRoute(new CrossRoute(controller[key], key.replace(":path", ""), "", controller));
            }
        });
    }
}

import * as express from "express";

import { Configuration } from "../services/settings/config-model";
import { HomeController } from "../api/home-controller";
import { PassportLocalController } from "../api/passport-controller";
import { UploadController } from "../api/upload-controller";
import { ContentController } from "../api/content-controller";
import { ProfileController } from "../api/profile-controller";
import { CrossRouter } from "../services/routing/cross-router";
import { CrossRoute } from "../services/routing/cross-route";

export class Container {
    private static config: Configuration;
    public static apiRouter: CrossRouter;
    public static webRouter: CrossRouter;

    public static inject = (configuration: Configuration) => {
        Container.config = configuration;
        Container.injectWebController(new HomeController());
        Container.injectController(new PassportLocalController(Container.config));
        Container.injectController(new UploadController(Container.config));
        Container.injectController(new ProfileController(Container.config));
        Container.injectController(new ContentController(Container.config));
    }

    private static injectController = (controller: ApiController) => {
        let keys = Object.keys(controller);
        keys.forEach((key: string)=>{
            if(typeof(controller[key]) == "string"){
                Container.apiRouter.registerRoute(new CrossRoute(controller[key], key.replace(":path", ""), "", controller));
            }
        });
    }

    private static injectWebController = (controller: ApiController) => {
        let keys = Object.keys(controller);
        keys.forEach((key: string)=>{
            if(typeof(controller[key]) == "string"){
                //console.log("Registered WWW Path:" + controller[key]);
                Container.webRouter.registerRoute(new CrossRoute(controller[key], key.replace(":path", ""), "", controller));
            }
        });
    }
}

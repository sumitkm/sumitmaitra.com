import * as express from "express";

import { Configuration } from "../services/settings/config-model";
import { BaseController } from "../api/base-controller";

import { PassportLocalAuthenticator } from "../services/passport-local/passport-local-authenticator";

import { HomeController } from "../api/home-controller";
import { PassportLocalController } from "../api/passport-controller";
import { UploadController } from "../api/upload-controller";
import { ContentController } from "../api/content-controller";
import { ProfileController } from "../api/profile-controller";
import { FeedController } from "../api/feed-controller";
import { InvitationController } from "../api/invitation-controller";
import { CrossRouter } from "../services/routing/cross-router";
import { CrossRoute } from "../services/routing/cross-route";

export class Container {
    private static config: Configuration;
    public static apiRouter: CrossRouter;
    public static webRouter: CrossRouter;

    public static inject = (configuration: Configuration, authenticator: PassportLocalAuthenticator, logger: any) => {
        Container.config = configuration;
        Container.injectWebController(new HomeController(Container.config, authenticator, logger));
        Container.injectController(new PassportLocalController(Container.config, authenticator, logger));
        Container.injectController(new UploadController(Container.config, authenticator, logger));
        Container.injectController(new ProfileController(Container.config, authenticator, logger));
        Container.injectController(new ContentController(Container.config, authenticator, logger));
        Container.injectController(new FeedController(Container.config, authenticator, logger));
        Container.injectController(new InvitationController(Container.config, authenticator, logger));
    }

    private static injectController = (controller: BaseController) => {
        let keys = Object.keys(controller);
        keys.forEach((key: string)=>{
            if(typeof(controller[key]) == "string"){
                Container.apiRouter.registerRoute(new CrossRoute(controller[key], key.replace(":path", ""), "", controller));
            }
        });
    }

    private static injectWebController = (controller: BaseController) => {
        let keys = Object.keys(controller);
        keys.forEach((key: string)=>{
            if(typeof(controller[key]) == "string"){
                Container.webRouter.registerRoute(new CrossRoute(controller[key], key.replace(":path", ""), "", controller));
            }
        });
    }
}

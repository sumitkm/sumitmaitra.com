import * as express from "express";
import { HomeController } from "../api/home-controller";
import { CrossRouter } from "../services/routing/cross-router";
import { CrossRoute } from "../services/routing/cross-route";

export class Container {
    public static router: CrossRouter;
    public static inject = () => {
        let homeController = new HomeController();
        Container.injectController(homeController);
    }

    private static injectController = (controller: ApiController) => {
        let keys = Object.keys(controller);
        keys.forEach((key: string)=>{
            if(typeof(controller[key]) == "function"){
                console.log("Registered Path:" + controller[key + ":path"]);
                Container.router.registerRoute(new CrossRoute(controller[key + ":path"], key, "", controller));
            }
        });
    }
}

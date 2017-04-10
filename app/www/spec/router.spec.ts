describe("Expect", () => {
    let testRequire;
    let CONTEXT_NAME = "test";
    beforeEach(()=>{
        let defaultConfig = (<any>requirejs).s.contexts._.config;
        let testConfig = {
            context: CONTEXT_NAME
        };
        for(let key in defaultConfig){
            if(defaultConfig.hasOwnProperty(key)){
                testConfig[key] = defaultConfig[key];
            }
        }
        testConfig.context = CONTEXT_NAME;
        testRequire = requirejs.config(testConfig);
    });

    afterEach(() => {
        testRequire = undefined;
        delete (<any>requirejs).s.contexts[CONTEXT_NAME];
    });

    describe("SPA Router", () => {
        it("is loaded with no routes.", (done) => {
            testRequire(["st-app/st-router"], (router) => {
                var spaRouter = new router.Router();
                expect(spaRouter.routes().length).toEqual(0);
                done();
            });
        });

        it("can initialize new route.", (done) => {
            testRequire(["st-app/st-router"], (router) => {
                var spaRouter = new router.Router();
                let newRoute = router.Router.newRouteFactory("/", "home", null, "Home Page");
                expect(newRoute).toBeDefined();
                expect(newRoute.path()).toEqual("/");
                expect(newRoute.title()).toEqual("Home Page");
                expect(newRoute.pageComponent()).toEqual("home");
                done();
            });
        });

        it("can register new Route.", (done) => {
            testRequire(["st-app/st-router"], (router) => {
                var spaRouter = new router.Router();
                let newRoute = router.Router.newRouteFactory("/", "home", null, "Home Page");
                spaRouter.registerRoute(newRoute);
                expect(spaRouter.routes().length).toEqual(1);
                expect(spaRouter.routes()[0].path()).toEqual("/");
                expect(spaRouter.routes()[0].title()).toEqual("Home Page");
                expect(spaRouter.routes()[0].pageComponent()).toEqual("home");
                done();
            });
        });

        it("can parse /profile/feed", (done) => {
            testRequire(["st-app/st-router"], (router) => {
                var spaRouter = new router.Router();
                let newRoute = router.Router.newRouteFactory("/profile/:tab:/:routeParams*:", "profile", null, "Home Page");
                spaRouter.registerRoute(newRoute);
                spaRouter.parse("https://localhost:3844/profile");
                setTimeout(()=>{
                    var ko = require("knockout");
                    console.log(JSON.stringify(ko.toJS(spaRouter.currentRoute()) ));
                    expect(spaRouter.currentRoute()).not.toBeUndefined();
                    done();
                }, 1000);
            });
        });
    });
});

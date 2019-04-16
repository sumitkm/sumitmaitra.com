requirejs.config(
{
    baseUrl: '/spa',
    paths:
    {
        "jQuery": "/libs/jquery/dist/jquery.min",
        "crossroads": "/libs/crossroads/dist/crossroads",
        "signals": "/libs/js-signals/dist/signals",
        "knockout": "/libs/knockout/dist/knockout",
        "text": "/libs/text/text",
        "historyjs": "/libs/history.js/scripts/bundled/html4+html5/native.history",
        "RSVP": "/libs/rsvp.js/rsvp.min",
        "amplify": "/libs/amplify/lib/amplify.min",
        "toastr":"/libs/toastr/toastr.min"
    },
    shim:
    {
        "jQery": { exports: "$" },
        "amplify": {
            exports: "amplify",
            deps : ["jQuery"]
        },
        "toastr": {
            exports: "toastr",
            deps: ["jQuery"]
        }
    }
});

requirejs(["jQuery", "knockout", "text", "historyjs", "RSVP", "st-app/st-app", "amplify", "st-app/st-router"], ($, ko, text, history, RSVP, app, amplify, router) => {
    document.app = null;
    document.app = new app.silkthread();

    document.app.registerComponent("home", "./ui/pages/home/home");
    document.app.registerComponent("blog", "./ui/pages/blog/blog");
    document.app.registerComponent("media", "./ui/pages/media/blog");
    document.app.registerComponent("login", "./ui/pages/login/login");
    document.app.registerComponent("profile", "./ui/pages/profile/profile");
    document.app.registerComponent("verify", "./ui/pages/verify/verify");
    document.app.registerComponent("register", "./ui/pages/register/register");
    document.app.registerComponent("reflections", "./ui/pages/reflections/reflections");
    document.app.registerComponent("invitation", "./ui/pages/invitation/invitation");
    document.app.registerComponent("print-preview", "./ui/print-preview/print-preview");
    document.app.registerComponent("profile-editor", "./ui/components/profile-editor/profile-editor");
    document.app.registerComponent("invitations-list", "./ui/components/invitations-list/invitations-list");
    document.app.registerComponent("invitation-editor", "./ui/components/invitation-editor/invitation-editor");

    document.app.registerMenu('&#xf015;', '/', 'nav-header nav-menu-item', 'fa', false, []);
    document.app.registerMenu('Blog', '/blog', 'nav-menu-item', '', false, []);
    document.app.registerMenu('Reflection', '/feed', 'nav-menu-item', '', false, []);
    document.app.registerMenu('Media', '/media', 'nav-menu-item', '', false, []);

    document.app.registerRoute(router.Router.newRouteFactory("/blog/:routeParams*:", "blog",  "Blog | The lazy blogger!"));
    document.app.registerRoute(router.Router.newRouteFactory("/login/:routeParams*:", "login",  "Login | The lazy blogger!"));
    document.app.registerRoute(router.Router.newRouteFactory("/profile/:tab:/:routeParams*:", "profile",  "Profile | :tab: | The lazy blogger!"));
    document.app.registerRoute(router.Router.newRouteFactory("/profile/:routeParams*:", "profile",  "Profile | The lazy blogger!"));
    document.app.registerRoute(router.Router.newRouteFactory("/verify/:verificationCode:/:routeParams*:", "verify",  "Verify Account | The lazy blogger!"));
    document.app.registerRoute(router.Router.newRouteFactory("/register/:routeParams*:", "register",  "Register | The lazy blogger!"));
    document.app.registerRoute(router.Router.newRouteFactory("/feed/:routeParams*:", "reflections",  "My Reflections"));
    document.app.registerRoute(router.Router.newRouteFactory("/invitation/:invitationid:", "invitation",  "Invitation | The lazy blogger!"));

    document.app.startUp();

});

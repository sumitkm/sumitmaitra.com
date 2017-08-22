import { silkthread } from "./st-app";
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

requirejs(["jQuery", "knockout", "text", "historyjs", "RSVP", "st-app/st-app", "amplify"], ($, ko, text, history, RSVP, app, amplify) => {
    document.app = null;
    document.app = new app.silkthread();
    document.app.startUp();
    document.app.registerComponent("profile-editor", "./ui/components/profile-editor/profile-editor");
    document.app.registerComponent("invitations-list", "./ui/components/invitations-list/invitations-list");
    document.app.registerComponent("invitation-editor", "./ui/components/invitation-editor/invitation-editor");
});

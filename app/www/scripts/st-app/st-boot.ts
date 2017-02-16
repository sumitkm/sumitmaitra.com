/// <reference path="../../typings/index.d.ts"/>
requirejs.config(
{
    baseUrl: '/scripts/',
    paths:
    {
        "jquery": "../libs/jquery/dist/jquery.min",
        "crossroads": "../libs/crossroads/dist/crossroads",
        "signals": "../libs/js-signals/dist/signals",
        "knockout": "../libs/knockout/dist/knockout",
        "text": "../libs/text/text",
        "historyjs": "../libs/history.js/scripts/bundled/html4+html5/native.history",
        "RSVP": "../libs/rsvp.js/rsvp.min"
    },
    shim:
    {
        "jquery": { exports: "$" }
    }
});

require(["jquery", "knockout", "text", "historyjs", "RSVP", "st-app/st-app"], ($, ko, text, history, RSVP, silkthread) => {
    var spaApp = new silkthread.app();
    spaApp.startUp();
});

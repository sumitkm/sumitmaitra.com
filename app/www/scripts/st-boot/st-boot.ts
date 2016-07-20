
/// <reference path="../../typings/index.d.ts"/>


requirejs.config(
    {
        baseUrl: './',
        paths:
        {
            "jquery": "libs/jquery/dist/jquery.min",
            "crossroads": "libs/crossroads/dist/crossroads",
            "js-signals": "libs/js-signals/dist/signals",
            "knockout": "libs/knockout/dist/knockout",
            "text": "libs/text/text",
            "historyjs": "libs/history.js/scripts/bundled/html4+html5/native.history.js"
        },
        shim:
        {
            "jquery": { exports: "$" }
        }
    });


// Start loading the main app file. Put all of
// your application logic in there.
requirejs([
    "jquery",
    "knockout",
    "text",
    "scripts/st-boot/st-config",
    "historyjs"
], ($, ko, text, config, historyjs) => {
    var spaApp = new config.config();
});

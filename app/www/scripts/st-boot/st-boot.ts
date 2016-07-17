
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
            "text": "libs/text/text"
        },
        shim:
        {
            "jquery": { exports: "$" }
        }
    });


// Start loading the main app file. Put all of
// your application logic in there.
requirejs(["jquery", "knockout", "text", "scripts/st-boot/st-config"], ($, ko, text, config) => {
    var spaApp = new config.SilkthreadConfig();
});

({
    appDir: "./",
    baseUrl: './spa',
    mainConfigFile: "./spa/st-app/st-boot.js",
    dir: '../../build/www/app',
    modules: [
        {
            "name": 'st-app/st-boot',
            "include": [
              'st-ui/components/st-base-component/base-component'
            ]
        },
        {
            //module names are relative to baseUrl/paths config
            name: 'ui/pages/home/home',
            include: [
              'st-ui/components/st-nav-menu/st-nav-menu',
              'st-ui/components/st-nav-tab/st-nav-tab'],
            exclude: [
              'st-app/st-boot',
              'st-ui/components/st-base-component/base-component'
            ]
        },

    ],
    exclude: [ 'libs' ]
})

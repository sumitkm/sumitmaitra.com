# Setup dev environment

```
git clone https://github.com/sumitkm/sumitmaitra.com

cd sumitmaitra.com

chmod +x setup

setup
```

Open ```node_modules/@types/requirejs/index.d.ts```, scroll to the bottom and comment
out the following line to prevent collision with NodeRequire.

```
// declare var require: Require;
```

As a result of this you have to refer to all ```require``` instances as ```requirejs```  
This only affects the Web front-end, code under the www folder.
Currently we refer to ```requirejs``` directly only in ```/www/spa/st-app/boot.ts```

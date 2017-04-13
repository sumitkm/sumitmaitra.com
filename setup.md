# Setup dev environment

```
git clone https://github.com/sumitkm/sumitmaitra.com

cd sumitmaitra.com

chmod +x setup

setup
```

Open ```node_modules/@types/requirejs/index.d.ts```, scroll to the bottom and comment
out the following line to prevent collision with NodeRequire.

As a result of this you have to refer to all require instances as ```requirejs``

```
// declare var require: Require;
```

import { src, dest, parallel } from "gulp";
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');

var connect = require('gulp-connect');

var onError = (err) => {
  //console.log(err.toString());
  this.emit('end');
}

export var connectTask = (done, error) => {
    connect.server({
        livereload: true,
        root: ['./www']
    });
    done();
}

export var htmlTask = (done, error) => {
    src('./**/*.html')
        .pipe(connect.reload());
        done();
}

export var jsTask = (done, error) => {
    src('./**/*.js')
        .pipe(connect.reload());
        done();
}

export var watchTask = (done, error) => {
    watch(['./**/*.html'], ['html']);
    watch(['./**/*.js'], ['js']);
    done();
}

export var dev= parallel(connectTask, watchTask);

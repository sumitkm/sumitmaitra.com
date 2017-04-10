var gulp = require('gulp');
var watch = require('gulp-watch');
var prefix = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');

var connect = require('gulp-connect');

var onError = (err) => {
  //console.log(err.toString());
  this.emit('end');
}

gulp.task('connect', () => {
    connect.server({
        livereload: true,
        root: ['./app/www']
    });
});

gulp.task('html', () => {
    gulp.src('./app/**/*.html')
        .pipe(plumber({
          errorHandler: onError
        }))
        .pipe(connect.reload());
});

gulp.task('js', () => {
    gulp.src('./app/**/*.js')
        .pipe(plumber({
          errorHandler: onError
        }))
        .pipe(connect.reload());
});

gulp.task('watch', () => {
    gulp.watch(['./**/*.html'], ['html']);
    gulp.watch(['./**/*.js'], ['js']);
});

gulp.task('dev', ['connect', 'watch']);

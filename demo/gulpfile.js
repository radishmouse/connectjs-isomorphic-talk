'use strict';


var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
// var del = require('del');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

var paths = {
    js: './static/scripts/components/'
};

gulp.task('js', function () {
    var b = browserify();
    b.transform(reactify);
    b.add([paths.js + '../main.js']);
    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(paths.js + '../'));
});

gulp.task('watch', function () {
    gulp.watch([paths.js + '**/*.js', paths.js + '../main.js'], ['js']);
});

gulp.task('default', ['watch', 'js']);

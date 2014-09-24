'use strict';


var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

var paths = {
    components: './components/',
    app: './components/app.js',
    bundle: './static/scripts/'
};

gulp.task('build', function () {
    var b = browserify();
    b.transform(reactify);
    b.add([paths.app]);
    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(paths.bundle));
});

gulp.task('watch', function () {
    gulp.watch([paths.components + '**/*.js'], ['build']);
});

gulp.task('default', ['watch', 'build']);

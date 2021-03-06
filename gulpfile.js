var gulp = require('gulp');
var zip = require('gulp-zip');
var babel = require('gulp-babel');
var del = require('del');
var install = require('gulp-install');
var runSequence = require('run-sequence');
var awsLambda = require("node-aws-lambda");

var srcDir = './src/**/*.js';
gulp.task('build', function () {
    return gulp.src(srcDir)
        .pipe(babel())
        .pipe(gulp.dest('_src'));
});

gulp.task('watch', function () {
    gulp.watch(srcDir, ['build']);
});

gulp.task('clean', function () {
    return del(['./dist', './dist.zip']);
});

gulp.task('js', function () {
    return gulp.src('_src/*.js')
        .pipe(gulp.dest('dist/'));
});

gulp.task('node-mods', function () {
    return gulp.src('./package.json')
        .pipe(gulp.dest('dist/'))
        .pipe(install({production: true}));
});

gulp.task('zip', function () {
    return gulp.src(['dist/**/*', '!dist/package.json'])
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('upload', function (callback) {
    awsLambda.deploy('./dist.zip', require("./lambda-config.js"), callback);
});

gulp.task('deploy', function (callback) {
    return runSequence(
        ['clean'],
        ['build'],
        ['js', 'node-mods'],
        ['zip'],
        ['upload'],
        callback
    );
});

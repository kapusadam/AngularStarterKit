var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var coffee = require('gulp-coffee');
var es = require('event-stream');
var jeditor = require("gulp-json-editor");
var preprocess = require('gulp-preprocess');
var connect = require('gulp-connect');
var mainBowerFiles = require('main-bower-files');
var ngAnnotate = require('gulp-ng-annotate');
var inject = require('gulp-inject');
var series = require('stream-series');
var jasmine = require('gulp-jasmine');
var reporters = require('jasmine-reporters');

gulp.task('server', function() {
    connect.server({
        livereload: true
    });
});

gulp.task('minify', function() {
    return gulp.src(['vendor/js/angular.js', 'vendor/js/*.js', 'app/**/js/*.js', 'app/**/js/**/*.js'])
        .pipe(ngAnnotate())
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
    return gulp.src(['vendor/js/angular.js', 'vendor/js/*.js', 'app/**/js/*.js', 'app/**/js/**/*.js'])
        .pipe(ngAnnotate())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch(['app/**/js/*.js', 'app/**/js/**/*.js', 'app/*.html', 'app/**/views/**/*.html'], ['index']);
});

gulp.task('watch-test', function() {
    gulp.watch(['test/spec/*.js'], ['jasmine-test']);
});

gulp.task('pcg_mod', function() {
    gulp.src("vars.json")
        .pipe(jeditor({
            'version': '1.2.3'
        }))
        .pipe(gulp.dest(""));
});

gulp.task('html', function() {
    return gulp.src('app/index.html')
        .pipe(preprocess({context: {NODE_ENV: 'production', DEBUG: true}}))//To set environment variables in-line,
        .pipe(gulp.dest('./dist/'))
        .pipe(gulp.dest(''))
});

gulp.task('bower', function() {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest('vendor/js'));
});

gulp.task('index', ['html', 'bower'], function () {
    var angular = gulp.src(['vendor/js/angular.js'], {read: false});
    var vendorStream = gulp.src(['vendor/js/*.js', '!vendor/js/angular.js'], {read: false});
    var appStream = gulp.src(['app//**js/*.js', 'app/**/js/**/*.js'], {read: false});

    return gulp.src('index.html')
        .pipe(inject(series(angular, vendorStream, appStream)))
        .pipe(gulp.dest(''));
});


gulp.task('jasmine-test', function () {
    return gulp.src('test/spec/*.js')
        .pipe(jasmine({
            reporter: new reporters.JUnitXmlReporter()
        }))
        .pipe(jasmine());
});


gulp.task('default', ['index', 'server', 'watch']);

gulp.task('run', ['html', 'minify', 'server']);

gulp.task('test', ['jasmine-test', 'watch-test']);

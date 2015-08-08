var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var es = require('event-stream');
var jeditor = require("gulp-json-editor");
var preprocess = require('gulp-preprocess');
var connect = require('gulp-connect');
var mainBowerFiles = require('main-bower-files');
var ngAnnotate = require('gulp-ng-annotate');
var inject = require('gulp-inject');
var series = require('stream-series');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var reporters = require('jasmine-reporters');
var jasmineBrowser = require('gulp-jasmine-browser');
var watch = require('gulp-watch');
var karma = require('gulp-karma');
var Server = require('karma').Server;

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
    gulp.watch(['app/**/js/*.js', 'app/**/js/**/*.js', 'app/*.html', 'app/**/views/**/*.html'], ['jshint', 'index']);
});

gulp.task('watch-test', function() {
    gulp.watch(['test/spec/*.js'], ['jshint', 'jasmine-test']);
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

gulp.task('jshint', function () {
    return gulp.src(['app/**/**/*.js', 'test/spec/*_spec.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-summary', {
            verbose: true,
            reasonCol: 'cyan,bold'
        }));
});

gulp.task('jasmine-test', function () {
    return gulp.src('test/spec/*.js')
        .pipe(jasmine({
            reporter: new reporters.JUnitXmlReporter()
        }))
        .pipe(jasmine());
});

gulp.task('jasmine', function() {
    var filesForTest = ['app/**/**/*.js', 'test/spec/*_spec.js'];
    return gulp.src(filesForTest)
        .pipe(watch(filesForTest))
        .pipe(jasmineBrowser.specRunner())
        .pipe(jasmineBrowser.server({port: 8888}));
});

gulp.task('karma', function() {
    return gulp.src(['test/spec/*_spec.js'])
        .pipe(karma({
            configFile: __dirname + '/karma.conf.js',
            action: 'watch'
        }))
        .on('error', function(err) {
            throw err;
        });
});

gulp.task('default', ['jshint', 'index', 'server', 'watch']);

gulp.task('run', ['html', 'minify', 'server']);

gulp.task('test', ['jshint', 'jasmine-test', 'watch-test']);

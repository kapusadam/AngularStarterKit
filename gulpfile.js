var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var jeditor = require("gulp-json-editor");
var preprocess = require('gulp-preprocess');
var connect = require('gulp-connect');
var mainBowerFiles = require('main-bower-files');
var ngAnnotate = require('gulp-ng-annotate');
var inject = require('gulp-inject');
var series = require('stream-series');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var jasmine = require('gulp-jasmine');
var reporters = require('jasmine-reporters');
var jasmineBrowser = require('gulp-jasmine-browser');
var watch = require('gulp-watch');
var karma = require('gulp-karma');
var protractor = require("gulp-protractor").protractor;

gulp.task('server', function() {
    connect.server({
        livereload: true
    });
});

gulp.task('minify-js', function() {
    return gulp.src(['vendor/js/angular.js', 'vendor/js/*.js', 'app/**/js/*.js', 'app/**/js/**/*.js'])
        .pipe(ngAnnotate())
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('minify-css', function() {
    return gulp.src(['app/**/css/reset.css', 'app/**/css/**/*.css'])
        .pipe(concat('all.min.css'))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch(['app/**/js/*.js', 'app/**/js/**/*.js', 'app/*.html', 'app/**/views/**/*.html', 'app/**/css/**/*.css'], ['jshint', 'index']);
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
    var appStream = gulp.src(['app/**/js/*.js', 'app/**/js/**/*.js'], {read: false});

    var reset = gulp.src(['app/**/css/reset.css'], {read: false});
    var vendorCss = gulp.src(['vendor/css/*.css'], {read: false});
    var appCss = gulp.src(['app/**/css/*.css', '!app/**/css/reset.css'], {read: false});

    return gulp.src('index.html')
        .pipe(inject(series(reset, vendorCss, appCss, angular, vendorStream, appStream)))
        .pipe(gulp.dest(''));
});

gulp.task('clean-dist', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('jshint', function () {
    return gulp.src(['app/**/**/*.js', 'test/**/*_spec.js'])
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
            configFile: __dirname + '/test/karma.conf.js',
            action: 'watch'
        }))
        .on('error', function(err) {
            throw err;
        });
});

gulp.task('e2e', function() {
    gulp.src(['test/spec-e2e/*_spec.js'])
        .pipe(protractor({
            configFile: "test/protractor.conf.js",
            args: ['--baseUrl', 'http://127.0.0.1:8000']
        }))
        .on('error', function(e) { throw e })
});

gulp.task('default', ['jshint', 'index', 'server', 'watch']);

gulp.task('run', ['html', 'minify-js', 'minify-css', 'server']);

gulp.task('test', ['jshint', 'jasmine-test', 'watch-test']);

gulp.task('test-e2e', ['jshint', 'e2e']);

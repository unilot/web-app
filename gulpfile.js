const config = require('./config');
const gulp = require('gulp');
const pug = require('gulp-pug');
const webserver = require('gulp-express');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const hash = require('gulp-hash-filename');
const minifyCSS = require('gulp-csso');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');

//Config
const srcDir = `${__dirname}/src`;
const assetsDir = `${srcDir}/assets`;
const distDir = `${__dirname}/${config.webroot}`;
const nodeModules = `${__dirname}/node_modules`;
const webServerAppBootstrap = `${__dirname}/index.js`;

const htmlSrc = [
    `${srcDir}/templates/index.pug`
];

const jsSrc = [
    `${assetsDir}/js/fix.js`,
    `${nodeModules}/jquery/dist/jquery.min.js`,
    `${nodeModules}/parallax-js/dist/parallax.min.js`,
    `${nodeModules}/slideout/dist/slideout.min.js`,
    `${nodeModules}/flip-counter/js/flipcounter.js`,
    `${nodeModules}/time-to/jquery.time-to.min.js`,
    `${nodeModules}/jsrender/jsrender.min.js`,
    `${nodeModules}/bootstrap/dist/bootstrap.min.js`,
    `${assetsDir}/js/main.js`,
];

const cssSrc = [
    `${nodeModules}/normalize.css/normalize.css`,
    `${nodeModules}/flexboxgrid/dist/flexboxgrid.min.css`,
    `${assetsDir}/css/counter.css`,
    `${assetsDir}/css/fonts.css`,
    `${assetsDir}/css/styles.css`,
];

const sassSrc = [
];

const fontsSrc = [
    // nodeModules + '/bootstrap/dist/fonts/*',
    `${srcDir}/fonts/*`
];

const imgSrc = [
    `${nodeModules}/flip-counter/img/digits.png`,
    `${assetsDir}/img/*`
];


gulp.task('html', () => {
   return gulp.src(htmlSrc)
       .pipe(pug())
       .pipe(gulp.dest(distDir))
       .pipe(webserver.notify())
});

gulp.task('js:dev', () => {
    return gulp.src(jsSrc)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(`${distDir}/assets/js/`))
        .pipe(webserver.notify())
});

gulp.task('js:prod', () => {
    return gulp.src(jsSrc)
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(hash())
        .pipe(gulp.dest(`${distDir}/assets/js/`))
});

gulp.task('sass', () => {
    return gulp.src(sassSrc)
        .pipe(sass({}).on('error', sass.logError))
        .pipe(concat('sass.css'))
        .pipe(gulp.dest(`${assetsDir}/css/sass`));
});

gulp.task('css:dev', ['sass'], () => {
    return gulp.src(cssSrc)
        .pipe(concat('main.css'))
        .pipe(gulp.dest(`${distDir}/assets/css/`))
        .pipe(webserver.notify())
});

gulp.task('css:prod', ['sass'], () => {
    return gulp.src(cssSrc)
        .pipe(concat('main.min.css'))
        .pipe(minifyCSS())
        .pipe(hash())
        .pipe(gulp.dest(`${distDir}/assets/css/`))
});

gulp.task('fonts', () => {
    return gulp.src(fontsSrc)
        .pipe(gulp.dest(`${distDir}/assets/fonts/`))
});

gulp.task('images', () => {
    return gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(gulp.dest(`${distDir}/assets/img/`))
});

gulp.task('watch', function(){
    gulp.watch(htmlSrc, ['html']);
    gulp.watch(jsSrc, ['js:dev']);
    gulp.watch(cssSrc, ['css:dev']);
    gulp.watch(imgSrc, ['images']);
    gulp.watch(fontsSrc, ['fonts']);
    gulp.watch(sassSrc, ['css:dev']);
});

gulp.task('webserver', () => {
    webserver.run([webServerAppBootstrap]);


});

gulp.task('dev', ['html', 'js:dev', 'css:dev', 'fonts', 'images', 'webserver', 'watch']);
gulp.task('build:dev', ['html', 'js:dev', 'css:dev', 'fonts', 'images']);
gulp.task('build:prod', ['html', '  js:prod', 'css:prod', 'fonts', 'images']);

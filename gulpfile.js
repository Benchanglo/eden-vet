'use strict';

var async = require('async');
var base64 = require('gulp-base64');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var critical = require('critical');
var ejs = require('gulp-ejs');
var fs = require('fs');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var imageminGuetzli = require('imagemin-guetzli');
var inlinesource = require('gulp-inline-source');
var lint = require('gulp-jshint');
var jsonlint = require("gulp-jsonlint");
var less = require('gulp-less');
var minifyCSS = require('gulp-clean-css');
var minifyHTML = require('gulp-minify-html');
var path = require('path');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var pages = [
    'index',
    'service',
    'people',
    'schedule',
    'departments'
];
var jsfiles = ['./src/js/script.js'];
/*
var base64Opts = {
    extensions: ['png', /\.jpg#datauri$/i]
};
*/
var base64Opts = {
    extensions: ['png']
};
var outputPath = '../eden-vet.github.io';
//var outputPath = '../eden-vet.github.io';

gulp.task('clean-img', function () {
    return gulp.src(outputPath + '/images/**/*', {
        read: false
    })
    .pipe(clean({
        force: true
    }));
});

gulp.task('reset-built-img', function () {
    return gulp.src('./src/images/**/*', {
        read: false
    })
    .pipe(clean({
        force: true
    }));
});

gulp.task('copy-png', ['reset-built-img'], function () {
    return gulp.src('./src/images-org/**/*.png')
    .pipe(gulp.dest('./src/images'));
});

gulp.task('images-min', ['copy-png'], function () {
    return gulp.src('./src/images-org/**/*.jpg')
    .pipe(imagemin([imageminGuetzli({quality: 90})]))
    .pipe(gulp.dest('./src/images'));
});

gulp.task('images', ['clean-img'], function () {
    return gulp.src('./src/images/**/*')
    .pipe(gulp.dest(path.join(outputPath, '/images')));
});

// Concat and compress CSS files in src/data/css, and generate build/production.css
gulp.task('less', ['images'], function() {
    var opts = {
        keepBreaks: false,
        compatibility: 'ie8',
        keepSpecialComments: 0
    };

    return gulp.src('./src/less/style.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(concat('production.css'))
    .pipe(base64(base64Opts))
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./src/rendered'));
});

gulp.task('css', ['less'], function () {
    var file = './src/rendered/production.css';

    return gulp.src(file)
    .pipe(gulp.dest(outputPath));
});

// Concat and compress JS files in src/data/javascript, and generate build/production.js
gulp.task('js-dev', ['lint'], function () {
    return gulp.src(jsfiles)
    .pipe(gulp.dest(outputPath));
});

// Concat and compress JS files in src/data/javascript, and generate build/production.js
gulp.task('js', ['lint'], function () {
    var jsfilesToBuild;
    if (jsfiles === [] || typeof jsfiles === 'undefined') {
        jsfilesToBuild = './src/js/script.js';
    } else {
        jsfilesToBuild = jsfiles;
    }
    return gulp.src(jsfilesToBuild)
    .pipe(uglify({mangle: true}))
    .pipe(gulp.dest('./src/rendered'));
});

// Validate src/data JSON files
gulp.task('jsonlint', function () {
    return gulp.src('./src/data/*.json')
    .pipe(jsonlint())
    .pipe(jsonlint.failOnError())
    .pipe(jsonlint.reporter());
});

// Render html using data in src/data against src/templates, and build src/html/index.html
gulp.task('template', ['jsonlint'], function (done) {
    var filepath = path.join(__dirname, './src/data/data-structure.json');
    var options = {
       ignorePartials: true,
       batch : ['./src/templates/partials']
    };
    var templateFiles = [];
    var i;

    for (i = 0; i < pages.length; i += 1) {
        templateFiles.push('./src/templates/' + pages[i] + '.ejs');
    }
    fs.readFile(filepath, {encoding: 'utf-8'}, function (err, D) {
        var data;

        if (err) {
            console.log('error: ', err);
            return;
        }
        data = JSON.parse(D);

        return gulp.src(templateFiles)
        .pipe(ejs(data, options))
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(gulp.dest('./src/rendered'))
        .on('end', done);
    });
});

gulp.task('build-dev', ['template', 'css', 'js-dev'], function () {
    var optsHtml = {
      conditionals: true,
      spare: true
    };
    return gulp.src('./src/rendered/*.html')
//    .pipe(base64(base64Opts))
//    .pipe(inlinesource(optsInline))
    .pipe(minifyHTML(optsHtml))
    .pipe(gulp.dest(outputPath));
});

gulp.task('build', ['template', 'css', 'js'], function () {
    var optsHtml = {
      conditionals: true,
      spare: true
    };
    var criticalParams = {
        base: 'src/rendered',
        src: 'index.html',
        css: 'src/rendered/production.css',
        dimensions: [{
          width: 320,
          height: 480
        },{
          width: 480,
          height: 500
        },{
          width: 739,
          height: 1020
        }],
        dest: 'index.css',
        minify: true,
        extract: false,
        ignore: ['@font-face',/url\(/]
    }
    var optsInline = {
        swallowErrors: true
    };

    async.mapSeries(pages, function (page, callback) {
        console.log('Building critical path for page: ', page);
        criticalParams.src = page + '.html';
        criticalParams.dest = page + '.css';
        critical.generate(criticalParams, function (err, result) {
            return callback(err, result);
        });
    }, function (err, result) {
        if (err) {
            console.log('Building critical path failed: ', err);
        }
        return gulp.src('./src/rendered/*.html')
    //    .pipe(base64(base64Opts))
        .pipe(inlinesource(optsInline))
        .pipe(minifyHTML(optsHtml))
        .pipe(gulp.dest(outputPath));
    })
    /*
    critical.generate(criticalParams, function () {
        return gulp.src('./src/rendered/*.html')
    //    .pipe(base64(base64Opts))
        .pipe(inlinesource(optsInline))
        .pipe(minifyHTML(optsHtml))
        .pipe(gulp.dest(outputPath));
    });
    */

});

// Validate all JS files
gulp.task('lint', ['jsonlint'], function() {
    return gulp.src('./src/js/*.js')
    .pipe(lint())
    .pipe(lint.reporter('default', { verbose: true }));
});
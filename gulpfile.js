'use strict';

var fs = require('fs');
var base64 = require('gulp-base64');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
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
var minifyHTML = require('gulp-htmlmin');
var path = require('path');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var markdown = require('gulp-markdown');
const { convert } = require('html-to-text');

var jsfiles = ['./src/js/script.js'];

var outputPath = './dist';
//var outputPath = '../eden-vet.github.io';

var newsEntries = [];

var calendarFileName = 'cal-' + Date.now() + '.jpg'
var cssFilename = 'prod-' + Date.now() + '.css'

var returnNewsFilelist = function () {
  var files = fs.readdirSync(path.join(__dirname, './news/'));
  return files
}
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

gulp.task('copy-png', function () {
  return gulp.src('./src/images-org/**/*.png')
  .pipe(gulp.dest('./src/images'));
});

// gulp.task('images-min', gulp.series('reset-built-img', 'copy-png'), function () {
//     return gulp.src('./src/images-org/**/*.jpg')
//     .pipe(imagemin([imageminGuetzli({quality: 90})]))
//     .pipe(gulp.dest('./src/images'));
// });

gulp.task('copy-calendar', function () {
  return gulp.src('./calendar.jpg')
  //.pipe(imagemin([imageminGuetzli({quality: 90})]))
  .pipe(rename(calendarFileName))
  .pipe(gulp.dest(path.join(outputPath, '/images')));
});

gulp.task('images', function () {
  return gulp.src('./src/images/**/*')
  .pipe(gulp.dest(path.join(outputPath, '/images')));
});

// Concat and compress CSS files in src/data/css, and generate build/production.css
gulp.task('less', function() {
  var opts = {
    keepBreaks: false,
    keepSpecialComments: 0
  };
  var base64Opts = {
    extensions: ['png']
  };

  return gulp.src('./src/less/style.less')
  .pipe(less({
    paths: [ path.join(__dirname, 'less', 'includes') ]
  }))
  .pipe(concat(cssFilename))
  .pipe(base64(base64Opts))
  .pipe(gulp.dest('./src/rendered'));
});

gulp.task('css', function () {
  var file = './src/rendered/' + cssFilename;
  if (process.env.NODE_ENV === 'production') {
    var opts = {
      keepBreaks: false,
      keepSpecialComments: 0
    };
    return gulp.src(file)
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest(outputPath));
  }
  return gulp.src(file)
  .pipe(gulp.dest(outputPath));
});

// Validate src/data JSON files
gulp.task('jsonlint', function () {
  return gulp.src('./src/data/*.json')
  .pipe(jsonlint())
  .pipe(jsonlint.failOnError())
  .pipe(jsonlint.reporter());
});

// Validate all JS files
gulp.task('lint', function() {
  return gulp.src('./src/js/*.js')
  .pipe(lint())
  .pipe(lint.reporter('default', { verbose: true }));
});

// Concat and compress JS files in src/data/javascript, and generate build/production.js
gulp.task('js', function () {
  if (process.env.NODE_ENV === 'production') {
    var jsfilesToBuild;
    if (jsfiles === [] || typeof jsfiles === 'undefined') {
      jsfilesToBuild = './src/js/script.js';
    } else {
      jsfilesToBuild = jsfiles;
    }
    return gulp.src(jsfilesToBuild)
    .pipe(uglify({mangle: true}))
    .pipe(gulp.dest(outputPath));
  }
  return gulp.src(jsfiles)
  .pipe(gulp.dest(outputPath));
});

gulp.task('markdown', function () {
  return gulp.src('./news/**/*.md')
  .pipe(markdown({ baseUrl: './images/' }))
  .pipe(gulp.dest('./src/tmp'))
})

gulp.task('copy-news-images', function () {
  return gulp.src('./news/*.jpg')
  .pipe(gulp.dest(path.join(outputPath, '/images')));
});

gulp.task('news', function (done) {
  var newsHtml = fs.readdirSync(path.join(__dirname, './src/tmp/')).filter(name => name.includes('.html'));
  newsHtml.forEach((htmlFileName, i) => {
    var filename = 'news-' + htmlFileName
    var filekey = filename.replace('.html', '')
    var template = fs.readFileSync('./src/templates/partials/news-template.ejs', 'utf8')
    var content = fs.readFileSync('./src/tmp/' + htmlFileName, 'utf8')
    var contentForAbstract = content
      .replace(/\<h2.*\/h2>/g, '')
      .replace(/\<h3.*\/h3>/g, '')

    var summary = convert(contentForAbstract)
      .replace(/\n/g, ' ') // 空格
      .replace(/\[.*\]/g, '') // 圖片

    if (summary.length > 30) {
      summary = summary.substring(0, 30) + '...'
    }
    var re = />(.*?)<\/h3>/gi
    var title = content.match(re)
    if (title.length > 0) {
      title = title[0]
    }
    title = title.replace('>', '').replace('</h3>', '')
    var out = template.replace(/FILEPATH/g, '<% include ./' + htmlFileName + ' %>').replace(/FILEKEY/g, filekey)
    fs.writeFileSync('./src/tmp/' + filekey + '.ejs', out, 'utf8')
    newsHtml[i] = 'news-' + htmlFileName
    newsEntries.push({
      title: title,
      summary: summary,
      date: htmlFileName.replace('.html', ''),
      filename: filename,
      filekey: filekey
    })
  })
  done()
})

// Render html using data in src/data against src/templates, and build src/html/index.html
gulp.task('template', function (done) {
  var pages = fs.readdirSync(path.join(__dirname, './src/templates/'));
  var filepath = path.join(__dirname, './src/data/data-structure.json');
  var options = {
    ignorePartials: true,
    batch : ['./src/templates/partials']
  };
  var templateFiles = [];
  var i;
  for (i = 0; i < pages.length; i += 1) {
    if (pages[i].includes('.ejs')) {
      templateFiles.push('./src/templates/' + pages[i]);
    }
  }
  // news
  if (newsEntries.length > 0) {
    for (i = 0; i < newsEntries.length; i += 1) {
      templateFiles.push('./src/tmp/' + newsEntries[i].filekey + '.ejs');
    }
  }
  fs.readFile(filepath, {encoding: 'utf-8'}, function (err, D) {
    var data;

    if (err) {
      console.log('error: ', err);
      return;
    }
    data = JSON.parse(D);
    data.calendar = calendarFileName
    data.news = newsEntries
    return gulp.src(templateFiles)
    .pipe(ejs(data, options))
      .pipe(replace('production.css', cssFilename))

    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('./src/rendered'))
    .on('end', done);
  });
});

gulp.task('finalize', function (done) {
  var optsHtml = (process.env.NODE_ENV === 'production')
    ? {
      caseSensitive: true,
      collapseWhitespace: true,
      keepClosingSlash: true
    }
    : {
      conditionals: true,
      spare: true
    }
  return gulp.src('./src/rendered/*.html')
  .pipe(minifyHTML(optsHtml))
  .pipe(gulp.dest(outputPath))
  .on('end', done);
});

gulp.task('copy-CNAME', function (done) {
  if (process.env.NODE_ENV === 'production') {
    return gulp.src('./src/CNAME')
    .pipe(gulp.dest(outputPath))
    .on('end', done);
  }
  done()
})

gulp.task(
  'build',
  gulp.series(
    'jsonlint',
    'lint',
    'js',
    'markdown',
    'clean-img',
    'copy-news-images',
    'news',
    'template',
    'copy-calendar',
    'images',
    'less',
    'css',
    'finalize',
    'copy-CNAME'
  )
);

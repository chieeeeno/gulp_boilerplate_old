'use strict';
//**************************************
// モジュールインポート
//**************************************
// Gulp本体
const gulp = require('gulp');

// Gulpモジュール
const cache = require('gulp-cached');
const clean = require('gulp-clean');
const csscomb = require('gulp-csscomb');
const convert = require('gulp-convert');
const eslint = require('gulp-eslint');
const ejs = require('gulp-ejs');
const htmlbeautify = require('gulp-html-beautify');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const stripDebug = require('gulp-strip-debug');
const prettierPlugin = require('gulp-prettier-plugin');


// その他モジュール
const browserSync = require('browser-sync');
// const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const notifier = require('node-notifier');
const cssnext = require('postcss-cssnext');
const runSequence = require('run-sequence').use(gulp);

// 設定ファイル
const setting = require('./setting.json');



//**************************************
// 変数の設定
//**************************************
// 入出力パス
const PATHS = setting.path;
// autoprefixerの設定
const AUTOPREFIXER_SETTING = [
  cssnext({
    browsers: setting.autoprefixer.browsers
  })
];
// HTML整形の設定
const BEAUTIFY_OPTION = setting.beautify;
const PRETTIER_CONFIG = setting.prettier;

// サイト設定
const SITE_CONFIG = setting.site_config;



//**************************************
// Gulpタスク定義
//**************************************
// SASSファイルをキャッシュする
gulp.task('sass-cache', () => {
  return gulp.src(`${PATHS.src}**/*.{sass,scss}`, { base: 'src' })
    .pipe(plumber({ errorHandler: notify.onError('<%- error.message %>') }))
    .pipe(cache('sass'));
});


// SASSのコンパイル
gulp.task('sass', () => {
  return gulp.src(`${PATHS.src}**/*.{sass,scss}`)
    .pipe(plumber({ errorHandler: notify.onError('<%- error.message %>') }))
    .pipe(cache('sass'))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss(AUTOPREFIXER_SETTING))
    .pipe(csscomb())
    .pipe(rename((path) => {
      path.dirname += '/../css'; // 出力先をcssフォルダに変更
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(PATHS.src))
    .pipe(browserSync.stream())
    .pipe(notify({
      title: 'Gulp',
      message: 'css task complete'
    }));
});


// jsのlint処理
gulp.task('eslint', () => {
  return gulp.src(`${PATHS.src}**/*.js`)
    .pipe(plumber({ errorHandler: notify.onError('<%- error.message %>') }))
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(plumber.stop());
});

// EJSファイルをキャッシュする
gulp.task('ejs-cache', () => {
  return gulp.src([`${PATHS.src}**/*.ejs`, `!${PATHS.src}**/_*.ejs`])
    .pipe(plumber({ errorHandler: notify.onError('<%- error.message %>') }))
    .pipe(cache('ejs'));
});

// EJSのコンパイル
gulp.task('ejs', () => {
  let jsonData = require('./src/_assets/ejs-json/data.json');
  return gulp.src([`${PATHS.src}**/*.ejs`, `!${PATHS.src}**/_*.ejs`])
    .pipe(cache('ejs'))
    .pipe(plumber({ errorHandler: notify.onError('<%- error.message %>') }))
    .pipe(ejs({
      jsonData:jsonData,
      config:SITE_CONFIG
    }))
    .pipe(htmlbeautify(BEAUTIFY_OPTION))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(PATHS.src))
    .pipe(notify({
      message: 'EJS task complete'
    }));
});

// csv 変換
gulp.task('csv2json', function(){
  gulp.src([`${PATHS.src}**/_assets/csv/*.csv`])
    .pipe(convert({
      from: 'csv',
      to: 'json'
     }))
    .pipe(rename((path) => {
      path.dirname += '/../ejs-json'; // 出力先をejs-jsonフォルダに変更
    }))
    .pipe(gulp.dest(PATHS.src));
});


// コードフォーマット
gulp.task('prettier', () => {
  return gulp.src([`${PATHS.src}**/*.{sass,scss}`,`${PATHS.src}**/*.js`,`!${PATHS.src}**/*.min.js`])
    .pipe(plumber({ errorHandler: notify.onError('<%- error.message %>') }))
    .pipe(prettierPlugin(PRETTIER_CONFIG, { filter: true }))
    .pipe(gulp.dest(file => file.base))
});


// ブラウザをリロード
gulp.task('reload', () => {
  browserSync.reload();
});


// サーバー起動
gulp.task('browser-sync', () => {
  return browserSync({
    port: 3000,
    server: {
      baseDir: PATHS.src
    }
  });
});

// デフォルトタスク
gulp.task('default', [
  'ejs-cache',
  'sass-cache',
  'browser-sync',
  'reload'
], () => {
  gulp.watch([`${PATHS.src}**/*.ejs`,`!${PATHS.src}**/_*.ejs`, '!node_modules'], ['ejs','reload']);
  gulp.watch([`${PATHS.src}**/*.html`, '!node_modules'], ['reload']);
  gulp.watch([`${PATHS.src}**/*.{sass,scss}`, '!node_modules'], ['prettier','sass']);
  gulp.watch([`${PATHS.src}**/*.js`,`!${PATHS.src}**/*.min.js`, '!node_modules'], ['prettier','eslint']);
});



//**************************************
// for build task
//**************************************
// ビルド先のディレクトリのデータを削除する
gulp.task('clean', () => {
  return gulp.src(`${PATHS.dest}/*`, { read: false })
    .pipe(clean());
});

// jsファイルのconsoleなどを削除
gulp.task('build-js', () => {
  return gulp.src(`${PATHS.src}**/*.js`)
    .pipe(plumber())
    .pipe(stripDebug())
    .pipe(replace(/(void 0;|void 0)/g, ''))
    .pipe(gulp.dest(PATHS.dest))
});

// 画像最適化
gulp.task('optimize-img', () => {
  return gulp.src(`${PATHS.src}**/*.{jpg,jpeg,gif,png,svg}`)
    .pipe(plumber())
    .pipe(imagemin([
      pngquant({
        quality: '70-85',
        speed: 1,
        floyd: 0
      }),
      imagemin.jpegtran({
        quality: 85,
        progressive: true
      }),
      // mozjpeg({
      //   quality: 85,
      //   progressive: true
      // }),
      // imagemin.svgo(),
      imagemin.optipng(),
      imagemin.gifsicle()
    ]))
    .pipe(gulp.dest(PATHS.dest));
});

// SASSファイルをコンパイル
gulp.task('build-css', () => {
  return gulp.src(`${PATHS.src}**/*.{sass,scss}`)
    .pipe(plumber({ errorHandler: notify.onError('<%- error.message %>') }))
    // .pipe(prettierPlugin(PRETTIER_CONFIG, { filter: true }))
    .pipe(sass())
    .pipe(postcss(AUTOPREFIXER_SETTING))
    .pipe(csscomb())
    .pipe(rename((path) => {
      path.dirname += '/../css'; // 出力先をcssフォルダに変更
    }))
    .pipe(gulp.dest(PATHS.dest));
});

// HTMLを整形してコピーする
gulp.task('build-html', () => {
  return gulp.src(`${PATHS.src}**/*.html`, { base: 'src' })
    .pipe(htmlbeautify(BEAUTIFY_OPTION))
    .pipe(gulp.dest(PATHS.dest));
});

// Buildタスク実行
gulp.task('build', (callback) => {
  runSequence(
    'clean',
    ['build-css', 'build-js', 'build-html'],
    'optimize-img',
    () => {
      callback();
      notifier.notify({
        title: 'Gulp',
        message: 'Build task complete'
      });
    })
});
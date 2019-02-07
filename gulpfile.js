'use strict';
const { src, dest, watch, series, parallel } = require('gulp');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const postcssGapProperties = require('postcss-gap-properties');
const csscomb = require('gulp-csscomb');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');
const cache = require('gulp-cached');
const postcss = require('gulp-postcss');
const eslint = require('gulp-eslint');
const ejs = require('gulp-ejs');
const htmlbeautify = require('gulp-html-beautify');
const clean = require('gulp-clean');
const stripDebug = require('gulp-strip-debug');

const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const replace = require('gulp-replace');
const cleanCSS = require('gulp-clean-css');
const gulpif = require('gulp-if');
const convert = require('gulp-convert');
const uglify = require('gulp-uglify');

const env = process.env.NODE_ENV;

// 入出力パス
const PATHS = {
  src: './src/',
  dest: './build/',
};

const isProduction = env === 'prod';

/**
 * SASSファイルをキャッシュする
 * @returns {*}
 */
function sassCacheTask() {
  return src(`${PATHS.src}**/*.{sass,scss}`, {
    base: 'src',
  })
    .pipe(
      plumber({
        errorHandler: notify.onError('<%- error.message %>'),
      })
    )
    .pipe(cache('sass'));
}

/**
 * SASSのコンパイルを実行する
 * @returns {*}
 */
function sassCompileTask() {
  const outDir = isProduction ? PATHS.dest : PATHS.src;
  return (
    src(`${PATHS.src}**/*.{sass,scss}`)
      .pipe(
        plumber({
          errorHandler: notify.onError('<%- error.message %>'),
        })
      )
      // 開発時はファイルの内容をメモリにキャッシュする
      // .pipe(gulpif(!isProduction, cache('sass')))
      // 開発時はソースマップを出力する
      .pipe(gulpif(!isProduction, sourcemaps.init()))
      .pipe(sass())
      .pipe(
        postcss([
          postcssGapProperties(),
          autoprefixer({
            grid: true,
            cascade: false,
          }),
        ])
      )
      .pipe(csscomb())
      // プロダクション版はminify化してファイル名を*.min.cssに変更する
      .pipe(gulpif(isProduction, cleanCSS()))
      .pipe(gulpif(isProduction, rename({ extname: '.min.css' })))
      .pipe(
        rename(path => {
          path.dirname += '/../css'; // 出力先をcssフォルダに変更
        })
      )
      .pipe(gulpif(!isProduction, sourcemaps.write('.')))
      .pipe(dest(outDir))
      // 開発時はファイルをリロードする
      .pipe(gulpif(!isProduction, browserSync.stream()))
  );
}

/**
 * Eslintを実行する
 * @returns {*|NodeJS.WritableStream}
 */
function eslintTask() {
  return src([`${PATHS.src}**/*.js`, `!${PATHS.src}**/js/libs/*.js`])
    .pipe(
      plumber({
        errorHandler: notify.onError('<%- error.message %>'),
      })
    )
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(plumber.stop());
}

/**
 * EJSのビルドを実行する
 * @returns {*}
 */
function ejsTask() {
  const outDir = isProduction ? PATHS.dest : PATHS.src;
  return (
    src([`${PATHS.src}**/*.ejs`, `!${PATHS.src}**/_*.ejs`])
      // .pipe(cache('ejs'))
      .pipe(
        plumber({
          errorHandler: notify.onError('<%- error.message %>'),
        })
      )
      .pipe(
        ejs({
          env: env,
        })
      )
      .pipe(
        htmlbeautify({
          /* eslint-disable camelcase */
          indent_size: 2,
          indent_char: ' ',
          max_preserve_newlines: 0,
          indent_inner_html: false,
        })
      )
      // プロダクション版はjsファイルとCSSファイルのパスを.minをつけたファイルに変更する
      .pipe(gulpif(isProduction, replace('.css', '.min.css')))
      // .pipe(gulpif(isProduction, replace('.js', '.min.js')))
      .pipe(rename({ extname: '.html' }))
      .pipe(dest(outDir))
  );
  // .pipe(notify({ message: 'EJS task complete' }));
}

/**
 * EJSファイルをキャッシュする
 * @returns {*|NodeJS.WritableStream}
 */
function ejsCacheTask() {
  return src([`${PATHS.src}**/*.ejs`, `!${PATHS.src}**/_*.ejs`])
    .pipe(
      plumber({
        errorHandler: notify.onError('<%- error.message %>'),
      })
    )
    .pipe(cache('ejs'));
}

/**
 * ブラウザをリロードする
 * @param callback
 */
function reloadTask(callback) {
  browserSync.reload();
  callback();
}

/**
 * 開発用サーバー起動する
 * @param callback
 */
function browserSyncTask(callback) {
  browserSync(
    {
      port: 3000,
      server: {
        baseDir: PATHS.src,
      },
      open: 'external',
    },
    () => {
      callback();
    }
  );
}

/**
 * ビルド先のディレクトリのデータを削除する
 * @returns {*}
 */
function cleanTask() {
  return src(`${PATHS.dest}/*`, { read: false }).pipe(clean());
}

/**
 * jsファイルのconsoleなどを削除してbuildディレクトリに出力する
 * @returns {*}
 */
function buildJsTask() {
  const outDir = isProduction ? PATHS.dest : PATHS.src;
  return (
    src([`${PATHS.src}**/*.js`, `!${PATHS.src}**/*.min.js`])
      .pipe(plumber())
      .pipe(stripDebug())
      .pipe(replace(/(void 0;|void 0)/g, ''))
      // .pipe(uglify())
      // .pipe(gulpif(isProduction, rename({ extname: '.min.js' })))
      .pipe(dest(outDir))
  );
}

/**
 * リソースデータを出力先のディレクトリにコピーする
 * @returns {*}
 */
function copyTask() {
  return src(
    [`${PATHS.src}**/*.json`, `${PATHS.src}**/*.woff`, `${PATHS.src}**/*.woff2`, `${PATHS.src}**/css/libs/*.css`, `${PATHS.src}**/js/**/*.min.js`],
    {
      base: 'src',
    }
  ).pipe(dest(PATHS.dest));
}

/**
 * 画像の最適化を行う
 * @returns {*}
 */
function optimizeImgTask() {
  const outDir = isProduction ? PATHS.dest : PATHS.src;
  return src(`${PATHS.src}**/*.{jpg,jpeg,gif,png,svg}`)
    .pipe(plumber())
    .pipe(
      imagemin([
        pngquant({
          quality: '70-85',
          speed: 1,
          floyd: 0,
        }),
        imagemin.jpegtran({
          quality: 85,
          progressive: true,
        }),
        // mozjpeg({
        //   quality: 85,
        //   progressive: true
        // }),
        imagemin.svgo(),
        imagemin.optipng(),
        imagemin.gifsicle(),
      ])
    )
    .pipe(dest(outDir));
}

/**
 * CSVファイルをJSONファイルに変換する
 * @returns {*}
 */
function convertCsvToJson() {
  const outDir = isProduction ? PATHS.dest : PATHS.src;
  return src(`${PATHS.src}**/_assets/csv/*.csv`)
    .pipe(
      convert({
        from: 'csv',
        to: 'json',
      })
    )
    .pipe(
      rename(path => {
        path.dirname += '/../../json'; // 出力先をjsonフォルダに変更
      })
    )
    .pipe(dest(outDir));
}

// デフォルトタスク
exports.default = series(parallel(series(ejsTask, ejsCacheTask), series(sassCompileTask, sassCacheTask, convertCsvToJson), browserSyncTask), () => {
  watch([`${PATHS.src}**/*.ejs`, '!node_modules'], series(ejsTask, reloadTask));
  watch([`${PATHS.src}**/*.{sass,scss}`, '!node_modules'], sassCompileTask);
  watch([`${PATHS.src}**/*.js`, `!${PATHS.src}**/*.min.js`, '!node_modules'], eslintTask);
});

// 本番用のビルドタスク
exports.build = series(cleanTask, ejsTask, sassCompileTask, buildJsTask, optimizeImgTask, convertCsvToJson, copyTask);

// CSVからJSONへの変換
exports.convert = series(convertCsvToJson);

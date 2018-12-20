const { src, dest, watch, series } = require('gulp');
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

// 入出力パス
const PATHS = {
  src: './src/',
  dest: './build/',
};

/**
 * SASSファイルをキャッシュする
 * @returns {*}
 */
function sassCacheTask() {
  return src(`${PATHS.src}**/*.{sass,scss}`, { base: 'src' })
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
  return src(`${PATHS.src}**/*.{sass,scss}`)
    .pipe(
      plumber({
        errorHandler: notify.onError('<%- error.message %>'),
      })
    )
    .pipe(cache('sass'))
    .pipe(sourcemaps.init())
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
    .pipe(
      rename(path => {
        path.dirname += '/../css'; // 出力先をcssフォルダに変更
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(dest(PATHS.src))
    .pipe(browserSync.stream());
}

/**
 * Eslintを実行する
 * @returns {*|NodeJS.WritableStream}
 */
function eslintTask() {
  return src(`${PATHS.src}**/*.js`)
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

exports.default = series(sassCompileTask, sassCacheTask);

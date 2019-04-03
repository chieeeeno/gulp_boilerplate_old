// import { src, dest } from 'gulp';
// import plumber from 'gulp-plumber';
// import stripDebug from 'gulp-strip-debug';
// import gulpIf from 'gulp-if';
// import replace from 'gulp-replace';
// import rename from 'gulp-rename';
// import uglify from 'gulp-uglify';
// import { isProduction, PATHS } from './config';

// /**
//  * jsファイルのconsoleなどを削除してbuildディレクトリに出力する
//  * @returns {*}
//  */
// export function buildJsTask() {
//   const outDir = isProduction ? PATHS.dest : PATHS.src;
//   return src([`${PATHS.src}**/*.js`, `!${PATHS.src}**/*.min.js`])
//     .pipe(plumber())
//     .pipe(stripDebug())
//     .pipe(replace(/(void 0;|void 0)/g, ''))
//     .pipe(uglify())
//     .pipe(gulpIf(isProduction, rename({ extname: '.min.js' })))
//     .pipe(dest(outDir));
// }
import { src, dest, series } from 'gulp';
import gulpIf from 'gulp-if';
import plumber from 'gulp-plumber';
import gulpEslint from 'gulp-eslint';
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import changed from 'gulp-changed-in-place';

import { scripts as config, isProduction, PATHS } from './config';
const outDir = isProduction ? PATHS.dest : `${PATHS.docRoot}`;

export function esTranspile() {
  return src(config.src)
    .pipe(plumber())
    .pipe(gulpWebpack(require('../webpack.config.js'), webpack))
    .pipe(dest(outDir));
}

export function esLint() {
  return src(config.src)
    .pipe(changed({ firstPass: true }))
    .pipe(gulpEslint())
    .pipe(gulpEslint.format())
    .pipe(gulpIf(isProduction, gulpEslint.failAfterError()));
}

export const jsCompileTask = series(esLint, esTranspile);

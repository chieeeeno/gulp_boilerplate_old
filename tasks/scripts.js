import { src, dest, series } from 'gulp';
import gulpIf from 'gulp-if';
import plumber from 'gulp-plumber';
import gulpEslint from 'gulp-eslint';
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import changedInPlace from 'gulp-changed-in-place';

import { scripts as config, isProduction, PATHS } from './config';

const outDir = isProduction ? PATHS.dest : PATHS.docRoot;

export function esTranspile() {
  return src(config.src)
    .pipe(plumber())
    .pipe(gulpWebpack(require('../webpack.config.js'), webpack))
    .pipe(dest(outDir));
}

export function esLint() {
  return src(config.src)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(gulpEslint())
    .pipe(gulpEslint.format())
    .pipe(gulpIf(isProduction, gulpEslint.failAfterError()));
}

export const jsCompileTask = series(esLint, esTranspile);

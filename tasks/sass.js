import { src, dest } from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import gulpIf from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import csscomb from 'gulp-csscomb';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import postcss from 'gulp-postcss';
import changedInPlace from 'gulp-changed-in-place';

import postcssGapProperties from 'postcss-gap-properties';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import autoprefixer from 'autoprefixer';

import { isProduction, PATHS } from './config';

/**
 * SASSのコンパイルを実行する
 * @returns {*}
 */
export function sassCompileTask() {
  const outDir = isProduction ? PATHS.dest : PATHS.docRoot;
  return (
    src(`${PATHS.src}**/*.{sass,scss}`)
      .pipe(changedInPlace({ firstPass: true }))
      .pipe(
        plumber({
          errorHandler: notify.onError('<%- error.message %>'),
        })
      )
      // 開発時はソースマップを出力する
      .pipe(gulpIf(!isProduction, sourcemaps.init()))
      .pipe(sass())
      .pipe(
        postcss([
          postcssGapProperties(),
          postcssFlexbugsFixes(),
          autoprefixer({
            grid: true,
            cascade: false,
          }),
        ])
      )
      .pipe(csscomb())
      // プロダクション版はminify化してファイル名を*.min.cssに変更する
      .pipe(gulpIf(isProduction, cleanCSS()))
      .pipe(gulpIf(isProduction, rename({ extname: '.min.css' })))
      .pipe(
        rename(path => {
          path.dirname += '/../css'; // 出力先をcssフォルダに変更
        })
      )
      .pipe(gulpIf(!isProduction, sourcemaps.write('.')))
      .pipe(dest(outDir))
  );
}

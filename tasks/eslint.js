import { src, dest } from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import eslint from 'gulp-eslint';

import { PATHS } from './config';

/**
 * Eslintを実行する
 * @returns {*|NodeJS.WritableStream}
 */
export function eslintTask() {
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

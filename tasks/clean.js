import { src } from 'gulp';
import clean from 'gulp-clean';
import { PATHS } from './config';

/**
 * ビルド先のディレクトリのデータを削除する
 * @returns {*}
 */
export function cleanTask() {
  return src(`${PATHS.dest}/*`, { read: false }).pipe(clean());
}

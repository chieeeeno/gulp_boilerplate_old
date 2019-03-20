import browserSync from 'browser-sync';
import { PATHS } from './config';

/**
 * 開発用サーバー起動する
 * @param callback
 */
export function browserSyncTask(callback) {
  browserSync(
    {
      port: 3000,
      server: {
        baseDir: PATHS.docRoot,
      },
      open: 'external',
    },
    () => {
      callback();
    }
  );
}

/**
 * ブラウザをリロードする
 * @param callback
 */
export function reloadTask(callback) {
  browserSync.reload();
  callback();
}

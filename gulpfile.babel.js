// Gulp
import { series, parallel, watch } from 'gulp';

// Tasks
import { convertCsvToJson } from './tasks/convert';
import { cleanTask } from './tasks/clean';
import { ejsTask } from './tasks/ejs';
import { sassCompileTask } from './tasks/sass';
import { browserSyncTask, reloadTask } from './tasks/server';
import { optimizeImageTask, copyImageTask } from './tasks/optimizeImage';
import { transpileTask } from './tasks/scripts';

import { PATHS } from './tasks/config';

function watchTask() {
  watch([`${PATHS.src}**/*.ejs`, '!node_modules'], series(ejsTask, reloadTask));
  watch([`${PATHS.src}**/*.{sass,scss}`, '!node_modules'], series(sassCompileTask, reloadTask));
  // watch([`${PATHS.src}**/*.js`, `!${PATHS.src}**/*.min.js`, '!node_modules'], transpileTask);
  watch([`${PATHS.src}**/*.ts`, '!node_modules'], transpileTask);
  watch([`${PATHS.src}**/*.{jpg,jpeg,gif,png,svg}`], copyImageTask);
}

export const start = parallel(ejsTask, sassCompileTask, transpileTask, copyImageTask, browserSyncTask, watchTask);
export const build = series(cleanTask, ejsTask, sassCompileTask, transpileTask, optimizeImageTask);
export const convert = series(convertCsvToJson);

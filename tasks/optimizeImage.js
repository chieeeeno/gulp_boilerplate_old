import { src, dest } from 'gulp';
import plumber from 'gulp-plumber';
import imagemin from 'gulp-imagemin';

import { isProduction, PATHS } from './config';

/**
 * 画像の最適化を行う
 * @returns {*}
 */
export function optimizeImageTask() {
  const outDir = isProduction ? PATHS.dest : PATHS.src;
  return src(`${PATHS.src}**/*.{jpg,jpeg,gif,png,svg}`)
    .pipe(plumber())
    .pipe(
      imagemin([
        // pngquant({
        //   quality: '70-85',
        //   speed: 1,
        //   floyd: 0,
        // }),
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

export function copyImageTask() {
  const outDir = isProduction ? PATHS.dest : PATHS.docRoot;
  return src(`${PATHS.src}**/*.{jpg,jpeg,gif,png,svg}`).pipe(dest(outDir));
}

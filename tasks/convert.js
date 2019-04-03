import { isProduction, PATHS } from './config';

/**
 * CSVファイルをJSONファイルに変換する
 * @returns {*}
 */
export function convertCsvToJson() {
  const outDir = isProduction ? PATHS.dest : PATHS.docRoot;

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

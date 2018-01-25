# Gulpの基本セット
Gulpを使ってサイト構築するときの基本セットです。

## ディレクトリ構成
以下の構成で作成してます。
```
root
　├src
　│ ├index.html
　│ ├css
　│ ├scss
　│ ├images
　│ ├js
　│ └サブディレクトリ
　│    ├index.html
　│    ├css
　│    ├scss
　│    ├images
　│    └js
　├build
　├node_modules
　├gulpfile.js
　└package.json
```
- `./src/配下`：作業用データ
- `./build/配下`：納品用データ



## 使い方
### 作業時
コマンドプロンプト(ターミナル)でrootディレクトリに移動してgulpコマンドを実行する
```
cd ＜ディレクトリのパス＞/root/
gulp
```
あとは黙々と実装あるのみ！

### 納品時
コマンドプロンプト(ターミナル)でrootディレクトリに移動してgulpコマンドを実行する
```
cd ＜ディレクトリのパス＞/root/
gulp build
```
納品用のファイルを`いい感じ`に加工して出力する。
`いい感じ`具合は以下を参照。

### （おまけ）作業を中断するとき
Win場合：`Ctrl + c`、Macの場合：`command + c`を押下する。
黒い画面の基本ですよね。

## 設定しているタスクの内容
定義したタスクの詳細は以下のとおりです。

### デフォルトタスク
- .ejsファイルの情報を一旦メモリ内にキャッシュ。※事前キャッシュすることで、コンパイル時は差分のみコンパイルを実行してくれる。
- .scss or .sassファイルの情報を一旦メモリ内にキャッシュ。※事前キャッシュすることで、コンパイル時は差分のみコンパイルを実行してくれる。
- Browser-Syncのサーバーをポート3000番で起動。src配下をドキュメントルートに設定。
- .ejs、.html、.scss、.sass、.jsファイルをwatchタスクに登録
- watchタスクはそれぞれ以下を実行
  - .ejsファイルが更新されるとコンパイルを実行し、ブラウザを自動的にリロード　※ただし_(アンダースコア)から始まるファイル名は対象外
  - .htmlファイルが更新されるとブラウザを自動的にリロード
  - .scss or .sassを保存するとコンパイル、ベンダープレフィックス付与、CSSプロパティの整列、ソースマップ作成、cssファイル更新
  - .jsを保存すると構文チェックを実行

### ビルドタスク
- `/build/`配下のデータを削除
- .scss or .sassをコンパイル、ベンダープレフィックス付与、CSSプロパティの整列
- .js内の`console.log`と`alert()`を削除
- .htmlファイルをフォーマットに沿って整形
- 画像ファイル最適化
- 上記の結果を`build`配下に全て格納



### 各種コンパイル設定
納品用ファイルの`いい感じ`具合は以下のファイルで変更できます。

#### 設定ファイル
各設定値は以下のファイルに書かれています。
- setting.json
  - 作業用ディレクトリ／納品用ディレクトリのパス。
  - Autoprefixer（ベンダープレフィックス付けてくれるやつ）の設定
  - HTML整形の設定
  - サイト内の共通項目の設定
- .eslintrc
  - JavaScriptの構文チェック（ESLint）のチェック項目の設定
  - 設定値の詳細な説明は以下を参照
    - [公式ドキュメント](http://eslint.org/docs/rules/)
    - [ESLintのエラールール。日本語ざっくり解説[可能性あるエラー編]](http://qiita.com/M-ISO/items/f9097a75b362206c2a99)
    - [ESLintのエラールール。日本語ざっくり解説[ベストプラクティス編]](http://qiita.com/M-ISO/items/4cd183e2496c2937a53e)
    - [ESLintのエラールール。日本語ざっくり解説[スタイル編]](http://qiita.com/M-ISO/items/113ddd448bdc496af783)
- .csscomb.json
  - CSSの整形ルールを設定
  - 公式サイトのジェネレーターで作成可能
    - [http://csscomb.com/config](http://csscomb.com/config)


## 使用しているパッケージ
- gulp（Gulp本体）
- gulp-cached（データをキャッシュしてコンパイル時に差分のみコンパイルしてくれる）
- gulp-clean（指定したディレクトリのデータを削除してくれる）
- gulp-csscomb（CSSのコードをいい感じに整形してくれる）
- gulp-eslint（JavaScriptの記述がルールに沿っているかチェックしてくれる）
- gulp-ejs（EJSファイルのコンパイルを実行してくれる）
- gulp-html-beautify（HTMLのコードをいい感じに整形してくれる）
- gulp-imagemin（画像ファイルの最適化を行ってくれる）
- gulp-notify（タスク完了などの通知を出してくれる）
- gulp-plumber（Gulpのタスクエラー時に処理を止めない）
- gulp-postcss（postCSSを使用するためのプラグイン ※Autoprefixerで使用）
- gulp-rename（ファイル・ディレクトリのリネームを行ってくれる）
- gulp-replace（ファイル内の文字列を置換してくれる）
- gulp-sass（SASS/SCSSをコンパイルしてくれる）
- gulp-sourcemaps（SCSSのソースマップを出力してくれる）
- browser-sync（ローカルサーバーを立ち上げる・ブラウザー自動リロード）
- imagemin-pngquant（pngファイル最適化モジュール ※gulp-imageminと連携）
- node-notifier（タスク完了などの通知を出してくれる ※Gulpに依存しない）
- postcss-cssnext（postCSSの拡張モジュール）
- run-sequence（タスクを直列化して順番に実行する）


## 今後追加したいこと
- Babel使ってES6形式のJavaScriptにも対応したい。
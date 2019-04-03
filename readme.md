# Gulp の基本セット

Gulp を使ってサイト構築するときの基本セットです。

## ディレクトリ構成

以下の構成で作成してます。

```
root
　├build
　├docRoot
　├src
　│ ├index.ejs
　│ ├scss
　│ ├images
　│ ├js
　│ └サブディレクトリ
　│    ├index.ejs
　│    ├scss
　│    ├images
　│    └js
　├tasks
　├node_modules
　├gulpfile.babel.js
　└package.json
```

- `./src/配下`：作業用編集データ
- `./docRoot/配下`：作業用ドキュメントルート
- `./build/配下`：納品用データ

## 使い方

### 作業時

root ディレクトリに移動して以下の npm コマンドを実行します。

```
npm run start
```

実行すると、docRoot 配下をサーバーが参照し、ビルドしたファイルがコピーされ、ファイルが watch 状態に突入します。

JavaScript は ES2016 に対応してます。

JavaScript を新規作成する時は、 `webpack.config.js` にエントリーポイントを追記してください。

### 納品時

root ディレクトリに移動して以下の npm コマンドを実行する

```
npm run build
```

画像最適化などを行い、納品用のファイルに加工して出力します。

# No-Opinion Button / 意見ありませんボタン

## Steps to run the server on local PC / ローカル環境で動作させるための手順

1. Install [node.js](https://nodejs.org/ja/).
2. Clone this repogitory. Run `git clone` in the terminal or use GitHub Desktop.
3. Run `npm install` in the terminal.
5. Prepare MongoDB server.
6. Edit server.js as shown below.
7. Run `node server.js` in the terminal.
8. Open http://localhost:8000/ with the broswer.

```js
 // ----------------------------------------------------------------------------
 // Environment
 // ----------------------------------------------------------------------------
 const port = process.env.PORT || 8000;
 const MONGODB_URL = "mongodb://......" //process.env.MONGODB_URL;
```

## Usage / 使い方
- メモ表示機能 なし http://localhost:3000/?memo=false
- 30秒で復活機能 なし http://localhost:3000/?timeout=true
- ホスト用画面（みんな復活ボタン付） http://localhost:8000/host.html
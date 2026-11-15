# 遊戲開發實驗簿

給遊戲開發初學者的繁體中文筆記網站。每篇從一個可觀察的遊戲現象出發，帶讀者做一個小實驗，再用明確的行為或狀態檢查結果。

- [瀏覽網站](https://legendaryani.github.io/game-dev-fieldbook/)
- [閱讀 AGENTS.md](AGENTS.md)

## 本機預覽

在專案根目錄使用 Node.js 22 執行以下指令，然後開啟 [本機網站](http://127.0.0.1:4173/game-dev-fieldbook/)。

```sh
npm run build
npm run check
npm run preview
```

若預設連接埠無法使用，執行 `npm run preview -- --port 0` 自動分配，並開啟終端機顯示的網址。

## 新增筆記

讀取 [AGENTS.md](AGENTS.md) 和 [內容範例](content/notes/match-flow.json)，並在 `content/notes/` 新增一個符合欄位格式的 JSON 檔。執行 `npm run build` 即可把新筆記加到首頁索引與共用文章版型。`npm run check` 會核對來源及 HTML 是否一致。

GitHub Pages 從 `coursework` 分支的 `/docs` 提供靜態網站。

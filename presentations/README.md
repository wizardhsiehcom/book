# 重建書的簡報

## 播放 MIT 9.35

已重建的簡報可直接開啟 [MIT 9.35 首頁](mit-9-35-hearing/index.html)。新電腦先安裝一次全域指令 `npm install --global github:Echoslayer/AgentDeck`。從 `book` 專案根目錄執行：

```powershell
cd presentations/mit-9-35-hearing
agentdeck build
agentdeck inspect
```

`build` 首次依父目錄的 npm 鎖檔安裝框架並補齊播放檔，完成後會顯示首頁路徑。`inspect` 是唯讀檢查。兩條指令也可在 `branches/lec01/` 等書內目錄執行。

## 從共用目錄安裝與打包

以下 npm 指令都在 `presentations/` 執行。新環境或升版後需要重裝時，可使用：

```sh
npm ci --omit=optional --ignore-scripts
npm run deck:build -- mit-9-35-hearing
```

完成後開啟 `mit-9-35-hearing/index.html`。要交付離線檔，執行 `npm exec --offline -- agentdeck pack --dir mit-9-35-hearing`。

## 自製元件在本機能用，如何確認也會進 Git？

把 JS、CSS 和素材放在書內的 `agentdeck/components/<元件名>/`，從使用它的 HTML 入口引用。提交前在書內執行 `agentdeck inspect`。

例如，升版測試中，`agentdeck/components/upgrade-probe/note.svg` 被 `.git/info/exclude` 第 8 行的 `*.svg` 忽略。報告會同時列出這個檔案、規則位置和樣式。調整指出的規則或為該檔加入例外，再跑一次 `agentdeck inspect`。確認警告消失，並用 `git status --short --untracked-files=all` 核對新檔能被收錄，再一起提交入口、元件與素材。

## 讓另一本書使用同一份鎖檔

用此處安裝的 CLI 建立簡報，或準備一份版本相符的既有簡報。將下列 `<書名>` 換成簡報資料夾名稱。

```sh
npm run deck:build -- <書名> --inspect
npm run deck:build -- <書名> --adopt
```

第一行列出與鎖版的差異，第二行把相符的原廠副本寫入該書的 `agentdeck/.gitignore`。提交這份清單，以及書的入口、內容、素材、人工修改、自製元件和設定。原本已受 Git 追蹤的副本可再用下表的 `--untrack` 處理。

## 查檔案、清除或取消追蹤

在此目錄執行 `npm run deck:build` 可看操作清單。用 `npm exec --offline -- agentdeck catalog [關鍵字]` 查這個版本提供的元件、範例與指引，`npm exec --offline -- agentdeck docs <名稱>` 查用法。

| 想做的事 | 指令 |
| --- | --- |
| 看哪些檔可以重建、已進 Git 或有客製差異 | `npm run deck:build -- mit-9-35-hearing --inspect` |
| 預覽哪些原廠檔可取消 Git 追蹤，本機留著播放 | `npm run deck:build -- mit-9-35-hearing --untrack` |
| 預覽哪些本機框架檔可清除 | `npm run deck:build -- mit-9-35-hearing --clean` |

確認預覽後，在 `--untrack` 或 `--clean` 後加上 `--apply` 才會套用。取消追蹤後核對 `git diff --cached`，把鎖檔、來源與排除清單一併提交。清除後重新執行本頁的重建指令即可播放。套件快取、交付包與人工編輯會保留。原廠檔改成客製後，重新執行 `--adopt` 會保留檔案並更新排除清單；用 `--inspect` 檢查是否有其他 Git 規則仍忽略這份修改。

## 版本與升級驗證

MIT 9.35 已用 AgentDeck `b434719` 通過升級驗證。當次測試從乾淨環境還原 22 個框架檔，再次重建時還原 0 個。離線交付包通過 121 頁播放、38 題作答回饋、8 個音訊播放，以及星圖和 25 個跨講交界檢查。這些數字記錄當次測試的書稿。

共用版本以 [package.json](package.json) 為準，下載驗證值在 [package-lock.json](package-lock.json)，各書的核心來源和檔案雜湊在該書的 `agentdeck/agentdeck.json`。升級時一起審查這三份設定。

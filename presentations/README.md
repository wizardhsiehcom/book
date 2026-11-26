# 重建書的簡報

在 `presentations/` 執行以下指令。所有採用此流程的書共用這裡的 npm 鎖檔。

```sh
npm ci --omit=optional --ignore-scripts
npm run deck:build -- mit-9-35-hearing
```

完成後開啟 `mit-9-35-hearing/index.html`。要交付離線檔，執行 `npm exec --offline -- agentdeck pack --dir mit-9-35-hearing`。

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

MIT 9.35 已使用鎖定版本內附的重建腳本。框架的完整 commit 記在此目錄的 `package.json`，下載驗證值記在 `package-lock.json`。升級時連同這兩個檔案及各書的框架設定一起審查。

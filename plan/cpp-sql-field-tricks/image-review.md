# 圖片任務與驗收：C++＋SQL 第一版

日期：2026-09-22。圖均為本書原創 Mermaid，原始圖碼內嵌在下列 Markdown；輸出由 MkDocs HTML 中的 Mermaid 10.9.8 runtime 產生，不另維護 raster 副本。來源與授權：自行編排，無外部圖片；出版 credits 已同步。

共同規格：必要圖、繁中標籤、名稱與正文一致；特殊字元用引號、換行用 `<br/>`。白底圖區避免深色模式線條對比不足，過窄畫面允許水平捲動。圖下段落就是閱讀重點，不靠編號猜關係。

| ID／正文路徑（相對 docs/cpp-sql-field-tricks） | 教學問題／必須呈現 | 避免的暗示 | 圖型與驗收 |
|---|---|---|---|
| F00 `00-map.md` | 基準→邊界→交易→失敗→交付 | 必須逐章解鎖 | flowchart；關係核對、Chrome SVG 通過 |
| F02 `02-one-job.md` | 兩入口匯入同一核心 | 本書已提供 GUI | flowchart；核對、Chrome SVG 通過 |
| F03 `03-test-mode.md` | fixed/cli/fixture 共享核心，preview 只留檔 | 已實作 DB／正式通知 | flowchart；核對、Chrome SVG＋1440px 截圖通過 |
| F04 `04-snapshot.md` | 保存點在 ODBC 轉換後 | fixture 能驗 SQL 轉換 | flowchart；核對、Chrome SVG 通過 |
| F07 `07-results.md` | 實測 count→result set→fetch→無下一結果 | 所有 driver 固定兩格 | flowchart；核對實測、Chrome SVG 通過 |
| F08 `08-bind.md` | 活 storage 的 bind→改值→execute | 以 UB 重現生命週期錯誤 | sequenceDiagram；核對、Chrome SVG 通過 |
| F11 `11-rollback.md` | 一條 connection 的交易與外部效果分開 | rollback 會撤銷通知 | flowchart subgraph；核對、Chrome SVG 通過 |
| F12 `12-lock-wait.md` | A 完成 UPDATE 才開始 B，timeout 後釋放再試 | sleep 猜先後／實測所有隔離模式 | sequenceDiagram；核對實測、Chrome SVG＋1440px 截圖通過 |
| F15 `15-retry.md` | 按證據分未送／部分完成／未知 | 錯誤碼直接授權重試 | flowchart；核對、Chrome SVG 通過 |

01、05、06、09、10、13、14、16、17：不需圖，短表／精確輸出更適合。沒有未完成的必要 raster 素材任務。

## 正文版本 SHA-256

```text
00-map.md          9AA5CB5D06400BAE69A7B7B5D2DB15AD9AB3244AFA71EC90FEFDF97EFB9091B8
02-one-job.md      881D230CED4D85FA1017C9E7CDAAA1E23F395100D69F08EE49924E249250BE40
03-test-mode.md    7C913E32A3D290F7FD617C4AC841573D3F0DC9BBB2E0DFACBE89D3374A2D150D
04-snapshot.md     5F6C8F8D0D534D55FE8D1E3DDA1F0A5FB990543004875D31740AB730791B3A3B
07-results.md      A288FAC7B09C0F95847F7D528D9EC62E345DD678CB9EF0211817B04A4F4F6812
08-bind.md         7A11734ABA74C5554D9E3CB52C73C5541A06DE6331020DD37D3411F89DB26E1C
11-rollback.md     63A69BB145935EEA4DF9E53009D82C2B3E9AE5470C30C0F0B47203C752CB8885
12-lock-wait.md    A41A28EC723AE146752EBF8439D55BDED26421138B23D1DA5FA307916887D2AF
15-retry.md        C03E410FAC28CE8822CF320E3EA562D1900744B532027F1AF3ED9DD21619D84D
```

後續若改段落／名稱／條件，對應任務先標待重驗；只改無關錯字也要核對並更新版本，不需要一律重畫。15 的最後回修改的是獨立 fixture 與 skip 查核，圖本身未變，已核對與現行三分支仍一致。

## 實際渲染與限制

`verify-render.ps1` 對全部九個 file URL 使用獨立暫存 Chrome profile，檢查 `data-processed=true`、SVG 與沒有 Mermaid 錯誤圖。`ch03-final.png`、`ch12-final.png` 是本機驗收截圖（git-ignored），主 agent 已檢視。不是全螢幕尺寸／全瀏覽器人工驗收。

曾失敗的最小對照留在 `mermaid-probe.html`（git-ignored）：相同 flowchart，pre/code 版本失敗，裸 div 通過。新書 config 改用 `fence_div_format`，沿用共用 initializer 一套，不修改全書庫資源。若 Mermaid CDN 無法載入，離線渲染仍是已知限制。

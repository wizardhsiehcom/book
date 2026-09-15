# 大立光書籍完稿驗收

驗收日：2026-09-15。出版目錄：`book/largan/html/`。

## 交付範圍

接續 Claude session `7d6dd900-5adb-44f2-bbb7-d50fec2b9bf8` 的 11 章草稿及研究資料，補第 12 章、圖表來源附錄、兩張 SVG，並完成內容複核及出版。共 12 章、6 頁導讀／地圖／附錄，18 個閱讀頁；12 章共 65,188 個漢字，含表格及推理解答、不含英數。12 章均有可展開的推理參考答案。

公司與技術修正分見 [business-review.md](business-review.md)、[technical-review.md](technical-review.md)。最後再修正第 06 章的無來源精度數字、缺陷歸因與毛利推理；第 09 章明示單站模型是另設參數的簡化；第 11 章將收入認列與單獨揭露分開。

## 驗收結果

| 項目 | 結果 |
|---|---|
| 資產同步 | `UV_CACHE_DIR=/private/tmp/largan-uv-cache bash sync-assets.sh` 成功；原腳本未設執行權限，因此經 bash 呼叫 |
| 單書建置 | `uv run mkdocs build -f configs/largan.yml` 成功 |
| 建置提示 | 9 筆跨書 HTML 不在本書 docs_dir 的警告；未關閉檢查、不宣稱 strict 通過。補建 GPM、東捷、昇陽的既有輸出；與 MIT 計算攝影的跨書目標全部存在 |
| 本地連結、錨點與資源 | 18 頁共檢查 1,418 個目標，缺漏為 0；包括兩個 SVG、CSS／JS 與跨書目標 |
| 導覽與搜尋 | nav 涵蓋 18 頁；搜尋索引正好涵蓋 18 個閱讀頁，研究筆記未進入搜尋 |
| 書庫 | `js/books-data.js` 恰有一筆大立光入口；18 頁各有一個回書庫連結，均指向 `../../../index.html` |
| 算例 | 第 06 章 4 組、第 09 章 7 組、第 12 章 3 組，及無報廢邊界核對通過；第 02–03 章光學計算另見技術審核 |
| 完整瀏覽器檢查 | 既有 Chrome，1440×1000 與 390×844；18 頁 × 2，共 36 次頁面檢查、26 次 Mermaid 渲染，0 JavaScript／圖表錯誤、0 頁面橫向溢出 |
| 最後局部修訂 | 第 04、11 章再次檢查兩種視窗，共 4 次頁面檢查、4 次圖表渲染，0 錯誤 |
| 圖表可讀性 | 初輪 12 筆字體過小情形，改縱向與可捲動容器後，最終所有 Mermaid 標籤換算顯示尺寸均至少 12 px |
| 原創圖片 | 2 張 SVG XML 正確；桌機與手機均載入，桌機逐圖目視核對公差及折疊方向；窄螢幕保留至少 640 px 寬並可左右捲動 |
| 寬表 | 8 欄以上表格保留至少 1280 px，在 Material 表格容器內橫向捲動，避免手機每格擠成超長直欄 |

13 張 Mermaid 與兩張 SVG 均已檢視圖文關係；截圖存於 `data/largan/validation/final/`，不納入出版。部分長圖的元件截圖會包含頁首固定導覽覆蓋的最上緣，原圖本身無截斷；完整頁面截圖與實際捲動均可閱讀。

## 可重現檢查

```bash
python plan/largan/check_examples.py
UV_CACHE_DIR=/private/tmp/largan-uv-cache uv run mkdocs build -f configs/largan.yml
python plan/largan/validate_content.py
UV_CACHE_DIR=/private/tmp/largan-uv-cache uv run --with playwright python plan/largan/browser_acceptance.py
```

瀏覽器檢查暫用 Playwright 及既有 Chrome，未加入專案依賴。需要可啟動 localhost 伺服器與瀏覽器的環境。腳本可在最後加 HTML 檔名，只複核指定頁面；局部結果另存，保留完整結果。

機器紀錄：[content-validation.json](content-validation.json)、[example-validation.json](example-validation.json)、[browser-validation.json](browser-validation.json)、[browser-validation-targeted.json](browser-validation-targeted.json)。[image-manifest.json](image-manifest.json) 保存最終正文、Mermaid 圖碼及 SVG 的 SHA-256。

## 公開證據與使用限制

本次完成的是可閱讀書籍。公司未公開的良率、客戶名、個別產品收入及完整控制附註仍列待查；未以推論代填。初查、續查日期分開，MOPS 季報簡報本輪直讀失敗者保留前次研究紀錄，未宣稱重新核對成功。

外部文件的永久可用性不在本地驗收範圍。Mermaid 仍沿用書庫的遠端函式庫，首次渲染需連線。Material 的 404 頁使用伺服器根路徑語義，不列為一般閱讀頁的 file URL 驗收；18 個正式閱讀頁與書庫入口已核對。

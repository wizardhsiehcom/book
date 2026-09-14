# PSI 補圖驗收

日期：2026-09-14。採用使用者指定 mkdocs-update 流程；Luna max 協助 Commons 素材查核及縮圖整理，主編完成圖稿、整合與驗收。

- 第 01 章：圖案晶圓照片，對照晶圓與晶粒。
- 第 02 章：濕式蝕刻工作台、FOSB 晶圓運輸盒照片，補足加工設備與交付邊界。
- 第 03 章：NASA 鏡面晶圓照片，以及厚度差／整片彎曲原創 SVG。
- 第 06 章：一般薄化／TAIKO 原創剖面 SVG。
- 圖表出處：六筆來源方式、作者、File 頁或原理來源、實際授權與修改資訊；其他章節及公司數據未改動。

## 已通過

`bash ./sync-assets.sh`、`uv run mkdocs build --strict -f configs/psi.yml` 成功。
`validate_content.py`：16 頁、909 個本地連結與資源，零失效；11 張既有 Mermaid 保留。
`validate_image_update.py`：5 個受影響頁面 × 桌機 1440×1000／手機 390×844，共 10 次頁面檢查；12 次圖片解碼及 8 次 Mermaid 渲染檢查，零失敗，無頁面水平溢出，回書庫連結存在。
新增 SVG 的手機顯示寬度為 358 px，文字約 15.9 px；主編目視確認文字與幾何關係可辨識。

四張照片均經主編目視核對；六張圖片都有繁中 alt、圖說及可導向署名的連結。照片依 Commons 各檔案頁確認授權，不以全站授權代替；兩張 SVG 依原理自行繪製，未重製原廠圖像。已更新正文 SHA-256 及受影響 Mermaid 的來源行號與驗收依據。

原始結果：`image-update-validation.json`；截圖：`data/psi/validation/image-update/`；候選來源：`wiki-image-candidates.md`。舊 `browser-validation.json` 是補圖前的全書驗收，本輪只重驗受影響頁面。

## 資源方式

四張照片使用 Commons／Wikimedia 遠端網址，其中三張為 Special:FilePath 動態縮圖；兩張 SVG 隨書本地發布。遠端照片需要網路，暫存於 data 的查核圖片不作離線備援。原有共享字型備援與 Mermaid CDN 方式沿用。

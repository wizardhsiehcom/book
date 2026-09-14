# 矽格書籍補圖任務

日期：2026-09-14。本輪補 4 張圖，原有 7 張 Mermaid 保留。Luna max 負責外部素材查找，主 agent 核對、整合與驗收。

## 圖 02-1

- 章節：02-test-cost-model.md；插入位置：成本情境表後。
- 最終正文 SHA-256：`ca3f507a9edf91b9e034ac7ad40fa9f2ab2e9bdfe687e634143987593d1979cc`。
- 目的與關係：比較 B→C 加測 0.5 秒造成成本 +20%；A/B/D 平行效率不同。
- 圖型與樣式：PNG 1728×928；零基線；沿用 external-image 樣式，可點開原圖。
- 來源：本章教學假設；render-cost-chart.py。
- 輸出：`docs/sigurd/images/test-cost-scenarios.png`。
- 必要性：可選教學補強。狀態：**已驗收**；無待補缺口。
- 驗收：原創 Matplotlib，未使用外部圖檔；算式重算通過；生成 HTML 圖片解碼、桌機 1365px／手機 390px 邊界檢查通過。
- 避免暗示：不代表矽格設備、規格、實績或報價；圖說與附錄已明示用途界線。

## 圖 03-1

- 章節：03-test-cell.md；插入位置：元件分工表後。
- 最終正文 SHA-256：`8e3f5a0ec9fc9a94dd70afbbd9ba3883ebbeb06bdf80cbd4f8cf6521f8862da7`。
- 目的與關係：辨識探針卡的密集細探針，對回晶圓接觸介面。
- 圖型與樣式：原圖 JPEG 4128×2322；顯示寬度至多 900；沿用 external-image 樣式，可點開原圖。
- 來源：https://commons.wikimedia.org/wiki/File:CIS_probe_card.jpg。
- 輸出：`docs/sigurd/images/cis-probe-card.jpg`。
- 必要性：可選教學補強。狀態：**已驗收**；無待補缺口。
- 驗收：Jasycheng，CC BY-SA 4.0；原圖無修改；File 頁與實物外观核對通過；生成 HTML 圖片解碼、桌機 1365px／手機 390px 邊界檢查通過。
- 避免暗示：不代表矽格設備、規格、實績或報價；圖說與附錄已明示用途界線。

## 圖 03-2

- 章節：03-test-cell.md；插入位置：探針卡照片後。
- 最終正文 SHA-256：`8e3f5a0ec9fc9a94dd70afbbd9ba3883ebbeb06bdf80cbd4f8cf6521f8862da7`。
- 目的與關係：辨識夾殼 socket 的夾持與定位機構，不推定所有 FT 治具相同。
- 圖型與樣式：原圖 PNG 501×501；不放大顯示；沿用 external-image 樣式，可點開原圖。
- 來源：https://commons.wikimedia.org/wiki/File:M4050-Clamshell_Socket.png。
- 輸出：`docs/sigurd/images/clamshell-test-socket.png`。
- 必要性：可選教學補強。狀態：**已驗收**；無待補缺口。
- 驗收：DPJessie，CC BY-SA 4.0；原圖無修改；用途限於原始頁所述模組壽命測試例子；生成 HTML 圖片解碼、桌機 1365px／手機 390px 邊界檢查通過。
- 避免暗示：不代表矽格設備、規格、實績或報價；圖說與附錄已明示用途界線。

## 圖 06-1

- 章節：06-silicon-photonics-test.md；插入位置：核心差異段後。
- 最終正文 SHA-256：`0110cd9336619ba4c9d9710f81aeddaced62e982bed53124d8de60362e029c0b`。
- 目的與關係：電探針接 pad；光纖對位表面光柵，光轉入波導；非按比例、不標通用容差。
- 圖型與樣式：SVG 1080×580；繁中、固定淺色底；沿用 external-image 樣式，可點開原圖。
- 來源：Keysight T13 的表面光柵／邊緣耦合文字說明。
- 輸出：`docs/sigurd/images/optical-electrical-contact.svg`。
- 必要性：可選教學補強。狀態：**已驗收**；無待補缺口。
- 驗收：原創 SVG，未轉載或描摹原圖；一手來源、幾何與視覺驗收通過；生成 HTML 圖片解碼、桌機 1365px／手機 390px 邊界檢查通過。
- 避免暗示：不代表矽格設備、規格、實績或報價；圖說與附錄已明示用途界線。

## 其他章節

01 已有插入點流程；04 已有訊號路徑與限制表；05 已有篩選概念圖及控制矩陣；07、08 保留可追溯證據表。本輪不另補裝飾圖。

## 最終驗證

- `bash ./sync-assets.sh` 完成；`uv run mkdocs build -f configs/sigurd.yml` 成功。
- `uv run --with matplotlib --with playwright python plan/sigurd/validate-images.py` 通過；驗證報告見 [results.json](validation/results.json)。
- 4 張圖在 Chromium 實際解碼與截圖；檢視圖片及圖說，無缺字或圖說遮擋。桌機與手機寬度均無圖片容器溢出；小螢幕可點圖放大讀標籤。
- 全書 HTML 本地連結與來源錨點檢查零失敗，包含 11 筆 MkDocs 跨書警告所指的實際輸出連結。
- 本輪只驗收新增圖片；不宣稱原有 Mermaid 的 JavaScript 渲染已重新驗收。
- 工作腳本、圖版截圖與本紀錄均在 plan_dir，不會出現在網站搜尋索引。
- 隨補圖修正：啟用本書 `attr_list`，使既有來源 ID 生效；十六工成本 2500 ÷ 16128 = 0.1550099 元，四捨五入至小數兩位應為 0.16 元，已修正正文及 alt。

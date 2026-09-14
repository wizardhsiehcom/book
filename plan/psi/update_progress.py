"""Record the implementation phase without erasing the original planning scope."""
from pathlib import Path

root = Path(__file__).resolve().parents[2]
path = root / 'plan/psi/psi-book-plan.md'
text = path.read_text(encoding='utf-8')
text = text.replace('建立日／初查日：2026-09-14。狀態：**規劃完成，正文未開始**。',
    '建立日／初查日：2026-09-14。續寫日：2026-09-14。狀態：**16 頁正文與出版整合完成；驗收詳見第 10 節**。')
marker = '\n## 10. 本次 mkdocs-create 執行與驗收（2026-09-14）\n'
if marker in text:
    text = text.split(marker)[0]
text += marker + '''
前述「本輪只規劃」「未開始」及批次表是前次規劃時的歷史快照。本次使用者已要求依本計畫寫書，故進入 B0–B5；當前狀態以下表為準。

| 批次 | 本次結果 | 狀態 |
|---|---|---|
| B0 | Luna max 分別取得技術、公司研究；T1–T4 補齊，T5 補熱傳條件；A1/I1 適用段落、TWSE 半年度資料与 N1 鏡錄已讀 | 完成；MOPS 原件及客戶非公開規格維持缺口 |
| B1 | 04 試寫與 reuse_model.py；獨立事件樹對帳，q=0、q=1、R=0 邊界；品質溢價翻轉算例 | 通過 |
| B2 | 01–03、05 正文、推理題、一手技術來源與圖表 | 完成 |
| B3 | 06–08；07 收斂為具體公開材料方向與驗證問題，08 有月度產能敏感度 | 完成 |
| B4 | 09 服務矩陣，10 四個事件／文件案例，各含事實、推論、未知與改判條件 | 完成 |
| B5 | 16 頁 nav、導讀／附錄、書庫卡片、共享資源、圖表版本與驗收 | 結果見 validation.md |

出版綁定：`docs/psi/` → `configs/psi.yml` → `book/psi/html/`。書庫只修改 `js/books-data.js`；沒有更換共用主題或修改其他書的內容。

### 本次查證修正

- 財務更新至 TWSE 年度 115、季別 2 的上半年累計；不把 Q2 標籤當成第二季單季。
- 材料明确列 Si Dummy Die／Filler、SiC Carrier、Al₂O₃ 基座；公司方案及開發方向不升級成量產。
- 設備事件找到可追溯公告鏡錄，具名均豪、5.51 億元及公告非關係人分類；MOPS 原始公告直讀受安全驗證阻擋，正文明示來源等級。
- 官網列出的 Si、SiC、GaN 尺寸與服務項目不當成逐客戶量產證據。
- I1 原圖本機轉出，主編目視核對印刷頁 23、24、27。財務表的其他期別符號／四捨五入差異不拿來自行外推。

### 可重現檔案

- `research/technical-sources.md`、`company-sources.md`、`materials-sources.md`：一手與鏡錄範圍分開。
- `reuse_model.py`、`research/model-results.md`：教學模型與結果。
- `validate_content.py`、`content-validation.json`：16 頁本地連結、資源與來源錨點。
- `validate_browser.py` 及驗收輸出：桌機／手機、Mermaid 與截圖。
- `image-manifest.json`：逐頁正文 SHA-256、Mermaid ID、插入點與來源方式。
- 暫存原始 PDF、API 快照及截圖放在 `data/psi/`，不納入 MkDocs 內容目錄。

### 尚未解決的研究問題

MOPS 原件、完整最新財報附註與現金流逐項查核、客戶允收與認證、業務細項毛利、新材料客戶與出貨、等效片數算法、完整環境比較方法，仍保留為研究缺口。正文以可證實範圍收斂；沒有為填滿章節而猜測這些數字。
'''
text = text.replace('資料与 N1', '資料與 N1').replace('材料明确列', '材料明確列')
path.write_text(text, encoding='utf-8')
print('Plan updated with implementation phase.')

# SMT Bonding 書籍審閱改進計畫

> **狀態（2026-07-08）**：Agent A（A1–A8）、B（B1–B6）、C（C1–C2）、D（D1–D3）全部完成；E1、E2 完成，E3（COF 換圖）未做。建置通過無警告。
> - C1：全書 13 檔 94 處 `\n` → `<br/>`，建議 `./serve-book.sh smt-bonding` 目視覆核 mermaid 圖。
> - D1：實測 `Special:FilePath/FPC_PANEL.pdf?width=500` 回傳 `image/jpeg`（Wikimedia 自動轉第一頁縮圖），圖片正常，**無需修改**。
> - D3：以 Commons API 逐一核對 23 檔，原表全標 CC BY-SA 3.0 有 12 檔錯誤；已改為實際授權（含 CC BY-SA 4.0 / CC BY 2.0・3.0 / 2.0 de / FAL / Public domain / Attribution）並新增作者欄。
> - A4 依 Malcom 螺旋式量測典型值（主流錫膏 datasheet 約 150–250 Pa·s）修正；A5 依業界常見建議（冷卻 2–4°C/s、上限約 6°C/s，參照 JEDEC J-STD-020 之 6°C/s 上限）修正。

> 審閱範圍：`docs/smt-bonding/` 全部 15 頁 + `configs/smt-bonding.yml`。
> 建置狀態：`uv run mkdocs build -f configs/smt-bonding.yml` 通過，無斷鏈、無 nav 警告。
> 整體評價：結構清晰（前提知識 → 三大工藝 → 比較 → 品質分析 → 材料），敘事完整、語言一致、頁面粒度符合「一頁一概念」。主要問題有三類：**同一參數在不同頁面數值不一致**、**全書 Mermaid 圖大量使用 `\n` 換行（違反 CLAUDE.md 規範）**、**個別技術敘述需查證**。

## 工作流分派（可獨立平行執行）

---

## Agent A：技術數據查核與跨頁一致性（優先度：高）

同一材料參數在 `04-acf.md` 與 `09-materials.md` 出現兩套數字，需統一（建議以 09 材料頁為準源，04 引用時保持一致或註明「範例值」）。

| # | 檔案 | 問題 | 建議修正 |
|---|------|------|---------|
| A1 | `04-acf.md`、`09-materials.md` | ACF 導電粒子直徑：04 寫「Φ 3–5 μm」、09 寫「3–7 μm」 | 統一為一個範圍（業界常見 3–10 μm，顯示器用多為 3–5 μm），兩頁一致 |
| A2 | `04-acf.md`、`09-materials.md` | 壓著溫度：04 寫「170–200°C」、09 寫「150–200°C」；壓力：04 寫「2–4 MPa」、09 寫「2–5 MPa」 | 兩頁統一，或在 04 註明「以下為典型範例，完整範圍見材料規格頁」並連結 |
| A3 | `03-hot-bar.md` | 接觸溫度表「陶瓷基板（COC/COG）可達 500°C」— COG（Chip on Glass）用 ACF 壓著，刀頭溫度僅 150–250°C；500°C 會損壞 ACF 與玻璃。此行把「陶瓷基板直接硬焊」與 COG 混為一談 | 拆開：陶瓷基板硬焊可達 500°C；COG/ACF 類另列 170–250°C，或移除 COG 字樣 |
| A4 | `09-materials.md` | 錫膏黏度「800–1200 Pa·s」— Malcom 螺旋式量測典型值約 150–250 Pa·s；800–1200 較接近 Brookfield 讀值（kcps）。單位與量測法未註明易誤導 | 查證後標明量測方法（如「Malcom：150–250 Pa·s」），或改標 kcps |
| A5 | `02-temp-profile.md` | 冷卻速率「3–7°C/s」— 多數規範建議 ≤4–6°C/s（過快致元件裂、板彎），7 偏高且與同頁「板彎：冷卻速率過快」的警告矛盾 | 改為 2–4°C/s（典型）並註明上限約 6°C/s |
| A6 | `02-temp-profile.md` | Ramp-to-Spike 圖說「常用於對溫度敏感性要求較低的無鉛製程」— RTS 實際上是為了**縮短高溫暴露時間**、常被推薦用於無鉛製程以減少缺陷，敘述因果顛倒 | 改寫：「以線性升溫取代長均溫段，縮短總受熱時間，常見於無鉛製程」 |
| A7 | `08b-aoi.md` | 檢查手段表「工業顯微鏡（30–100×）：焊點形狀、IMC 確認」— IMC 在焊點內部，頂視光學顯微鏡看不到，需截面分析 | 刪去「IMC 確認」或改為「焊點潤濕形狀確認」 |
| A8 | `00-glossary.md`、`02-temp-profile.md`、`08b-aoi.md` | 錫珠英文名不一致：glossary 與 02 用「Solder Bead」、08b 用「Solder Balls」 | 統一為「Solder Beading / Solder Ball」並全書一致 |

## Agent B：結構與導覽修正（優先度：高）

| # | 檔案 | 問題 | 建議修正 |
|---|------|------|---------|
| B1 | `README.md` | 全書導讀清單（1–10）漏列 `08b-aoi.md`（三大工藝的 AOI 檢測重點），nav 有但導讀沒有 | 在第 8 項後插入「三大工藝的 AOI 檢測重點」 |
| B2 | `README.md` | 學習路徑 mermaid 起點節點「焊錫冶金基礎（合金、助焊劑）」沒有對應頁面，讀者無從點入 | 對應到現有內容：改為「PCB 與 SMT 基礎 + 名詞速查」，或在圖下註明合金知識在 09 材料頁 |
| B3 | `README.md` | 學習路徑 mermaid 缺 AOI（08b）節點 | 在「缺陷分析」節點後補 08b 分支 |
| B4 | `07-comparison.md` | 「年產量 > 1000 片以上」—「>」與「以上」語意重複 | 改「年產量 1000 片以上」 |
| B5 | `07-comparison.md` | 比較矩陣列「RoHS 合規難度」— RoHS 是材料合規，與加熱工藝無關；實際想表達的是「無鉛製程控制難度」 | 列名改「無鉛製程難度」 |
| B6 | `08-defect-analysis.md` | 檢測工具總覽圖「發現缺陷 --> AOI --> SPI」箭頭語意混亂：SPI 在製程順序上先於 AOI，圖意（工具分類）與箭頭方向（流程）打架 | 改為無方向分類圖，或按製程順序 SPI → AOI → X-Ray → 截面重排 |

## Agent C：Mermaid 規範修正（優先度：中）

| # | 範圍 | 問題 | 建議修正 |
|---|------|------|---------|
| C1 | 全書 13 個檔案、48 處 | Mermaid 節點標籤使用 `\n` 換行，違反 CLAUDE.md 規範（「use `<br/>`, never `\n`」）。mermaid@10 對引號內 `\n` 的支援屬於遺留行為，升版即壞 | 全書把 mermaid 區塊內標籤中的 `\n` 改為 `<br/>`（僅限 code fence 內，勿動一般內文）。修正後 `./serve-book.sh smt-bonding` 逐頁目視確認 |
| C2 | `08-defect-analysis.md` | `Defect --> AOI & Xray & CS` 使用 `&` 扇出語法，配合 B6 重排時一併確認渲染 | 與 B6 同步處理 |

## Agent D：圖片與版權（優先度：中）

| # | 檔案 | 問題 | 建議修正 |
|---|------|------|---------|
| D1 | `03-hot-bar.md`、`05-display-modules.md` | 以 `![](…/FPC_PANEL.pdf?width=500)` 將 **PDF 當圖片嵌入** — Wikimedia `Special:FilePath` 對 PDF 加 `width` 參數的縮圖行為不保證，瀏覽器可能顯示破圖 | `./serve-book.sh smt-bonding` 目視確認；若破圖，改用該檔案的 PNG 縮圖 URL 或換一張圖 |
| D2 | `99-image-credits.md` | 表中「AOI 多角度光源示意圖 / 出現頁面：AOI 自動光學檢測」— 08b 頁面實際沒有 `AOI_light.svg`，此列為過期資料；且 08b 頁名已是「三大工藝的 AOI 檢測重點」 | 刪除該列（或若計畫在 08b 補圖則更新頁名） |
| D3 | `99-image-credits.md` | 24 列授權全部標「CC BY-SA 3.0」，明顯是預設值而非逐一查證（Commons 圖常見 CC0、CC BY、4.0 等） | 逐一到 Commons 檔案頁核對實際授權與作者，更新表格；需標作者的（BY 條款）補上作者名 |

## Agent E：內容補強（優先度：低，選做）

- E1 `01-hot-air.md`：溫區示意「溫區 7–8 冷卻」— 多數爐子的冷卻段獨立於加熱溫區編號之外，可加一句註明「冷卻段有時不計入溫區數」。
- E2 `02-temp-profile.md`：可補一段 RSS vs RTS 的選擇準則（已有兩張圖但正文只講 RSS 四段）。
- E3 `05-display-modules.md`：COF 圖沿用 FPC_PANEL.pdf 並在圖說自稱「示意」，若 D1 換圖可一併找更貼切的 COF 實物圖（`/mkdocs-add-images`）。

## 驗收

1. 修正後 `uv run mkdocs build -f configs/smt-bonding.yml` 無警告。
2. `./serve-book.sh smt-bonding` 逐頁目視確認所有 mermaid 圖（C1 影響全書）與 D1 兩處 PDF 圖片。
3. Agent A 每項修正附來源（錫膏/ACF 廠商 datasheet、IPC/JEDEC 規範）。
4. D3 每列授權附 Commons 檔案頁連結核對結果。

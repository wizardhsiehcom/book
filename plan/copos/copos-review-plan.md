# CoPoS 書籍審閱改進計畫

> **狀態（2026-07-08）**：已執行完畢。
> - Agent A：A1（830 mm² 基準已加註、03 統一 9.5 倍）、A4、A5 完成；A2 查證屬實（TSMC 首度公布玻璃驗證數據，來源已補進 appendix-references）；A3 查證後**維持原文**（TechPowerUp 來源即寫 515 × 510 mm）。
> - Agent B：B1（05 章三處改為「有機 RDL 起步、玻璃為後續升級」）、B2、B3 完成。
> - Agent C：C1 已移除 quadrantChart 引號；C2、C3 語法確認合法，未改（`./serve-book.sh copos` 目視覆核可選）。
> - Agent D：D1 為**誤報**——啟動器已改版，書籍清單在 `js/books-data.js`，copos 卡片早已存在；已順手修正 CLAUDE.md 的過時說明（`.card` 區塊 → books-data.js）。D2 依建議**保留** 00-plan 於 nav（不改）。D3 完成——05–08 頁尾補上「下一頁」，全書每頁都有向前導覽（01–04 原有頁尾、09–12 於內文收尾指向下一頁）。
> - 建置通過無警告。

> 審閱範圍：`docs/copos/` 全部 16 頁 + `configs/copos.yml` + 根目錄 `index.html`。
> 建置狀態：`uv run mkdocs build -f configs/copos.yml` 通過，無斷鏈、無 nav 警告。
> 整體評價：全書結構完整（前提知識 → CoPoS 核心 → 產業時程 → 進階展望），交叉連結健全，時效性標註（「截至 2026 年中」）與來源清單是全書庫的模範做法。主要問題：**書未註冊進首頁啟動器**、少數跨頁敘事矛盾、reticle 數字基準不一致、一張 quadrantChart 有渲染風險。

## 工作流分派（可獨立平行執行）

---

## Agent A：數字一致性與查核（優先度：高）

| # | 檔案 | 問題 | 建議修正 |
|---|------|------|---------|
| A1 | `11-copos-vs-alternatives.md`、`01-why-advanced-packaging.md`、`03-cowos-recap.md` | 全書 reticle limit 寫「約 858 mm²（26 × 33 mm）」，但 11 的比較表寫「9.5 倍 reticle（約 7,885 mm²）」——858 × 9.5 = 8,151，7,885 對應的是 TSMC 官方採用的 ~830 mm² 基準。另 03 寫「9 倍」、11 寫「9.5 倍」 | 統一倍數為 9.5×；在 11 加半句註明「TSMC 以約 830 mm² reticle 計算，故 9.5× ≈ 7,885 mm²」，或全表改用 858 基準重算 |
| A2 | `07-glass-substrate.md` | 「台積電公布的驗證數據顯示，導入玻璃載板後封裝翹曲改善約 16%」——全書唯一未列入 appendix-references 的具名官方數據 | 查證出處（應為 ECTC 2026 或法說材料）補進 `appendix-references.md`；查不到就弱化為「產業發表數據稱」 |
| A3 | `06-panel-geometry.md` | 中間世代面板寫「515 × 510 mm」；業界 PLP 標準慣用寫法為 510 × 515 mm | 確認來源寫法後統一（面積 262,650 mm² 兩者相同，僅次序） |
| A4 | `10-supply-chain-competition.md` | 「封裝尺寸甚至做到 620 × 750 mm」與全書其他處（06、11、12、glossary）的「750 × 620 mm」寫法次序不一 | 統一為 750 × 620 mm |
| A5 | `09-tsmc-roadmap.md` | 同頁先寫「嘉義（AP7）」後寫「抵達 P7 廠」，廠名不一致 | 統一為 AP7 |

## Agent B：跨頁矛盾與敘事修正（優先度：高）

| # | 檔案 | 問題 | 建議修正 |
|---|------|------|---------|
| B1 | `05-copos-overview.md` | Panel 層直接寫「常以玻璃作為核心材料」、結構圖標成「Glass Panel」、對照表寫「玻璃為主，或有機 RDL」——但 09 明確說**第一代 CoPoS 不一定用玻璃**（早期可先用有機基板配面板級 RDL，玻璃量產看 2030+）。核心頁與時程主頁互相矛盾 | 05 改為「早期世代以有機面板 RDL 為主，玻璃核心是後續升級（見 09）」；結構圖標籤改「面板級中介層（有機 RDL／玻璃）」；表格「中介層材料」欄同步調整 |
| B2 | `09-tsmc-roadmap.md` | 時程表「2027 Q3｜試產線設備下單」易誤讀——龍潭試產線 2026/6 已完成，此處指的是嘉義 AP7 量產線的設備 | 表格與內文改為「AP7 量產線設備下單」 |
| B3 | `09-tsmc-roadmap.md` | 內文連結 `[SoIC](11-copos-vs-alternatives.md)`，但 11 只在一句話裡順帶提到 SoIC，沒有解釋 | 改連 `appendix-glossary.md`（該處有 SoIC 定義），或在 11 補一句 SoIC 說明 |

## Agent C：Mermaid 渲染檢查（優先度：中）

以 `./serve-book.sh copos` 目視確認，只修真的壞的：

| # | 檔案 | 問題 | 建議修正 |
|---|------|------|---------|
| C1 | `11-copos-vs-alternatives.md` | `quadrantChart` 的軸標籤、象限標籤、點名稱全部帶雙引號（`x-axis "封裝面積小" --> …`、`"SoW-X": [0.9, 0.75]`）。quadrantChart 語法與 flowchart 不同，引號可能照字面渲染或解析失敗 | 目視確認；若壞，移除引號（quadrantChart 標籤不需要引號），並確認 `SoW-X` 含連字號的點名稱可解析 |
| C2 | `07-glass-substrate.md` | `G -. "數萬個 TGV<br/>貫穿玻璃" .- TGV1` 無箭頭虛線寫法，G 節點又懸掛在 subgraph 內無其他連線 | 目視確認剖面圖版面；若 G 位置怪，改為 `G --- TGV1` 或調整節點順序 |
| C3 | `02-packaging-basics.md` | 流程圖用 `C:::changed` + `classDef` 標藍色環節，內文說「藍色標記的三個環節」 | 目視確認三個節點確實染色；若沒生效，改在節點定義行內掛 class |

## Agent D：結構與收尾

| # | 位置 | 問題 | 建議修正 | 優先度 |
|---|------|------|---------|--------|
| D1 | 根目錄 `index.html` | **copos 完全沒有註冊進首頁卡片格**（grep 無任何 copos/CoPoS）——CLAUDE.md「新增書籍」步驟 4 沒做完，建好的書從首頁進不去 | 複製一個 `.card` 區塊到 `<!-- 新增書籍時在此複製一個 .card 區塊 -->` 註解前，連到 `book/copos/html/index.html` | **必做** |
| D2 | `00-plan.md` | 撰寫藍圖（給 agent 的規範）掛在讀者 nav 第二位 | 可保留（README 有導讀連結）；若要收，從 nav 移除、僅留 README 連結 | 低，選做 |
| D3 | 全書頁尾導覽 | 01–04 用「上一頁／下一頁」，05 起改用「相關頁面」，06 兩者皆無下一頁 | 統一頁尾格式（建議：全書都補「下一頁」+ 相關頁面） | 低，選做 |

## 驗收

1. 修正後 `uv run mkdocs build -f configs/copos.yml` 無警告。
2. `./serve-book.sh copos` 目視檢查 C1–C3 三張圖。
3. D1 完成後，開根目錄 `index.html` 確認 CoPoS 卡片可點進書。
4. A1、A2 的數字修正需附來源（TSMC 官方或 TrendForce/ECTC）。

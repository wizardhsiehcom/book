# CoWoS 書籍審閱改進計畫

> **狀態（2026-07-08）**：已執行完畢。
> - Agent A：A1–A7 全部完成。A1 經 NVIDIA 官方部落格證實（H100 SXM5 = 80 GB／five stacks），計算式改為 5 × ~670 GB/s；A2 經 Tom's Hardware／TechInsights 證實 Blackwell 用 CoWoS-L，04/05/06 三處歸類與定位全面改寫；A4 統一為「約 2,100 mm²（估計值）」；A6 放寬為「約百奈米以內」；A7 改為區間並標註文獻分歧。
> - Agent B：B1 經查證改寫（被動中介板 TSV 為先蝕孔填銅→正面 RDL→接合後背面薄化露出，02 的 Via-Last 歸類與 03 的步驟均修正）；B2、B3、B4 完成。
> - Agent C：C1 已拆成兩行宣告；C2 已重寫（刪頂部懸空三節點鏈，改用 subgraph id 直連）；C3 語法合法未改，`./serve-book.sh cowos` 目視覆核可選。
> - Agent D：D1–D3 完成（README 加「2026 年更新脈絡」、10 章結尾加 CoPoS 接棒指引、references 補 3 筆 2026 來源並更新整理時間）。
> - 建置通過無警告。

> 審閱範圍：`docs/cowos/` 全部 14 頁 + `configs/cowos.yml`。
> 建置狀態：`uv run mkdocs build -f configs/cowos.yml` 通過，無斷鏈、無 nav 警告。
> 整體評價：結構清楚（基礎 → CoWoS 核心 → AI 應用），頁面精煉、圖表密度高。主要問題：**一處明顯算術錯誤（07 章頻寬計算）**、**Blackwell 封裝歸類錯誤（B100 不是 CoWoS-S）**、H100 HBM 數量/容量的常見誤區、以及全書寫於 2025 年的時效落差（本書庫已有 2026 年的《CoPoS 面板級先進封裝筆記》可互連）。

## 工作流分派（可獨立平行執行）

---

## Agent A：規格數字查核（優先度：高）

逐項查核官方規格，修正時附來源。

| # | 檔案 | 問題 | 建議修正 |
|---|------|------|---------|
| A1 | `07-hbm-integration.md` | 「6 × 819 = 3,350 GB/s」——6 × 819 = 4,914，等號兩邊對不上。實情：H100 SXM5 實裝 6 個 HBM 位置但**只啟用 5 個**（第 6 顆為結構填充），且運行速率 ~5.2 Gbps（每顆 ~670 GB/s），5 × 670 ≈ 3.35 TB/s；819 GB/s 是 HBM3 規格上限（6.4 Gbps），H100 未跑滿 | 改寫計算式為「5 顆啟用 × ~670 GB/s ≈ 3.35 TB/s」，並加一句說明 819 是規格值、H100 降速運行 |
| A2 | `05-cowos-s.md`、`04-cowos-overview.md`、`06-cowos-r-l.md` | 把 B100 歸在 CoWoS-S（05：「H100、H200、B100 等採用」；04 表：「旗艦效能，H100 / B100」）。**NVIDIA Blackwell（B100/B200）用的是 CoWoS-L**，且 06 把 CoWoS-L 定位成「次世代中階 AI 卡」——實際上 CoWoS-L 已成為旗艦路線（面積可超越全矽中介板極限） | 05、04 移除 B100；06 的 CoWoS-L 代表產品改為「NVIDIA B200（Blackwell）」，定位敘述改寫：L 不是降級版，而是超大面積時代的旗艦選擇 |
| A3 | `07-hbm-integration.md`、`08-cowos-ai-hpc.md` | HBM 世代表：HBM3e 列「16 層」（量產為 8/12-high）、代表應用列「MI300X」（MI300X 用 HBM3，書中 08 章自己也寫 8× HBM3；用 HBM3e 的是 MI325X） | 層數改 8/12；代表應用改「H200、MI325X」 |
| A4 | `README.md`、`05-cowos-s.md`、`08-cowos-ai-hpc.md` | H100 中介板面積：README 寫「超過 2500 mm²」，05/08 寫「~2100 mm²」，自相矛盾 | 查證後全書統一（產業拆解估約 2,500 mm² 上下；擇一數字並標「估計」） |
| A5 | `08-cowos-ai-hpc.md` | H100 圖中 6 顆 HBM3 每顆標「80GB」——80 GB 是**總容量**（5 顆啟用 × 16 GB） | 圖改為每顆 16GB 或移除單顆標註，並與 A1 的「5 顆啟用」一致 |
| A6 | `10-reliability-manufacturing.md` | 「拼接處對準偏移 >10 nm 即斷路」——RDL 最細線寬 0.4 μm（400 nm），10 nm 容差不合理，實務 overlay 容差為數十至上百 nm | 查證後放寬數字或弱化為「奈米級對準要求」 |
| A7 | `08-cowos-ai-hpc.md` | 「GDDR6X ~15 pJ/bit、HBM3 ~3 pJ/bit、節省 ~80%」——量級方向對，但數字來源分歧大（GDDR6 常見引用 ~7–8 pJ/bit） | 標註「約值，各文獻估計不一」或改用區間 |

## Agent B：分類與敘事修正（優先度：高）

| # | 檔案 | 問題 | 建議修正 |
|---|------|------|---------|
| B1 | `02-tsv-basics.md`、`03-silicon-interposer-2d5.md` | 02 表格寫矽中介板用 Via-Last；03 製程步驟寫「1. 在矽晶圓上做 TSV（Via-Last，從背面薄化後形成）2. 正面做 RDL」——Via-Last 定義是**製程完成後**從背面開孔，步驟順序自相矛盾（先做 TSV 就不是 last） | 查證 TSMC 中介板實際流程（被動中介板無 FEOL，文獻多描述為先蝕孔填銅、後做 RDL、最後背面薄化露出），據此改寫 03 的步驟敘述，02 的分類註明「被動中介板的 via-first/middle/last 分類與主動晶片不同」 |
| B2 | `09-competing-technologies.md` | 表格標題「TSMC SoIC（3D CoWoS）」——SoIC 是獨立的 3D 堆疊技術，不是 CoWoS 的 3D 版 | 改為「TSMC SoIC」，刪去「3D CoWoS」 |
| B3 | `01-why-advanced-packaging.md` | 分類圖把 InFO-SoW 放在「2.5D 矽中介板」下——InFO-SoW 是扇出型晶圓級系統，無矽中介板 | 從 2.5D 節點移除，或另立 fan-out 分支 |
| B4 | `README.md` | 「6 個 HBM3 堆疊…總計超過 800 億顆電晶體」——GH100 為約 800 億（GPU 本身），且 HBM 為 5 顆啟用（配合 A1） | 改「約 800 億」並統一 HBM 敘述 |

## Agent C：Mermaid 渲染檢查（優先度：中）

以 `./serve-book.sh cowos` 目視確認，只修真的壞的：

| # | 檔案 | 問題 | 建議修正 |
|---|------|------|---------|
| C1 | `06-cowos-r-l.md` | 第二張圖開頭 `D1["Die A"] & D2["Die B"]` 是**無邊的獨立節點宣告用 `&` 串接**，mermaid 10 對此語法支援不確定 | 目視確認；若壞，拆成兩行宣告 |
| C2 | `00-map.md` | 頂部 `A["基礎觀念"] --> B --> C` 三個節點與下方三個同名 subgraph 並存，渲染出「懸空的三節點鏈 + 三個群組」，資訊重複、版面易亂 | 目視確認；建議刪掉頂部三節點鏈，直接用 subgraph 之間連線 |
| C3 | `08-cowos-ai-hpc.md` | H100 圖 7 個節點用 `&` 一次連到 INT（`GPU & H1 & … & H6 --> INT`），語法合法但版面可能過寬 | 目視確認手機寬度下的呈現即可 |

## Agent D：時效更新與內容補強（優先度：中）

| # | 檔案 | 問題 | 建議修正 |
|---|------|------|---------|
| D1 | `README.md`、`10-reliability-manufacturing.md`（或 05 結尾） | 全書寫於 2025 年（appendix-references 自述），缺 2025 之後的關鍵發展：CoWoS-L 成為 Blackwell 主力、面積路線圖推進至 9.5 倍 reticle「super carrier」（2027）、面板級 CoPoS 接棒 | 加一段「2026 年更新」：點出上述三事，並註明本書庫已有《CoPoS 面板級先進封裝筆記》承接後續故事（依書庫慣例書名互提、不跨站連結） |
| D2 | `08-cowos-ai-hpc.md` | MI300X 俯視圖只畫 IOD + HBM，沒畫 8 個 Compute Die（XCD 以 SoIC 堆在 IOD 上，不直接落在中介板）——圖意正確但讀者易誤解 | 圖上加一層或加註「8× XCD 以 3D 堆疊於 IOD 之上，故俯視只見 IOD」 |
| D3 | `appendix-references.md` | 「整理時間：2025 年」 | 更新為 2026-07，並視 D1 補 1–2 筆 2026 來源（TrendForce CoPoS/CoWoS 報導） |

## 驗收

1. 修正後 `uv run mkdocs build -f configs/cowos.yml` 無警告。
2. `./serve-book.sh cowos` 目視檢查 C1–C3。
3. A1–A4 每項修正附來源（NVIDIA/AMD 官方規格頁或可靠拆解報導）；B1 需引用製程文獻。
4. A1 修正後，README（B4）、05、07、08 四處的 H100 HBM 敘述（5 顆啟用 / 總 80 GB / 3.35 TB/s）完全一致。

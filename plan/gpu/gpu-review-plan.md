# GPU 書籍審閱改進計畫

> 審閱範圍：`docs/gpu/` 全部 23 頁 + `configs/gpu.yml`。
> 建置狀態：`uv run mkdocs build -f configs/gpu.yml` 通過，無斷鏈、無 nav 警告。
> 整體評價：結構完整（前提知識 → 架構 → 效能 → 競爭 → 消費級 → 加速器），交叉連結健全，語言風格一致。主要問題集中在**規格數字的準確性**與**少數頁內自相矛盾**。

## 工作流分派（可獨立平行執行）

---

## Agent A：規格數字查核（優先度：高）

逐項對照官方 datasheet / MLPerf 修正，注意 dense vs sparse 標註。

| # | 檔案 | 問題 | 建議修正 |
|---|------|------|---------|
| A1 | `performance/training-benchmarks.md`、`ai-accelerators/b200.md` | B200 FP8 標為 ~18,000 TFLOPS、FP4 ~36,000。NVIDIA 官方：FP8 約 4.5 PFLOPS dense（9 PFLOPS sparse）、FP4 約 9 PFLOPS dense（18 sparse）。現值約高估 2 倍 | 改為 FP8 ~9,000（sparse）/ FP4 ~18,000（sparse），並全書統一標註「含 sparsity」；H100 的 3,958 也是 sparse 值，需同步註明 |
| A2 | `performance/training-benchmarks.md` | MI325X 標 288 GB HBM3e。AMD 發表時宣稱 288 GB，實際出貨規格下修為 256 GB | 改 256 GB，或加註「發表規格，出貨版 256 GB」 |
| A3 | `architecture/memory-hierarchy.md` | 「HBM2e：2 TB/s，最多 80 GB（H100 SXM）」— H100 SXM 用 HBM3；HBM2e 80 GB 是 A100 | 例子改成 A100 80GB |
| A4 | `ai-accelerators/tpu-v5p.md` | TPU v5p BF16 標 918 TFLOPS。官方 BF16 為 459 TFLOPS（918 是 INT8） | 改 459，或分列 BF16 / INT8 |
| A5 | `ai-accelerators/tpu-v5p.md` | 「4,096 顆 TPU v5p 串成 Pod」— v5p Pod 上限為 8,960 chips（4,096 是 v4 的說法） | 改 8,960 |
| A6 | `ai-accelerators/b200.md` | 「8 個 B200 形成 1.4 TB/s All-to-All」與同頁 NVLink 5.0 = 1.8 TB/s 不一致 | 查證後統一（NVLink 5.0 每 GPU 1.8 TB/s） |
| A7 | `prerequisites/matrix-math.md` | 「FP8 3,958 TFLOPS 是 FP32 的約 30 倍」— 以 dense FP8（1,979）對 FP32（67）約 30 倍成立；以 sparse 值算則近 60 倍 | 配合 A1 的 dense/sparse 標註方式修正倍數敘述 |
| A8 | `performance/training-benchmarks.md` | AMD 欄「NVLink：不支援」誤導 — MI300X 有 Infinity Fabric（~896 GB/s） | 欄名改「GPU 間互連」，AMD 填 Infinity Fabric 頻寬 |

## Agent B：頁內矛盾與敘事修正（優先度：高）

| # | 檔案 | 問題 | 建議修正 |
|---|------|------|---------|
| B1 | `consumer/geforce.md` | 「部分型號的建議售價被批評比前代高」，但緊接的兩個例子（5080 \$999 vs 4080 \$1,199；5070 Ti \$749 vs 4070 Ti Super \$799）都是**降價** | 改寫：實際爭議是「MSRP 看似降價但市場買不到 MSRP 價」，與下段供應緊張的敘事銜接 |
| B2 | `consumer/market-shift.md` | 結尾 mermaid 把 RTX 5070（\$549）、RX 9070（\$549）放進「主流（\$200–\$400）」區間，與自身價格帶定義矛盾 | 調整價格帶（如主流 \$400–\$600）或移動卡片位置 |
| B3 | `ai-accelerators/custom-silicon.md` | 「Maia 主要用於 GPT-4 系列模型的推論服務」為未經證實的推測 | 弱化為「據報導用於 OpenAI 工作負載」 |
| B4 | `architecture/cuda-model.md` | 對應表「Block（含 32 Thread 的 Warp）」語意混亂 — Block 可含多個 Warp | 改為「Block（由若干 Warp 組成）」 |

## Agent C：Mermaid 渲染檢查（優先度：中）

| # | 檔案 | 問題 | 建議修正 |
|---|------|------|---------|
| C1 | `consumer/market-shift.md`（subgraph 標籤）、`consumer/rx9070xt.md`（節點標籤） | mermaid 程式碼區塊內使用 `\$749`、`> \$700` 等跳脫寫法。code fence 內反斜線不會被 Markdown 消費，會照字面渲染成 `\$` | 開發伺服器（`./serve-book.sh gpu`）目視確認；若確實顯示反斜線，把 mermaid 區塊內的 `\$` 全改為 `$`（一般內文的 `\$` 保留） |
| C2 | `ai-accelerators/mi300x.md` | 容量需求圖中 `M3`（405B）節點定義了對應的 `A3`/`N3` 但沒有連線，圖上會出現三個孤立節點 | 補 `M3 --> A3`、`M3 --> N3` 連線 |

## Agent D：內容補強（優先度：低，選做）

- D1 `performance/cost-analysis.md`：雲端價格表已標 2024–2025，建議加一句「本頁數字寫於 2025 年，僅供量級參考」的 admonition，全書其他含市場數字的頁面（market-shift、rx9070xt）比照。
- D2 `architecture/gpu-fundamentals.md`：Blackwell 段落與 `ai-accelerators/b200.md` 重疊，可縮為兩行並連結過去，符合「一頁一概念」。
- D3 `prerequisites/parallel-concepts.md` 與 `architecture/cuda-model.md` 都完整講了一次 Warp Divergence — 保留前提知識版的直覺解釋，cuda-model 版縮短並回鏈。

## 驗收

1. 修正後 `uv run mkdocs build -f configs/gpu.yml` 無警告。
2. `./serve-book.sh gpu` 目視檢查 C1/C2 兩張圖。
3. Agent A 每項修正需附來源（官方 datasheet 或 MLPerf 結果頁）。

# CS336 作業與課程資源整合計畫

本計畫管理 CS336 的作業、lecture materials、deadline、compute guidance 與課務規則。它不取代 `cs336-book-plan.md` 的逐字稿精讀流程，而是作為書稿的「材料關聯層」。

## 整合策略

建議採用「先佔位、後補材料」：

1. 先把網站上的作業與排程資訊整理成結構化表格。
2. 每章主稿只放簡短的「相關作業與材料」提示，不直接展開 handout 或解答。
3. 材料已下載到 `data/` 後，先補本地路徑與閱讀狀態；未讀前不可把內容寫成已確認理解。
4. 所有 assignment 都只整理學習目標、實作範圍、對應章節與讀者應建立的能力，不寫作業解答。
5. compute 價格、deadline、課務規則容易過期；正式引用前需重新查核。此處先保留為網站資訊摘錄與整合佔位。

## 資訊不足處理規則

本材料計畫的優先級是可追溯性，不是表格看起來完整。若資料不足，必須保留缺口。

- 若本地 `data/` 沒有材料，標 `待下載` 或 `待補路徑`。
- 若只有網站摘錄但沒有 URL，標 `待補 URL`。
- 若材料名稱、講次、作業版本或 optional part 無法確認，標 `待查`。
- 若價格、deadline、policy 可能變動，標註摘錄日期或 `待重新查核`。
- 若沒有官方 handout/code/preview/slides，不可用常識補出內容。
- 若 agent 無法存取網路或搜尋不到可靠來源，必須請使用者提供檔案或 URL。

後續 worker 處理材料時，最終回報必須列出：

1. 已讀取的本地材料路徑。
2. 仍缺少的材料。
3. 需要使用者提供的檔案或 URL。
4. 哪些資訊只是網站摘錄，尚未查核。

## 本地材料位置

目前已偵測到你補充的材料：

```text
data/cs336/
  code/
    assignment1-basics-main/
    assignment2-systems-main/
    assignment3-scaling-main/
    assignment4-data-main/
    assignment5-alignment-main/
  lectures material/
```

處理規則：

- `code/assignment*-main/` 視為 assignment handout/code/test 的本地來源。
- `lectures material/` 視為 lecture code/slides/images/traces 的本地來源。
- 目前只更新路徑與狀態，不代表已完整閱讀這些材料。
- 不要下載大型 Common Crawl dump 或訓練資料；若 assignment 需要大型資料，只記錄取得方式與用途。

## 作業總覽

| 作業 | 主題 | 學習目標 | 對應章節 | 材料狀態 |
|---|---|---|---|---|
| Assignment 1 | Basics | 實作 BPE tokenizer、Transformer LM 架構、訓練元件、optimizer、資料 loader、checkpointing 與 text generation | 01-03、部分 06 | 已核對 README、PDF outline、tests/adapters：`data/cs336/code/assignment1-basics-main/`；PDF：`cs336_assignment1_basics.pdf`；未完整閱讀 handout |
| Assignment 2 | Systems | profile/benchmark A1 模型與 layers；實作 memory-efficient attention、DDP、FSDP 與 optimizer state sharding | 05-08、10 | 已核對 README、PDF outline、tests/adapters：`data/cs336/code/assignment2-systems-main/`；PDF：`cs336_assignment2_systems.pdf`；未完整閱讀 handout |
| Assignment 3 | Scaling | 使用 training API 執行小模型實驗，從 IsoFLOPs / scaling law 建立 loss projection 與最終提交 | 03、09、11 | 已核對 README、PDF outline、API/test 檔案：`data/cs336/code/assignment3-scaling-main/`；PDF：`cs336_assignment3_scaling.pdf`；未完整閱讀 handout |
| Assignment 4 | Data | 將 Common Crawl WET/HTML 等原始資料轉成可訓練資料；實作 HTML extraction、language ID、PII masking、toxicity/quality filtering、Gopher rules、exact / MinHash deduplication，並用固定 training code 訓練 LM | 12-14 | 已核對 README、PDF outline、tests/adapters：`data/cs336/code/assignment4-data-main/`；PDF：`cs336_assignment4_data.pdf`；未完整閱讀 handout |
| Assignment 5 | Alignment and Reasoning RL | 使用 prompting / vLLM / grading function 建立 reasoning RL 實驗；實作 GRPO 與變體、off-policy reweighting、policy-gradient loss、microbatch aggregation；optional supplement 涵蓋 SFT、MMLU/GSM8K/AlpacaEval/SimpleSafetyTests、DPO 與 safety RLHF | 15-17 | 已核對 README、PDF outline、tests/adapters：`data/cs336/code/assignment5-alignment-main/`；PDF：`cs336_spring2026_assignment5_alignment.pdf`、`cs336_spring2026_assignment5_supplement_safety_rlhf.pdf`；未完整閱讀 handout |

## Batch 5-1 本地材料核對（Lecture 1-9）

| 範圍 | 本地檔案 | 檔案用途 | 已讀狀態 |
|---|---|---|---|
| Lecture 1 | `data/cs336/lectures material/lecture_01.py`；`data/cs336/lectures material/var/traces/lecture_01.json` | executable lecture；trace | Batch M1b 已讀 lecture code 並整理至 `appendix-materials.md`；trace 僅查存在性，未完整閱讀 |
| Lecture 2 | `data/cs336/lectures material/lecture_02.py`；`data/cs336/lectures material/var/traces/lecture_02.json`；`data/cs336/lectures material/var/traces/lecture_02_recording.json` | executable lecture；trace / recording trace | Batch M1b 已讀 lecture code 並整理至 `appendix-materials.md`；trace 僅查存在性，未完整閱讀 |
| Lecture 3 | `data/cs336/lectures material/lecture_03.pdf` | non-executable slides；67 pages；author metadata 為 Tatsu Hashimoto | Batch M2b 已讀 PDF stream 並整理至 `appendix-materials.md`；圖像截圖與公式排版未人工校對 |
| Lecture 4 | `data/cs336/lectures material/lecture_04.pdf` | non-executable slides；60 pages；author metadata 為 Tatsu Hashimoto | Batch M2b 已讀 PDF stream 並整理至 `appendix-materials.md`；圖像截圖與公式排版未人工校對 |
| Lecture 5 | `data/cs336/lectures material/lecture_05.pdf` | non-executable slides；55 pages；author metadata 為 Tatsu Hashimoto | Batch M2b 已讀 PDF stream 並整理至 `appendix-materials.md`；圖像截圖與公式排版未人工校對 |
| Lecture 6 | `data/cs336/lectures material/lecture_06.py`；`data/cs336/lectures material/var/traces/lecture_06.json`；`data/cs336/lectures material/var/triton_gelu-ptx.txt` | executable lecture；trace；Triton/PTX 參考輸出 | Batch M1b 已讀 lecture code 並整理至 `appendix-materials.md`；trace/PTX 僅查存在性，未完整閱讀 |
| Lecture 7 | `data/cs336/lectures material/lecture_07.py`；`data/cs336/lectures material/var/traces/lecture_07.json`；`data/cs336/lectures material/var/traces/lecture_07_stdout.txt` | executable lecture；trace；stdout | Batch M1b 已讀 lecture code 並整理至 `appendix-materials.md`；trace/stdout 僅查存在性，未完整閱讀 |
| Lecture 8 | `data/cs336/lectures material/lecture_08.pdf` | non-executable slides；73 pages；author metadata 為 Tatsu Hashimoto | Batch M2b 已讀 PDF stream 並整理至 `appendix-materials.md`；圖像截圖與公式排版未人工校對 |
| Lecture 9 | `data/cs336/lectures material/lecture_09.pdf` | non-executable slides；57 pages；author metadata 為 Tatsu Hashimoto | Batch M2b 已讀 PDF stream 並整理至 `appendix-materials.md`；圖像截圖與公式排版未人工校對 |
| Assignment 1 | `data/cs336/code/assignment1-basics-main/README.md`；`cs336_assignment1_basics.pdf`；`tests/adapters.py`；`tests/test_*.py` | handout/code/test；adapter 介面顯示 tokenizer、Transformer、optimizer、training utilities 範圍 | 已核對 README、PDF outline、測試介面；未完整閱讀 handout |
| Assignment 2 | `data/cs336/code/assignment2-systems-main/README.md`；`cs336_assignment2_systems.pdf`；`cs336-basics/`；`cs336_systems/`；`tests/adapters.py`；`tests/test_*.py` | handout/code/test；A1 staff implementation、systems module、FlashAttention/DDP/FSDP/sharded optimizer 測試 | 已核對 README、PDF outline、測試介面；未完整閱讀 handout |
| Assignment 3 | `data/cs336/code/assignment3-scaling-main/README.md`；`cs336_assignment3_scaling.pdf`；`cs336_scaling/`；`data/isoflops_curves.json`；`examples/`；`tests/` | handout/API/server/client/test；training API、budget、experiment、final submission 與 IsoFLOPs data | 已核對 README、PDF outline、API/test 檔案；未完整閱讀 handout |

## Batch 5-2 本地材料核對（Lecture 10-18）

| 範圍 | 本地檔案 | 檔案用途 | 已讀狀態 |
|---|---|---|---|
| Lecture 10 | `data/cs336/lectures material/lecture_10.py`；`data/cs336/lectures material/var/traces/lecture_10.json` | executable lecture；trace | Batch M1b 已讀 lecture code 並整理至 `appendix-materials.md`；trace 僅查存在性，未完整閱讀 |
| Lecture 11 | `data/cs336/lectures material/lecture_11.pdf` | non-executable slides；58 pages；author metadata 為 Tatsu Hashimoto | Batch M2b 已讀 PDF stream 並整理至 `appendix-materials.md`；圖像截圖與公式排版未人工校對 |
| Lecture 12 | `data/cs336/lectures material/lecture_12.py`；`data/cs336/lectures material/var/traces/lecture_12.json` | executable lecture；trace | Batch M1b 已讀 lecture code 並整理至 `appendix-materials.md`；trace 僅查存在性，未完整閱讀 |
| Lecture 13 | `data/cs336/lectures material/lecture_13.py`；`data/cs336/lectures material/var/traces/lecture_13.json` | executable lecture；trace | Batch M1b 已讀 lecture code 並整理至 `appendix-materials.md`；trace 僅查存在性，未完整閱讀 |
| Lecture 14 | `data/cs336/lectures material/lecture_14.py`；`data/cs336/lectures material/var/traces/lecture_14.json` | executable lecture；trace | Batch M1b 已讀 lecture code 並整理至 `appendix-materials.md`；trace 僅查存在性，未完整閱讀 |
| Lecture 15 | `data/cs336/lectures material/lecture_15.pdf` | non-executable slides；65 pages；author metadata 為 Tatsu Hashimoto | Batch M2b 已讀 PDF stream 並整理至 `appendix-materials.md`；圖像截圖與公式排版未人工校對 |
| Lecture 16 | `data/cs336/lectures material/lecture_16.pdf` | non-executable slides；61 pages；author metadata 為 Tatsu Hashimoto | Batch M2b 已讀 PDF stream 並整理至 `appendix-materials.md`；圖像截圖與公式排版未人工校對 |
| Lecture 17 | `data/cs336/lectures material/lecture_17.py`；`data/cs336/lectures material/var/traces/lecture_17.json` | executable lecture；trace | Batch M1b 已讀 lecture code 並整理至 `appendix-materials.md`；trace 僅查存在性，未完整閱讀 |
| Lecture 18 | 待補 | 本地未見 `lecture_18.*` 或 guest lecture 專用材料 | 待補 |
| Assignment 4 | `data/cs336/code/assignment4-data-main/README.md`；`cs336_assignment4_data.pdf`；`tests/adapters.py`；`tests/test_*.py`；`configs/`；`scripts/` | handout/code/test；data extraction、filtering、PII、toxicity/quality、deduplication、training data filtering | 已核對 README、PDF outline、測試介面；未完整閱讀 handout |
| Assignment 5 | `data/cs336/code/assignment5-alignment-main/README.md`；`cs336_spring2026_assignment5_alignment.pdf`；`cs336_spring2026_assignment5_supplement_safety_rlhf.pdf`；`tests/adapters.py`；`tests/test_*.py`；`data/`；`prompts*` | handout/code/test；reasoning RL、GRPO variants、SFT、DPO、safety/eval prompts and data | 已核對 README、PDF outline、測試介面；未完整閱讀 handout |

## 課程排程與材料關聯

| # | 日期 | 課程主題 | Course materials | Deadline / 作業事件 | 對應章節 | 本地材料 |
|---:|---|---|---|---|---|---|
| 1 | Mon March 30 | Overview, tokenization [Percy] | `lecture_01.py` | Assignment 1 out；code；preview | 01 | 已核對：`data/cs336/lectures material/lecture_01.py`；trace：`data/cs336/lectures material/var/traces/lecture_01.json` |
| 2 | Wed April 1 | PyTorch (einops), resource accounting [Percy] | `lecture_02.py` recording version |  | 02 | 已核對：`data/cs336/lectures material/lecture_02.py`；traces：`lecture_02.json`、`lecture_02_recording.json` |
| 3 | Mon April 6 | Architectures, hyperparameters [Tatsu] | `lecture 3.pdf` |  | 03 | 已核對：`data/cs336/lectures material/lecture_03.pdf` |
| 4 | Wed April 8 | Attention alternatives and mixture of experts [Tatsu] | `lecture 4.pdf` |  | 04 | 已核對：`data/cs336/lectures material/lecture_04.pdf` |
| 5 | Mon April 13 | GPUs, TPUs [Tatsu] | `lecture 5.pdf` |  | 05 | 已核對：`data/cs336/lectures material/lecture_05.pdf` |
| 6 | Wed April 15 | Kernels, Triton [Percy] | `lecture_06.py` | Assignment 1 due；Assignment 2 out；code；preview | 06 | 已核對：`data/cs336/lectures material/lecture_06.py`；trace：`data/cs336/lectures material/var/traces/lecture_06.json`；PTX：`data/cs336/lectures material/var/triton_gelu-ptx.txt` |
| 7 | Mon April 20 | Parallelism [Percy] | `lecture_07.py` |  | 07 | 已核對：`data/cs336/lectures material/lecture_07.py`；trace/stdout：`data/cs336/lectures material/var/traces/lecture_07.json`、`lecture_07_stdout.txt` |
| 8 | Wed April 22 | Parallelism [Tatsu] | `lecture_08.pdf` |  | 08 | 已核對：`data/cs336/lectures material/lecture_08.pdf` |
| 9 | Mon April 27 | Scaling laws [Tatsu] | `lecture_09.pdf` |  | 09 | 已核對：`data/cs336/lectures material/lecture_09.pdf` |
| 10 | Wed April 29 | Inference [Percy] | `lecture_10.py` | Assignment 2 due；Assignment 3 out；code；preview | 10 | 已核對：`data/cs336/lectures material/lecture_10.py`；trace：`data/cs336/lectures material/var/traces/lecture_10.json` |
| 11 | Mon May 4 | Scaling laws [Tatsu] | `lecture_11.pdf` |  | 11 | 已核對：`data/cs336/lectures material/lecture_11.pdf` |
| 12 | Wed May 6 | Evaluation [Percy] | `lecture_12.py` | Assignment 3 due；Assignment 4 out；code；preview | 12 | 已核對：`data/cs336/lectures material/lecture_12.py`；trace：`data/cs336/lectures material/var/traces/lecture_12.json` |
| 13 | Mon May 11 | Data: sources, datasets [Percy] | `lecture_13.py` |  | 13 | 已核對：`data/cs336/lectures material/lecture_13.py`；trace：`data/cs336/lectures material/var/traces/lecture_13.json` |
| 14 | Wed May 13 | Data: filtering, deduplication, mixing, synthetic data [Percy] | `lecture_14.py` |  | 14 | 已核對：`data/cs336/lectures material/lecture_14.py`；trace：`data/cs336/lectures material/var/traces/lecture_14.json` |
| 15 | Mon May 18 | Mid/post-training: SFT/RLHF [Tatsu] | `lecture_15.pdf` |  | 15 | 已核對：`data/cs336/lectures material/lecture_15.pdf` |
| 16 | Wed May 20 | Post-training: RLVR [Tatsu] | `lecture_16.pdf` | Assignment 4 due；Assignment 5 out；code；preview；Optional Part 2 | 16 | 已核對：`data/cs336/lectures material/lecture_16.pdf` |
| 17 | Wed May 27 | Alignment - multimodality [Percy] | `lecture_17.py` |  | 17 | 已核對：`data/cs336/lectures material/lecture_17.py`；trace：`data/cs336/lectures material/var/traces/lecture_17.json` |
| 18 | Mon June 1 | Guest lecture: Daniel Selsam | 待補 |  | 待定 | 本地未見 `lecture_18.*`，待補 |
| 19 | Wed June 3 | Guest lecture: Dan Fu | 待補 | Assignment 5 due | 18 | 本地未見 guest lecture material，待補 |

## Compute Guidance 佔位

網站提供自學者可使用雲端 GPU 完成 assignments 的方向，並列出 2026-03-28 單張 B200 GPU 公開價格範例：

| Provider | 網站摘錄價格 | 備註 | 查核狀態 |
|---|---:|---|---|
| Modal | $6.25/hour | sponsor；每月 $30 free compute；依實際 compute 計費 | 未查核，先作網站摘錄 |
| Lambda Labs | $6.69/hour |  | 未查核，先作網站摘錄 |
| RunPod | $4.99/hour |  | 未查核，先作網站摘錄 |
| Nebius | $5.50/hour；preemptible $3.05/hour |  | 未查核，先作網站摘錄 |
| Together | $7.49/hour；minimum 8 GPUs | 長期承諾較便宜 | 未查核，先作網站摘錄 |

書稿處理方式：

- 技術章節只保留原則：先用 CPU debug correctness，再用 GPU 做 training runs 或 GPU benchmarks。
- 價格資訊不放入正式建議，除非後續重新查證。
- assignment 章節可加入「資源預算思維」，連回 Lecture 2、5、6、7、8。

## 課務規則佔位

這些資訊適合放入附錄，不應混進技術章節：

- Honor code：允許 study group，但每位學生需理解並完成自己的作業。
- AI tools：允許低階程式問題或高階概念問題；禁止直接用 LLM 解題；建議關閉 AI autocomplete。
- Existing code：handout 應自包含，除非指定，不應查閱第三方既有實作。
- Submission：Gradescope 提交；可多次提交，以最後一次為準；partial work 比不交好。
- Late days：每位學生 6 天；每份作業最多 3 天。
- Regrade：成績發布後 3 天內可在 Gradescope 提出客觀錯誤複查。
- Sponsor：Modal sponsor compute。

## 章節內佔位格式

各章後續可加入短段落：

```markdown
## 相關作業與材料

- Course material：待補 `data/...`
- Assignment 關聯：Assignment X，重點是 ...
- 本章只整理能力要求，不提供作業解答。
```

## 後續工作

1. 已依 `plan/cs336-course-material-agent-plan.md` 完成第一輪 M1b/M2b/M3/M4a/M4b：lecture code、PDF slides、assignment outline、traces/stdout/PTX、assets/images 已整理進 `docs/cs336-language-modeling/` 附錄。
2. 讀者現在可先看 `appendix-materials.md`、`appendix-coursework.md`、`appendix-course-admin.md` 掌握材料用途；本地 `data/` 作為可追溯來源。
3. Batch M7 已先完成圖表 triage：`appendix-materials.md` 新增「圖表優先清單」，把可重畫的概念圖與不宜直接使用的 leaderboard、平台截圖、社群媒體圖、廠商圖、論文圖分開。
4. Batch M8 第一輪最小入書已完成：第 1 章以 Mermaid 重畫 tokenizer 流程，第 2 章以 Markdown 表格重畫 FP32/FP16/BF16 對照與 compute/memory 邊界，第 6 章以 Mermaid 重畫 Triton block-level 資料流，第 7 章以 Markdown 表格重畫 parallelism 策略比較，第 9 章以 Markdown 表格重畫 Chinchilla 方法比較，第 10 章以 Mermaid 重畫 inference lifecycle 並以 Markdown 表格重畫 MLA / speculative decoding / PagedAttention 對照，第 12 章以 Markdown 表格替代 leaderboard / benchmark 截圖，第 13 章以 Markdown 表格整理資料集演進，第 14 章以 Mermaid 重畫 raw/target filtering，第 17 章以 Markdown 表格重畫多模態路線比較；未直接使用原圖片。
5. Batch M8 收尾已更新 `00-plan.md` 與術語表，讓讀者可從書內掌握材料狀態與新增圖表術語。
6. 下一輪若要把更多素材變成章節內圖表，需逐張做來源、授權、caption、截圖清晰度與重畫稿確認；未查核前不得直接放入正文。
7. 若要引用 trace/stdout/PTX 的具體數字，需補執行環境、日期與硬體條件。

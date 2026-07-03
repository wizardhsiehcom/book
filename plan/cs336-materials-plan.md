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
data/Stanford CS336 Language Modeling from Scratch/
  code/
    assignment1-basics-main/
    assignment2-systems-main/
    assignment3-scaling-main/
    assignment4-data-main/
    assignment5-alignment-main/
  cs336_materials/
    lectures-main/
```

處理規則：

- `code/assignment*-main/` 視為 assignment handout/code/test 的本地來源。
- `cs336_materials/lectures-main/` 視為 lecture code/slides/images/traces 的本地來源。
- 目前只更新路徑與狀態，不代表已完整閱讀這些材料。
- 不要下載大型 Common Crawl dump 或訓練資料；若 assignment 需要大型資料，只記錄取得方式與用途。

## 作業總覽

| 作業 | 主題 | 學習目標 | 對應章節 | 材料狀態 |
|---|---|---|---|---|
| Assignment 1 | Basics | 實作 tokenizer、model architecture、optimizer，訓練 minimal Transformer LM | 01-03、部分 06 | 已下載，待閱讀：`data/Stanford CS336 Language Modeling from Scratch/code/assignment1-basics-main/`；PDF：`cs336_assignment1_basics.pdf` |
| Assignment 2 | Systems | profile/benchmark A1 模型與 layers；用 Triton 實作 FlashAttention2；建立 memory-efficient distributed training | 05-08、10 | 已下載，待閱讀：`data/Stanford CS336 Language Modeling from Scratch/code/assignment2-systems-main/`；PDF：`cs336_assignment2_systems.pdf` |
| Assignment 3 | Scaling | 理解 Transformer 各元件；查詢 training API，fit scaling law 並做 scaling projection | 03、09、11 | 已下載，待閱讀：`data/Stanford CS336 Language Modeling from Scratch/code/assignment3-scaling-main/`；PDF：`cs336_assignment3_scaling.pdf` |
| Assignment 4 | Data | 將 raw Common Crawl dumps 轉成 pretraining data；做 filtering 與 deduplication 改善模型 | 12-14 | 已下載，待閱讀：`data/Stanford CS336 Language Modeling from Scratch/code/assignment4-data-main/`；PDF：`cs336_assignment4_data.pdf` |
| Assignment 5 | Alignment and Reasoning RL | 用 SFT 與 RL 訓練 LM 做數學推理；Optional Part 2 包含 DPO 等 safety alignment | 15-17 | 已下載，待閱讀：`data/Stanford CS336 Language Modeling from Scratch/code/assignment5-alignment-main/`；PDF：`cs336_spring2026_assignment5_alignment.pdf`、`cs336_spring2026_assignment5_supplement_safety_rlhf.pdf` |

## 課程排程與材料關聯

| # | 日期 | 課程主題 | Course materials | Deadline / 作業事件 | 對應章節 | 本地材料 |
|---:|---|---|---|---|---|---|
| 1 | Mon March 30 | Overview, tokenization [Percy] | `lecture_01.py` | Assignment 1 out；code；preview | 01 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_01.py`；trace：`var/traces/lecture_01.json` |
| 2 | Wed April 1 | PyTorch (einops), resource accounting [Percy] | `lecture_02.py` recording version |  | 02 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_02.py`；traces：`lecture_02.json`、`lecture_02_recording.json` |
| 3 | Mon April 6 | Architectures, hyperparameters [Tatsu] | `lecture 3.pdf` |  | 03 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_03.pdf` |
| 4 | Wed April 8 | Attention alternatives and mixture of experts [Tatsu] | `lecture 4.pdf` |  | 04 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_04.pdf` |
| 5 | Mon April 13 | GPUs, TPUs [Tatsu] | `lecture 5.pdf` |  | 05 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_05.pdf` |
| 6 | Wed April 15 | Kernels, Triton [Percy] | `lecture_06.py` | Assignment 1 due；Assignment 2 out；code；preview | 06 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_06.py`；trace：`var/traces/lecture_06.json` |
| 7 | Mon April 20 | Parallelism [Percy] | `lecture_07.py` |  | 07 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_07.py`；trace/stdout：`var/traces/lecture_07.json`、`lecture_07_stdout.txt` |
| 8 | Wed April 22 | Parallelism [Tatsu] | `lecture_08.pdf` |  | 08 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_08.pdf` |
| 9 | Mon April 27 | Scaling laws [Tatsu] | `lecture_09.pdf` |  | 09 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_09.pdf` |
| 10 | Wed April 29 | Inference [Percy] | `lecture_10.py` | Assignment 2 due；Assignment 3 out；code；preview | 10 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_10.py`；trace：`var/traces/lecture_10.json` |
| 11 | Mon May 4 | Scaling laws [Tatsu] | `lecture_11.pdf` |  | 11 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_11.pdf` |
| 12 | Wed May 6 | Evaluation [Percy] | `lecture_12.py` | Assignment 3 due；Assignment 4 out；code；preview | 12 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_12.py`；trace：`var/traces/lecture_12.json` |
| 13 | Mon May 11 | Data: sources, datasets [Percy] | `lecture_13.py` |  | 13 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_13.py`；trace：`var/traces/lecture_13.json` |
| 14 | Wed May 13 | Data: filtering, deduplication, mixing, synthetic data [Percy] | `lecture_14.py` |  | 14 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_14.py`；trace：`var/traces/lecture_14.json` |
| 15 | Mon May 18 | Mid/post-training: SFT/RLHF [Tatsu] | `lecture_15.pdf` |  | 15 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_15.pdf` |
| 16 | Wed May 20 | Post-training: RLVR [Tatsu] | `lecture_16.pdf` | Assignment 4 due；Assignment 5 out；code；preview；Optional Part 2 | 16 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_16.pdf` |
| 17 | Wed May 27 | Alignment - multimodality [Percy] | `lecture_17.py` |  | 17 | 已下載，待閱讀：`cs336_materials/lectures-main/lecture_17.py`；trace：`var/traces/lecture_17.json` |
| 18 | Mon June 1 | Guest lecture: Daniel Selsam | 待補 |  | 待定 | 待補 |
| 19 | Wed June 3 | Guest lecture: Dan Fu | 待補 | Assignment 5 due | 18 | 待補 |

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

1. 建立一輪材料 worker，先讀各 assignment 的 PDF/README，只整理學習目標與章節關聯，不寫解答。
2. 建立一輪 lecture material worker，按講次讀 `lecture_XX.py` 或 `lecture_XX.pdf`，只補「相關材料」與圖表候選，不覆蓋逐字稿主線。
3. 在每章加入簡短「相關作業與材料」段落。
4. 全部章節初稿完成後，再決定是否新增正式附錄頁：
   - `appendix-coursework.md`
   - `appendix-materials.md`
   - `appendix-compute.md`

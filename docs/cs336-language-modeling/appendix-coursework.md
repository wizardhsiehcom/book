# 作業與能力檢核

本附錄整理 CS336 Assignment 1-5 的學習目標、實作範圍與章節關聯。它只幫助讀者理解課程如何訓練能力，不提供作業解答、測試答案、可提交程式碼或具體解題步驟。

## 作業總覽

### Assignment 1：Basics

- 本地路徑：`data/cs336/code/assignment1-basics-main/`
- 已讀材料：`README.md`、`cs336_assignment1_basics.pdf` outline、`tests/adapters.py`、`tests/test_*.py`
- 學習目標：從零建立 tokenizer、Transformer LM、訓練元件、optimizer、checkpoint、資料 batch 與文字生成的基本堆疊。
- 實作範圍：BPE training / encode / decode、Transformer block 與 LM、RMSNorm / RoPE / SwiGLU / attention、softmax / cross-entropy、AdamW、learning-rate schedule、gradient clipping、checkpoint 與 data loader。
- 對應章節：[第 1 章](01-overview-tokenization.md)、[第 2 章](02-pytorch-einops.md)、[第 3 章](03-architectures.md)；補充連到[第 6 章](06-kernels-triton-xla.md)、[第 10 章](10-inference.md)。
- 能力檢核：能說明 tokenizer 與模型介面的邊界；能檢查 tensor shape、masking、optimizer state、training loop 與 checkpoint 是否一致。
- 解答風險：不放 adapter 實作、測試 snapshot、fixture 期望輸出、BPE merge 細節或可提交程式。

### Assignment 2：Systems

- 本地路徑：`data/cs336/code/assignment2-systems-main/`
- 已讀材料：`README.md`、`cs336_assignment2_systems.pdf` outline、`tests/adapters.py`、`tests/test_*.py`
- 學習目標：把 A1 模型放進系統效能脈絡，理解 profiling、memory、kernel fusion、attention 最佳化與分散式訓練。
- 實作範圍：FlashAttention 類介面、DDP、FSDP、mixed precision hooks、full parameter gather、sharded optimizer。
- 對應章節：[第 5 章](05-gpus-tpus.md)、[第 6 章](06-kernels-triton-xla.md)、[第 7 章](07-parallelism-i.md)、[第 8 章](08-parallelism-ii.md)、[第 10 章](10-inference.md)。
- 能力檢核：能判斷模型瓶頸在 compute、memory 或 communication；能檢查 gradient sync、parameter sharding、optimizer state sharding 的行為是否一致。
- 解答風險：不放 FlashAttention forward/backward、DDP/FSDP wrapper、同步條件、snapshot 或 fixture 細節。

### Assignment 3：Scaling

- 本地路徑：`data/cs336/code/assignment3-scaling-main/`
- 已讀材料：`README.md`、`cs336_assignment3_scaling.pdf` outline、`tests/test_api.py`、`tests/test_scheduler.py`
- 學習目標：用受預算限制的 training API 建立 scaling-law 實驗直覺，從 IsoFLOPs 曲線與實驗結果推估 loss。
- 實作範圍：提交 training config、查詢 budget / experiments、處理 final submission、理解 scheduler 如何選擇 queued experiments。
- 對應章節：[第 3 章](03-architectures.md)、[第 9 章](09-scaling-laws-i.md)、[第 11 章](11-scaling-laws-ii.md)。
- 能力檢核：能把模型大小、compute budget、runtime、validation loss 與最終預測連成同一個實驗設計問題。
- 解答風險：不放具體提交參數、final predicted loss、API key / host 操作細節，或可反推提交策略的 scheduler 測試細節。

### Assignment 4：Data

- 本地路徑：`data/cs336/code/assignment4-data-main/`
- 已讀材料：`README.md`、`cs336_assignment4_data.pdf` outline、`tests/adapters.py`、`tests/test_*.py`
- 學習目標：理解從 Common Crawl 類原始資料到可訓練語料的清理、過濾、去重與訓練資料選擇流程。
- 實作範圍：HTML extraction、language ID、email / phone / IP masking、NSFW / toxic / quality classification、Gopher quality filter、exact line dedup、MinHash dedup、用固定 training code 訓練資料版本。
- 對應章節：[第 12 章](12-evaluation.md)、[第 13 章](13-data-sources-datasets.md)、[第 14 章](14-data-pipeline-quality.md)。
- 能力檢核：能說明每個 filter 解決的資料風險；能區分 quality、toxicity、PII、deduplication 與 downstream training impact。
- 解答風險：不放 regex / filter threshold 實作、分類器 adapter、dedup 測試 fixture，或可直接產生 leaderboard 資料的 pipeline 細節。

### Assignment 5：Alignment

- 本地路徑：`data/cs336/code/assignment5-alignment-main/`
- 已讀材料：`README.md`、`cs336_spring2026_assignment5_alignment.pdf` outline、`cs336_spring2026_assignment5_supplement_safety_rlhf.pdf` outline、`tests/adapters.py`、`tests/test_*.py`
- 學習目標：理解 reasoning RL 與 alignment evaluation 的基本工作流，從 prompt / eval 進到 GRPO、off-policy reweighting、DPO 與 safety 評估。
- 實作範圍：prompt/output tokenization、response log-probs、rollout reward、group-normalized rewards、policy-gradient loss、microbatch aggregation、GRPO train step、SFT packing / batching、MMLU / GSM8K parsing、DPO loss。
- 對應章節：[第 12 章](12-evaluation.md)、[第 15 章](15-mid-post-training.md)、[第 16 章](16-post-training-rlvr.md)、[第 17 章](17-alignment-multimodality.md)。
- 能力檢核：能區分 prompting、supervised fine-tuning、preference optimization、on-policy / off-policy RL 與 safety eval 的角色。
- 解答風險：不放 reward / loss 的可提交實作、GRPO/DPO adapter、測試 snapshot、prompt templates、資料集樣本或可重現實驗提交的細節。

## Honor-code-safe 原則

- 可整理：學習目標、實作範圍、使用到的章節概念、讀者應能檢查自己的能力。
- 不可整理：逐題解法、測試期望輸出、可直接提交的函式實作、繞過作業限制的方法。
- 若 handout 或測試透露過多細節，附錄只保留抽象能力要求。

## 待補

- 本附錄目前採 README、PDF outline、adapter/test 範圍整理；handout 正文尚未逐段濃縮。
- Optional safety RLHF supplement 目前只作能力索引；若要展開，需另批確認不涉及解答。

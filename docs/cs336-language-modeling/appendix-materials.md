# 課程材料索引

本附錄整理本地 `data/cs336/lectures material/` 中的 lecture code、slides、trace、assets 與輸出檔。它的用途是讓讀者知道每份材料補充了哪一章、適合怎麼閱讀，以及哪些材料仍待補。

本頁只整理材料用途與章節關聯，不取代逐字稿主線。

## 閱讀狀態

| 範圍 | 狀態 |
|---|---|
| Executable lectures | 已由 Batch M1b 讀取 lecture code；trace 只查存在性，未完整閱讀 |
| PDF slides | 已由 Batch M2b 讀取 PDF stream；頁數用本地工具確認，公式與圖表候選仍需人工截圖校對 |
| Traces / stdout / PTX | 已由 Batch M4a 盤點；只整理結構、規模與用途，不全文內嵌 |
| Assets / images | 已由 Batch M4b 盤點；只列圖表候選池，未做逐張授權查核 |

## 逐講索引

### Executable Lectures

| 講次 | 本地路徑 | 材料用途 | 可確認重點 | trace / assets 狀態 | 待補 |
|---:|---|---|---|---|---|
| [1](01-overview-tokenization.md) | `data/cs336/lectures material/lecture_01.py` | 課程總覽與 tokenization 可執行示範 | 建構式理解；效率 = 資源 × 演算法；課程分 basics / systems / scaling / data / alignment；實作 char、byte、word、BPE tokenizer | images 存在；`var/gpt5_tokenizer_vocab.txt`、`var/traces/lecture_01.json` 存在 | tokenizer 流程已用 Mermaid 入第 1 章；若保留課堂原例句或圖片仍需 caption |
| [2](02-pytorch-einops.md) | `data/cs336/lectures material/lecture_02.py` | PyTorch tensor 與 resource accounting | 70B / 15T / H100 訓練估算；bf16 / fp16 / fp32 記憶差異；FLOPs 約 `6 * data points * params`；gradient accumulation / checkpointing 是記憶換算策略 | images 存在；`lecture_02.json`、`lecture_02_recording.json` 存在 | dtype 對照與 compute / memory 邊界已入第 2 章；H100 / B200 假設若正式引用仍需查核 |
| [6](06-kernels-triton-xla.md) | `data/cs336/lectures material/lecture_06.py` | Benchmark、profiling、Triton kernels | GPU hierarchy、warp、occupancy、bank conflict、coalescing；benchmark 要同步 CUDA；GeLU fusion 比 naive 少 HBM I/O；Triton 範例含 GeLU、softmax、row sum、matmul + ReLU | images 存在；`lecture_06.json`、`var/triton_gelu-ptx.txt` 存在；`var/profiles.txt` 不存在 | profiling 輸出若要入書需實跑生成 |
| [7](07-parallelism-i.md) | `data/cs336/lectures material/lecture_07.py` | 多 GPU parallelism 可執行示範 | collective primitives；all-reduce = reduce-scatter + all-gather；data / tensor / pipeline parallelism 分別切 batch / width / depth；pipeline bubble / overlap 未處理 | images 存在；`lecture_07.json`、`lecture_07_stdout.txt` 存在 | parallelism 策略表已入第 7 章；若引用 stdout 數字仍需執行環境 |
| [10](10-inference.md) | `data/cs336/lectures material/lecture_10.py` | Inference efficiency | prefill compute-bound、generation memory-bound；KV cache 是核心瓶頸；GQA / MLA / CLA / local attention 降 KV cache；speculative sampling 保持 target exact sample；PagedAttention 解動態 KV 配置 | images 存在；`lecture_10.json` 存在 | inference lifecycle 與機制表已入第 10 章；latency / throughput 數值若引用仍需環境 |
| [12](12-evaluation.md) | `data/cs336/lectures material/lecture_12.py` | Evaluation landscape | evaluation 是抽象能力到具體 metric；perplexity 仍用於開發但不等於真實任務；exam / chat / agent / reasoning / safety benchmark 各測不同面向；validity 包含 contamination、dataset quality、規則定義 | images 存在；`lecture_12.json` 存在 | 已補書內評估類型對照表；trace 仍未讀 |
| [13](13-data-sources-datasets.md) | `data/cs336/lectures material/lecture_13.py` | Data I：資料來源、授權、典型資料集 | data 是模型差異核心；web 不是整個 Internet，受 crawler / ToS / robots / copyright 限制；整理 Common Crawl、Wikipedia、GitHub、arXiv；比較 BERT、GPT-2、C4、GPT-3、Pile、LLaMA、Dolma、DCLM、Nemotron、The Stack、CommonPile | images 存在；`lecture_13.json` 存在 | 資料集演進表已入第 13 章；法律段落若正式出版仍需標註非法律建議 |
| [14](14-data-pipeline-quality.md) | `data/cs336/lectures material/lecture_14.py` | Data II：處理管線 | transformation 將 HTML / PDF / code 轉 text；filtering 以 target / raw scoring 選資料；dedup 用 hash、Jaccard、MinHash、LSH；mixing 要處理 high-quality source epoching；post-training data 多為 synthetic / teacher traces | images 存在；`lecture_14.json` 存在 | raw / target filtering 與 RegMix 流程已入第 14 章；具體數字或來源仍需查核 |
| [17](17-alignment-multimodality.md) | `data/cs336/lectures material/lecture_17.py` | Multimodal models | 非文字資料要轉成 tokens / embeddings；CLIP / SigLIP 對比或二元 image-text pretraining；LLaVA / Qwen 系列是 vision encoder + projector/adaptor + LM；Chameleon 用離散 image tokens 支援生成但有資訊損失與穩定性問題 | images 存在；`lecture_17.json` 存在 | 多模態路線表已入第 17 章；若畫 M-RoPE 或 VQ-VAE 細節仍需來源 |

### PDF Slides

| 講次 | 本地路徑 | 頁數 / metadata | 材料用途 | 可確認重點 | 圖表 / 公式候選 | 待補 |
|---:|---|---|---|---|---|---|
| [3](03-architectures.md) | `data/cs336/lectures material/lecture_03.pdf` | PDF 1.7，67 頁；slide title: Lecture 3, LM architecture and hyperparameters | 架構與超參數 | 現代 LM 常採 pre-norm / non-residual norm；RMSNorm 常見且資料搬移不只 FLOPs；SwiGLU / GeGLU 成為 FFN 主流；RoPE、GQA / MQA、QK norm、z-loss 是常見穩定與效率技巧 | pre/post norm 圖；RMSNorm 公式；RoPE 旋轉公式；FFN ratio / head dim 表；GQA / MQA arithmetic intensity | 需人工截圖確認圖像清晰度；PDF metadata title 未確認 |
| [4](04-attention-alternatives.md) | `data/cs336/lectures material/lecture_04.pdf` | PDF 1.7，60 頁；slide title: Attention alternatives and Mixtures of Experts | Attention 替代與 MoE | linear attention 可由 `Q(K^T V)` 改寫得到 recurrent form；Mamba-2 / GDN 是 attention hybrid 路線；MoE 用 top-k router 增加參數但控制 active FLOPs；MoE 訓練靠 routing heuristic / balancing loss，系統複雜度高 | linear attention / recurrent state 公式；Mamba / GDN recurrence；MoE top-k routing 圖；expert 數量表；DeepSeek MoE v3 / MLA 圖 | MoE 各模型表格可再逐項校對 |
| [5](05-gpus-tpus.md) | `data/cs336/lectures material/lecture_05.pdf` | PDF 1.7，55 頁；slide title: GPUs | GPU 效能、memory wall、FlashAttention | GPU 是 throughput / SIMT 模型，warp = 32 threads；tensor cores 讓 matmul 遠快於一般 FLOPs；效能瓶頸常是 memory movement；fusion、recompute、coalescing、tiling 是核心手段；FlashAttention 用 tiling + online softmax | GPU execution / memory model 圖；roofline；tiling math；online softmax；FlashAttention forward pass 圖 | 若書稿要放硬體圖，需挑合法可引用來源 |
| [8](08-parallelism-ii.md) | `data/cs336/lectures material/lecture_08.pdf` | PDF 1.7，73 頁；slide title: Parallelism basics | 分散式訓練與平行化 | collective primitives 是分散式基礎；ZeRO 1/2/3 分別 shard optimizer / gradient / parameters；pipeline / tensor / sequence / expert parallel 各自切不同維度；實務常組成 3D / 4D parallelism | all-reduce / reduce-scatter 圖；ZeRO memory / comm 表；pipeline bubble 公式；tensor parallel split；LLM parallelism overview table | 需對書稿現有平行化術語統一 |
| [9](09-scaling-laws-i.md) | `data/cs336/lectures material/lecture_09.pdf` | PDF 1.7，57 頁；slide title: Scaling laws - basics | scaling laws 基礎 | data vs loss 常呈 log-log power law；資料組成影響 offset，不只資料量；critical batch size 隨目標 loss 變化；joint model-data scaling 可做 compute tradeoff；Chinchilla 與 Kaplan 對 optimal tokens / params 有差異 | power law 圖；mean estimation `sigma^2/n`；`error = n^-alpha + m^-beta + C`；IsoFLOPs 曲線；Chinchilla method 1/2/3 | Chinchilla 方法表已入第 9 章；精確圖表與公式排版仍需校對 |
| [11](11-scaling-laws-ii.md) | `data/cs336/lectures material/lecture_11.pdf` | PDF 1.7，58 頁；slide title: Scaling - case study and details | scaling 實務案例 | MiniCPM 用 μP 穩定 scaling；DeepSeek / Qwen 等用小規模 sweep 擬合 LR / batch；WSD learning rate 可降低 Chinchilla sweep 成本；optimizer scaling 有強 scale dependence，Muon / μP 需謹慎解讀 | MiniCPM / DeepSeek scaling plots；WSD schedule；μP A1 / A2 條件與 init / LR scaling；LR / batch convex loss surface | 需確認書稿是否需要推導 μP，否則保留直覺版即可 |
| [15](15-mid-post-training.md) | `data/cs336/lectures material/lecture_15.pdf` | PDF 1.7，65 頁；slide title: After pretraining / mid-posttraining | SFT、midtraining、RLHF | SFT 主要抽取 pretrained behavior，不一定能注入模型未知事實；style / length 會強烈影響 preference eval；少量 safety SFT 可有效改變安全行為；RLHF data collection 有 annotator / ethics / demographic confounders；DPO 可避開 PPO 的 reward model / on-policy loop | SFT / RLHF pipeline；preference length effect 圖；SFT vs optimization objective；PPO policy gradient；DPO derivation | 可補 post-training dataset 範例，但需避免把 slide 範例全文搬入 |
| [16](16-post-training-rlvr.md) | `data/cs336/lectures material/lecture_16.pdf` | PDF 1.7，61 頁；slide title: Post-training 2, RL from verifiable rewards | RLVR、GRPO、reasoning RL | RLVR 在可驗證領域避免 RLHF reward overoptimization；GRPO 去掉 value model，用 group-normalized reward，但有 length / bias 問題；R1 / R1-zero / Kimi / Qwen3 都展示 reasoning RL 配方；Qwen3 顯示少量高質 RL examples 也可有效 | PPO vs GRPO objective；group z-score advantage；GRPO bias / length normalization 圖；R1 / Kimi / Qwen pipeline；agent RL stages | 需人工確認公式排版；可再細分 RLVR vs RLHF 小節 |

### Execution Artifacts

| 檔案路徑 | 對應講次 | 檔案用途 | 可確認重點 | 書稿處理 | 待補 |
|---|---:|---|---|---|---|
| `data/cs336/lectures material/var/traces/lecture_01.json` | 1 | edtrace 執行紀錄 | 結構為 `files`、`hidden_line_numbers`、`steps`；含 `lecture_01.py`；617 steps；主題含課程介紹、LM landscape、tokenization、BPE | 適合列為附錄索引，不全文內嵌 | 若正文引用，需另做精簡摘錄 |
| `data/cs336/lectures material/var/traces/lecture_02.json` | 2 | edtrace 執行紀錄 | 含 `lecture_02.py`；955 steps；主題是 resource accounting、tensor memory、FLOPs、arithmetic intensity、training memory | 適合列索引 | 補與第 2 章資源估算的交叉引用 |
| `data/cs336/lectures material/var/traces/lecture_02_recording.json` | 2 | 錄製版 trace | 含 `lecture_02.py`；992 steps；同講次但與 `lecture_02.json` 非完全相同 | 適合列為備份 / 錄製 trace | 補何時使用 recording 版的說明 |
| `data/cs336/lectures material/var/traces/lecture_06.json` | 6 | edtrace 執行紀錄 | 含 `lecture_06.py`；441 steps；主題是 GPU、benchmark / profile、Triton kernels、GeLU / softmax / matmul | 適合列索引 | 補正文中 kernel 範例位置 |
| `data/cs336/lectures material/var/traces/lecture_07.json` | 7 | edtrace 執行紀錄 | 含 `lecture_07.py`；633 steps；主題是 multi-GPU parallelism、collectives、NCCL / PyTorch distributed、data / tensor / pipeline parallelism | 適合列索引 | 搭配 stdout 才能看 multiprocessing 實跑輸出 |
| `data/cs336/lectures material/var/traces/lecture_07_stdout.txt` | 7 | 實跑 stdout | 77 行；顯示 CUDA 13.2、Modal run、4 ranks 的 all-reduce / reduce-scatter / all-gather、bandwidth、parallelism log | 可摘錄少量重點，不全文貼入 | 補執行環境日期 / 硬體條件，避免把數字當通用 benchmark |
| `data/cs336/lectures material/var/traces/lecture_10.json` | 10 | edtrace 執行紀錄 | 含 `lecture_10.py`；437 steps；主題是 inference workload、KV cache、GQA / MLA、quantization、pruning、speculative sampling、continuous batching、paged attention | 適合列索引 | 補與推論章節的術語對照 |
| `data/cs336/lectures material/var/traces/lecture_12.json` | 12 | edtrace 執行紀錄 | 含 `lecture_12.py`；313 steps；主題是 evaluation、perplexity、exam / chat / agentic / reasoning / safety benchmarks、validity | 適合列索引 | 補評測分類表是否納入正文 |
| `data/cs336/lectures material/var/traces/lecture_13.json` | 13 | edtrace 執行紀錄 | 含 `lecture_13.py`；489 steps；主題是 Data I、raw sources、copyright、Common Crawl、Wikipedia、GitHub、arXiv、The Pile、DCLM 等 | 適合列索引 | 補資料來源授權 / 法律說明，不從 trace 推論 |
| `data/cs336/lectures material/var/traces/lecture_14.json` | 14 | edtrace 執行紀錄 | 含 `lecture_14.py`；406 steps；主題是 Data II、transformation、filtering、deduplication、MinHash、LSH、data mixing、post-training data | 適合列索引 | 補演算法公式是否要正文重寫 |
| `data/cs336/lectures material/var/traces/lecture_17.json` | 17 | edtrace 執行紀錄 | 含 `lecture_17.py`；235 steps；主題是 multimodal models、CLIP、SigLIP、LLaVA、Qwen-VL、Chameleon | 適合列索引 | 補多模態章節是否納入本書範圍 |
| `data/cs336/lectures material/var/gpt5_tokenizer_vocab.txt` | 1 | tokenizer vocabulary 輸出 | 203,295 行；逐行 token；前段含控制字元 / 空白 token | 適合作為附件連結，不適合內嵌 | 補 tokenizer 版本 / 來源說明 |
| `data/cs336/lectures material/var/triton_gelu-ptx.txt` | 6 | Triton GeLU kernel 的 PTX 輸出 | 265 行；ASCII assembler source；含 `.version 8.8`、`.target sm_100a`、`triton_gelu_kernel`、對應 `lecture_06.py` line info | 可摘錄短片段或列附件 | 補硬體 / 編譯器條件，避免 PTX 被誤解為固定輸出 |

### Visual Assets

| 資料夾 / 檔案群 | 對應講次或主題 | 用途 | 圖表候選 | 授權 / 來源注意事項 | 待補 |
|---|---|---|---|---|---|
| `data/cs336/lectures material/assets/index-C7Yyog8u.js`、`assets/index-CJlPj8BE.css` | Trace viewer | 顯示 `var/traces/*.json` 的本地網頁資產；`index.html` 目前引用這兩個檔 | 不適合作為書稿圖表 | Vite / edtrace 打包產物，不是課程內容圖 | `assets/index-Df7yrRTL.js`、`assets/index-DtzsJ7ur.js` 需確認是否舊版殘留 |
| `data/cs336/lectures material/images/` | 可執行講義共用圖庫 | 149 張 PNG，約 38M；其中 137 張被 `lecture_*.py` 本地引用 | 可作章節插圖池 | 本地存在不等於可出版；多數是論文圖、網站截圖、排行榜、課程自製圖混合 | 補每張圖的來源 URL、授權、caption、對應章節 |
| `course-staff.png`、`gpt4-no-details.png`、`roller-flops.png`、`wei-emergence-plot.png`、`tokenized-example.png`、`transformer-architecture.png`、`chinchilla-isoflop.png` | Lecture 1 | 課程動機、tokenization、Transformer、scaling 視覺化 | `tokenized-example.png`、`transformer-architecture.png`、`chinchilla-isoflop.png` | 含課程人員、外部模型 / 論文圖可能性 | 補完整 credit；確認是否可重畫 |
| `fp32.png`、`fp16.png`、`bf16.png`、`cpu-gpu.png`、`compute-memory.png`、`deep-network.png` | Lecture 2 | precision、CPU/GPU、記憶與計算估算 | `fp32/fp16/bf16`、`compute-memory.png`、`deep-network.png` | 數值格式圖若取自外部需查授權；自製重畫成本低 | 可優先重畫以降低版權風險 |
| `gpu-hardware.png`、`triton-softmax.png`、`triton-row-sum.png`、`gemm_tiled.png` | Lecture 6 | GPU、Triton、kernel optimization | `triton-softmax.png`、`gemm_tiled.png` | GPU / 硬體圖可能含廠商來源 | 補來源；必要時改成自製流程圖 |
| `gpu-node-overview.png`、`ranks.png`、`data-parallelism.png`、`tensor-parallelism.png`、`pipeline-parallelism.png` | Lecture 7 | collective 與資料 / 張量 / 管線平行化 | parallelism 圖、`ranks.png` | 若為課程自製仍需標 Stanford CS336；若外部則補來源 | 可整理成一組平行化策略比較圖 |
| `inference-schema.png`、`gqa-*`、`mla-*`、`cla-*`、`longformer-attention.png`、`paged-attention-*`、`speculative-sampling-*`、`awq-schema.png` | Lecture 10 | KV cache、attention 壓縮、PagedAttention、speculative decoding、quantization | `inference-schema.png`、`paged-attention-*`、`speculative-sampling-algorithm.png` | 多數疑似論文 / 系統圖截取 | 補原論文 / 專案來源；決定哪些改畫 |
| `artificial-analysis*`、`lmarena-leaderboard.png`、`mmlu*`、`gpqa.png`、`hle-*`、`swebench.png`、`terminal-bench-*`、`cybench-*`、`arc-agi-*`、`gcg-examples.png` | Lecture 12 | benchmark landscape、leaderboard、安全 / agent 評估 | `mmlu.png`、`hle-pipeline.png`、`swebench.png`、`arc-agi-results.png` | 排行榜與 benchmark 截圖有時效性與授權風險 | 出版前需更新日期或避免使用即時榜單截圖 |
| `llama3-data.png`、`olmo2-*`、`tulu.png`、`dclm-*`、`stackv2-*`、`commonpile.png`、`comma-results.png` | Lecture 13 | 資料來源、授權、資料集比較 | `llama3-data.png`、`dclm-quality.png`、`commonpile.png` | 多為資料集 / 論文圖；資料授權議題本身敏感 | 補來源與授權；確認是否需要法律免責文字 |
| `raw-target-schema.png`、`data-filtering-scale.png`、`marin-token-viewer.png`、`regmix.png`、`data-mixing-methods.png`、`openthoughts-*`、`swezero-*` | Lecture 14 | filtering、dedup、mixing、synthetic / agent data | `raw-target-schema.png`、`regmix.png`、`data-mixing-methods.png` | 外部論文 / 網站截圖可能性高 | 補每張圖的論文或網站來源 |
| `multimodality.png`、`clip*`、`siglip*`、`llava-*`、`qwen*-vl-*`、`chameleon*`、`vq-vae.png` | Lecture 17 | CLIP / SigLIP、LLaVA、Qwen-VL、Chameleon 架構 | `clip.png`、`llava-architecture.png`、`qwen2-vl-architecture.png`、`vq-vae.png` | 幾乎都需查原 paper / project 授權 | 優先選 3-5 張，其他以自製比較表替代 |
| `data/cs336/lectures material/var/files/image-*` | Lecture 1、2、6、7、10、12、13、14 | 遠端圖快取與追溯來源 | 僅作臨時檢視，不建議直接入書 | 檔名含原始 URL，來源橫跨 Wikimedia、NVIDIA、JAX scaling book、HELM、ARC、X/Twitter、Medium 等 | 正式使用前需補 URL、license、擷取日期 |
| 未引用圖片：`batch-sequence.png`、`chatbot-arena-leaderboard.png`、`cursor-1b-lines.png`、`deepseek-r1-benchmarks.png`、`demis-gemini-2.5.png`、`design-decisions.png`、`helm-capabilities-leaderboard.png`、`ifeval-categories.png`、`karpathy-crisis.png`、`llama4-benchmarks.png`、`openai-100b-tokens.png`、`openmathinstruct2.png` | 未確認 | 可能是舊版、PDF 講義或備用素材 | 暫不列為正式候選 | 沒有引用脈絡與來源 metadata | 人工確認來源與用途；未確認前不要入書 |
| `lecture_03/04/05/08/09/11/15/16.pdf` 內嵌圖 | PDF slides | 圖已嵌在 PDF，不是 `images/` 的本地檔案引用 | 需另行截圖 / 抽圖後才能列候選 | PDF slides 可能混合課程自製與第三方圖 | 逐頁抽圖、確認清晰度、補來源與授權 |

## 圖表優先清單

本節記錄 course material 圖表的第一輪入書狀態。優先重畫項目已用書內 Mermaid 或 Markdown 表格替代原圖；來源、授權、擷取日期與正式 caption 仍未查核。除非完成查核，原圖片不得直接放入章節正文。

### 優先重畫

| 優先 | 候選材料 | 對應章節 | 本地可確認用途 | 建議處理 | 待補 |
|---:|---|---|---|---|---|
| 1 | `images/tokenized-example.png` | [01](01-overview-tokenization.md) | Tokenization：說明 bytes 與 token ids 間轉換 | 已用 Mermaid 重畫成簡化 tokenizer 流程圖 | 若要保留課堂原例句，仍需補 caption |
| 2 | `images/fp32.png`、`images/fp16.png`、`images/bf16.png` | [02](02-pytorch-einops.md) | Tensor memory：比較 fp32、fp16、bf16 的位元配置與記憶成本 | 已用 Markdown 表格重畫成統一 dtype 對照 | 若引用標準文件細節，仍需補來源 |
| 3 | `images/compute-memory.png` | [02](02-pytorch-einops.md) | Arithmetic intensity：資料從 memory 到 accelerator 計算再寫回 | 已用 Mermaid 重畫成 compute / memory 邊界示意 | 若要補 roofline plot，需另行重畫並校對第 5、6 章脈絡 |
| 4 | `images/triton-softmax.png`、`images/triton-row-sum.png`、`images/gemm_tiled.png` | [06](06-kernels-triton-xla.md) | Triton softmax、row sum、tiled matmul 的教學圖 | 已用 Mermaid 重畫成 Triton block-level 資料流圖 | 若要分別呈現 softmax / matmul 細節，可再補小圖 |
| 5 | `images/data-parallelism.png`、`images/tensor-parallelism.png`、`images/pipeline-parallelism.png`、`images/ranks.png` | [07](07-parallelism-i.md) | rank / world size 與 data、tensor、pipeline parallelism 的切分方式 | 已用 Markdown 表格重畫成平行化策略比較 | 若要畫 rank 間通訊箭頭，可再補 Mermaid |
| 6 | `images/inference-schema.png`、`images/prefill-decode.png` | [10](10-inference.md) | 推論章總覽；區分 prefill 與 decode | 已用 Mermaid 重畫成 inference lifecycle 圖 | 若要標出 latency / throughput 指標，可再補一列對照表 |
| 7 | `images/mla-schema.png`、`images/speculative-sampling-algorithm.png`、`images/paged-attention-sharing.png` | [10](10-inference.md) | MLA 壓縮 KV、speculative sampling、PagedAttention prefix sharing | 已用 Markdown 表格重畫成推論機制對照 | 若要畫個別演算法細節，需補原始論文 credit |
| 8 | `images/raw-target-schema.png`、`images/regmix.png` | [14](14-data-pipeline-quality.md) | raw / target filtering；regression-based data mixing | 已用 Mermaid 重畫 raw / target filtering；RegMix 原已用 Mermaid 流程圖整理 | 若要補偽程式碼，需避免作業解答化 |
| 9 | `images/clip.png`、`images/siglip-code.png`、`images/llava-architecture.png`、`images/qwen2-vl-mrope.png`、`images/chameleon.png` | [17](17-alignment-multimodality.md) | CLIP / SigLIP、VLM 接入 LM、multimodal RoPE、離散 image tokens | 已用 Markdown 表格重畫成多模態路線比較 | 若要畫 M-RoPE 或 VQ-VAE 細節，需補 paper credit 並避免複製原圖版面 |
| 10 | `images/chinchilla-isoflop.png` | [09](09-scaling-laws-i.md) | Chinchilla IsoFLOPs 與三種 fitting 方法 | 已用 Markdown 表格重畫成 Chinchilla 方法比較 | 若要放原 plot，需補原論文 credit 與圖表來源 |
| 11 | `images/llama3-data.png`、`images/olmo2-pretraining.png`、`images/tulu.png`、`images/commonpile.png`、`images/dclm-wet.png` | [13](13-data-sources-datasets.md) | 資料來源、授權、資料集演進與過濾路線 | 已用 Markdown 表格重畫成資料集演進比較 | 若要引用具名模型資料比例圖，需補來源與授權 |

### 不宜直接使用

| 候選材料 | 對應章節 | 風險訊號 | 建議處理 | 待補 |
|---|---|---|---|---|
| `images/lmarena-leaderboard.png`、`images/alpacaeval-leaderboard.png`、`images/openrouter.png`、`images/artificial-analysis*.png` | [12](12-evaluation.md) | leaderboard / 平台截圖；內容具時效性 | 已避免直接入書；改用評估類型對照表 | 若保留原截圖需補來源、日期、授權 |
| `images/karpathy-nanogpt-speedrun.png`、`var/files/*pbs_twimg*` | [12](12-evaluation.md) | 社群媒體截圖或快取 | 維持不用；第 12 章只保留評估 validity 與 benchmark 類型整理 | 若要引用原 post，需補日期、URL、授權 |
| `var/files/*docs_nvidia*`、`https://docs.nvidia.com/...` | 01、02、06 | 廠商文件圖 | 維持不用；第 2、6 章已用書內表格 / Mermaid 替代 precision、compute / memory 與 Triton 流程 | 若要使用廠商圖，需補 NVIDIA 文件來源與授權 |
| `images/chinchilla-isoflop.png`、`images/gpt2-perplexity.png`、`images/mmlu.png`、`images/hle-pipeline.png`、`images/swebench.png` | 09、12 | 論文 / benchmark 圖表訊號 | 維持不用；第 9 章用 Chinchilla 方法表，第 12 章用評估類型表替代 | 若要放原圖，需補原論文 / benchmark credit |
| `images/llama3-data.png`、`images/olmo2-pretraining.png`、`images/tulu.png`、`images/commonpile.png`、`images/dclm-wet.png`、`images/data-filtering-scale.png` | 13、14 | 具名模型 / 資料集 / 論文圖訊號 | 維持不用；第 13 章用資料集演進表，第 14 章用 filtering 與 RegMix 流程替代 | 待補來源、授權、法律說明 |
| `images/marin-token-viewer.png` | [14](14-data-pipeline-quality.md) | 工具 / 網站介面截圖 | 不建議入書 | 若要介紹 Marin，改用文字描述或自製流程圖 |
| `images/qwen3-vl-results.png` | [17](17-alignment-multimodality.md) | 具名模型 results 圖 | 維持不用；第 17 章已用多模態路線表替代 results 截圖 | 若要引用 results，需補來源、日期與授權 |

## 待補

- Lecture 18：本地未見 `lecture_18.*` 或 Dan Fu guest lecture 專用 slides/code/material。
- Trace / stdout / PTX 已完成索引，但若要引用具體輸出數字，需補執行環境與日期。
- 圖片與 PDF 內嵌圖尚未逐張完成來源、授權與 caption 查核；正式使用原圖前需另批處理。目前可表格化或可重畫的高價值候選已完成第一輪書內替代，高風險圖片仍維持避免直接使用。

# 術語表

| 術語 | 暫定翻譯 | 說明 |
|---|---|---|
| tokenization | 斷詞／token 化 | 將字串或 bytes 轉成 token id 序列的程序。 |
| tokenizer | tokenizer／斷詞器 | 負責 encode 與 decode 的元件。 |
| round trip | 往返一致 | encode 後 decode 必須回到原字串。 |
| compression ratio | 壓縮率 | 本書依 Lecture 1 使用 bytes per token。 |
| BPE | Byte Pair Encoding | 從 byte 開始反覆合併常見相鄰 pair 的 tokenizer 訓練方法。 |
| vocabulary | 詞彙表 | token id 與 token 內容的集合。 |
| sparsity | 稀疏性 | vocab 太大時，許多 token 出現次數少，學習效率差。 |
| scaling recipe | 規模化配方 | 從 compute budget 映射到模型與訓練超參數的規則。 |
| hyperparameter transfer | 超參數轉移 | 小規模實驗的超參數能否預測或轉移到大規模。 |
| arithmetic intensity | 算術強度 | 每搬移一單位資料所做的運算量，常用 FLOPs / byte 直覺判斷 compute-bound 或 memory-bound。 |
| compute-bound | 計算受限 | 執行時間主要受可用運算吞吐限制。 |
| memory-bound | 記憶體受限 | 執行時間主要受資料搬移或記憶體頻寬限制。 |
| MFU | 模型 FLOPs 使用率 | 實際達成的模型 FLOPs / 秒相對於硬體理論峰值的比例。 |
| all-reduce | 全域歸約 | 多個 rank 先歸約張量，再讓每個 rank 都取得完整結果。 |
| reduce-scatter | 歸約後分散 | 多個 rank 歸約張量後，把結果切片分散到各 rank。 |
| all-gather | 全域收集 | 每個 rank 持有一片張量，最後讓所有 rank 都收集到完整張量。 |
| DDP | Distributed Data Parallel | 每個 GPU 持有完整模型、切分 batch，透過 gradient synchronization 更新。 |
| FSDP | Fully Sharded Data Parallel | 將參數、梯度或 optimizer state shard 到不同 rank，以降低單卡記憶體壓力。 |
| ZeRO | Zero Redundancy Optimizer | 透過 shard optimizer state、gradient、parameter 逐步移除 data parallel 的冗餘。 |
| prefill | prompt 預填 | inference 中先處理 prompt 並建立 KV cache 的階段。 |
| decode | 逐 token 解碼 | inference 中一次生成一個 token 的階段。 |
| KV cache | KV 快取 | 推論時保存過去 token 的 key/value，避免每步重算整段上下文。 |
| GQA | 分組查詢注意力 | 多個 query heads 共用較少的 key/value heads，用來降低 KV cache 成本。 |
| MLA | 多頭潛在注意力 | 以較低維 latent 表示壓縮並重建 key/value，降低推論記憶體負擔。 |
| speculative decoding | 推測解碼 | 用較小或較快的 draft model 先提出 token，再由 target model 驗證以保持分布正確。 |
| PagedAttention | 分頁注意力 | 將 KV cache 切成固定大小 blocks 管理，減少動態序列造成的記憶體浪費。 |
| IsoFLOPs | 等 FLOPs 掃描 | 固定 compute budget 掃模型大小與資料量，找 terminal loss 最佳點。 |
| lower envelope | 下包絡線 | 從多條曲線中取同 compute 下可達到的最佳 loss，用來估計 scaling trend。 |
| benchmark contamination | 評測污染 | 評測題目或答案進入訓練資料，導致分數高估模型泛化能力。 |
| LLM-as-judge | LLM 作為評審 | 用語言模型評分其他模型輸出，需注意偏好、校準與可重現性。 |
| scaffold | 腳手架 | 包在模型外的工具、提示、搜尋或代理流程，會影響 benchmark 表現。 |
| MinHash | 最小雜湊 | 估計集合相似度的 sketch 方法，常用於大規模近似去重。 |
| LSH | Locality-Sensitive Hashing | 讓相似項更可能落到同一 bucket 的雜湊方法，用於近似近鄰搜尋。 |
| Jaccard similarity | Jaccard 相似度 | 兩集合交集大小除以聯集大小，常用於文件 shingle 相似度。 |
| data mixture | 資料混合 | 訓練時不同來源、品質或任務資料的比例配置。 |
| RegMix | Regression-based Data Mixing | 用小規模實驗與迴歸模型估計不同資料混合比例的效果。 |
| SFT | 監督式微調 | 用示範答案或 instruction data 讓模型學會目標輸出格式與行為。 |
| RLHF | 人類回饋強化學習 | 用人類偏好訓練 reward model，再用 RL 最佳化模型輸出。 |
| RLVR | 可驗證獎勵強化學習 | 在數學、程式等可自動驗證領域，以可驗證 reward 做 post-training。 |
| GRPO | Group Relative Policy Optimization | 用同一 prompt 的多個 samples 做 group-normalized reward，不另訓練 value model。 |
| DPO | Direct Preference Optimization | 直接用偏好資料最佳化 policy，相對簡化傳統 RLHF 的 reward model / PPO loop。 |
| CLIP | Contrastive Language-Image Pretraining | 以 image-text 對比學習把圖片與文字嵌入對齊。 |
| SigLIP | Sigmoid Loss Image-Text Pretraining | 用 sigmoid / binary objective 做 image-text pretraining 的 CLIP 變體。 |
| VLM | 視覺語言模型 | 能同時處理圖片與文字的模型，常見做法是 vision encoder 接 projector 再接 LM。 |
| VQ-VAE | 向量量化變分自編碼器 | 將連續影像表示量化為離散 codes，可作為 image tokens。 |
| M-RoPE | Multimodal RoPE | 將 RoPE 擴展到多模態位置結構，例如文字、影像寬高或時間軸。 |

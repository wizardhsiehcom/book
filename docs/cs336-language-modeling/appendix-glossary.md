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
| prefill | prompt 預填 | inference 中先處理 prompt 並建立 KV cache 的階段。 |
| decode | 逐 token 解碼 | inference 中一次生成一個 token 的階段。 |


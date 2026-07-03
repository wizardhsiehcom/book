# Lecture 1 閱讀筆記：Overview, Tokenization

## 基本資料

- 對應逐字稿：`data/Stanford CS336 Language Modeling from Scratch/01 - Stanford CS336 Language Modeling from Scratch ｜ Spring 2026 ｜ Lecture 1： Overview, Tokenization.en.txt`
- 完整閱讀日期：2026-07-03
- 閱讀範圍：逐字稿第 1 行到第 2152 行
- 狀態：已完整讀完、已抽象、已成章

## 本講主問題

這一講先回答 CS336 為什麼存在：在只能 prompt 或 fine-tune 現成模型的時代，研究者容易與底層技術脫節。課程希望透過「親手建立」語言模型的關鍵部分，恢復對整個堆疊的理解。後半段開始第一個技術主題 tokenization，說明語言模型如何把原始文字轉成 token index 序列，以及為什麼 BPE 是目前常用的折衷方案。

## 重要主線

1. from scratch 是學習策略，不是每個零件都從零重寫。
2. frontier model 昂貴、封閉，因此課程用小模型學 mechanics 與 mindset，但提醒 intuition 不一定跨 scale。
3. bitter lesson 的重點是 scalable algorithms matter，不是 algorithms do not matter。
4. 整門課都圍繞效率：data efficiency、compute efficiency、memory movement、communication、scaling predictability。
5. Tokenizer 是模型第一個抽象層，決定序列長度、vocab、壓縮率與 adaptive computation。

## 課程架構筆記

| 單元 | 重點 |
|---|---|
| Basics | tokenizer、architecture、optimizer、trainer、resource accounting |
| Systems | hardware、roofline analysis、kernel、Triton、parallelism、inference |
| Scaling laws | scaling recipe、small-scale experiments、loss prediction、hyperparameter transfer |
| Data | evaluation、資料蒐集、轉換、過濾、去重、混合、synthetic data |
| Alignment | weak supervision、preference、PPO、GRPO、DPO、RL systems |

## Tokenization 筆記

Tokenizer 的任務：

- encode：把 Unicode string 或 bytes 轉成 token ids。
- decode：把 token ids 還原成 string。
- 必須 round trip。

Compression ratio：

```text
bytes per token = number of bytes / number of tokens
```

ratio 越大，sequence 越短，attention 成本通常越低；但 vocab 越大會帶來 sparsity。

三種 baseline：

| tokenizer | 問題 |
|---|---|
| character-level | Unicode 字元多且長尾，vocab 使用效率差 |
| byte-level | vocab 小但序列長，compression ratio 差 |
| word-level | vocab 大且無上限，測試時會遇到未見詞 |

BPE：

- 從 byte-level 開始。
- 反覆合併最常出現的相鄰 token pair。
- 常見序列變短，罕見序列退回小單位。
- 不需要 `[UNK]` 就能處理任意輸入。
- 概念簡單，但高效 encode 需要資料結構與索引。

## 可放入書稿的工程取捨

- 小規模模型與大規模模型的瓶頸不同，不能把小實驗結果直接當成 frontier model 規律。
- 訓練穩定性、效率與表達能力彼此牽制。
- systems 的核心是資料搬移；kernel fusion、tiling、parallelism 都是在減少昂貴搬移。
- scaling law 的價值不只是預測 loss，也是在高成本訓練前設計可外推的 recipe。
- data 不是靜態資料集，而是決定模型能力的設計材料。
- alignment 在模型已具備基本能力後，用弱監督與偏好訊號改變行為。

## 跨章連結

- Lecture 2 會接 resource accounting 與 PyTorch/einops，應承接本章的效率視角。
- Lecture 3-4 的 architecture 需要回扣 tokenizer 對 sequence length 與 attention cost 的影響。
- Lecture 5-8 的 systems 可延伸本講關於 memory movement、kernel、parallelism 的預告。
- Lecture 9-11 的 scaling laws 可延伸本講「predictability 至少和 optimality 一樣重要」。
- Lecture 13-14 的 data 需要回扣本講「資料不會從天上掉下來」。

## 暫不處理

- 本講提到 Karpathy tokenization video、How to Scale Your Model、Moraine project 等外部資源。依照本書流程，外部搜尋與補充等所有逐字稿初稿完成後再做。


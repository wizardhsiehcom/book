# Lecture 10：Inference 閱讀筆記

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 10, Inference
- 逐字稿檔案：`data/Stanford CS336 Language Modeling from Scratch/10 - Stanford CS336 Language Modeling from Scratch ｜ Spring 2026 ｜ Lecture 10： Inference.en.txt`
- 完整閱讀範圍：第 1 行到第 2267 行（檔案總行數 2267 行）
- 講者：逐字稿開頭提及「last time Tatsu talked about scaling laws」，本講由另一位講者（Percy，依 `cs336-materials-plan.md` 課程排程表對應 Lecture 10: Inference [Percy]）主講；逐字稿本身未再度自報姓名，此處姓名依材料計畫排程表推斷，非逐字稿內文直接證據。
- 本筆記限制：未使用網路搜尋，未加入逐字稿外部資料。講者提及的「scaling book from Google」是本講許多圖表與敘述的引用來源，但本筆記未閱讀該書，僅記錄講者口頭提及的事實。
- 相關材料狀態：Lecture 10 lecture code `lecture_10.py` 與 trace `var/traces/lecture_10.json` 已下載，待材料階段閱讀。依材料計畫排程表，本講對應 Assignment 2 due、Assignment 3 out。

## 逐字稿完整閱讀紀錄

閱讀範圍確認：

- 起點：第 1 行（"All right, let's get started."）
- 終點：第 2267 行（"uh scaling laws part two."，講者預告下一講由 Tatsu 回歸講 Scaling Laws Part 2）
- 是否從頭到尾完整閱讀：是，分段依序讀完第 1–600、600–1200、1200–1800、1800–2267 行，未跳段。
- 跳過段落：無。

## 本講主問題

本講要解決的問題是：模型訓練完成後，如何又快又準確地把它用起來？講者用一個關鍵對比破題：訓練時可以平行處理整個序列（supervised fine-tuning 一次看到所有 token），但 inference 因為自回歸（auto-regressive）性質，必須一次一個 token 依序生成，無法在序列維度上平行化。這個結構性差異導致 inference 難以達到高 arithmetic intensity、難以餵飽硬體算力，是本講幾乎所有技巧最終都要回應的根本瓶頸。本講依序處理三個子問題：如何用數學（arithmetic intensity、throughput、latency）精確描述這個瓶頸；有哪些技巧（縮小 KV cache、quantization、pruning、speculative decoding）可以在不傷準確度的前提下降低成本；以及實務上服務動態、即時流量時（continuous batching、paged attention）還有哪些系統設計問題。

## 核心概念

### 1. Inference 的重要性正在快速上升

講者開場就強調，inference 雖然只佔一講的篇幅，但重要性正在成長。它出現在很多地方：與 AI assistant／chatbot 聊天、code completion、agent（現在很熱門）、batch data processing、evaluation（尤其是需要生成的評估）、以及訓練內部（RL 需要生成 rollout、打分數、再更新權重）。講者用一組數字強化這個論點：OpenAI 估計每天產生 8.6 兆（trillion）token，而 GPT-4（今年稍早發布）訓練時用了 32 兆 token；換句話說，不到 4 天，OpenAI 為了 inference 產生的 token 數（以及對應的 compute）就已經追上訓練 GPT-4 所用的量。訓練是一次性成本（one-time cost），即使很貴，做完就結束；但 inference 是重複成本（repeated cost），每天都要付。

### 2. Agentic 時代讓 inference 的重要性質變

講者指出過去我們把語言模型主要當作 chatbot／assistant：輸入 prompt，得到回應，人類閱讀回應。但現在越來越走向 agentic 世界：一個 query 進去後，agent 會思考、推理、呼叫工具、自我檢視（introspect），最後才產出給人類讀的輸出。這代表 agent 產生的大部分 token 根本不是給人讀的。因此應該把「生成的 token 數」直接理解為「花掉的 compute」，而且沒有上限——只要問題夠有企圖心，就會需要更多 compute 與更多 token。在純 chatbot 世界，inference 快到一定程度就夠了，因為人類閱讀速度有限；但在 agent 世界，從 inference 中榨出更多效能沒有明顯上限，這是 inference 重要性提升的核心原因。

### 3. 商業與開源工具生態

講者簡述目前 inference 的產業生態：封閉 API 供應商（closed API providers）需要自己服務模型；也有一批供應商專門服務 open weight 模型並提供 inference 服務。開源社群方面提到幾個套件：vLLM（大概是最流行、go-to 的選擇）、SGLang（特別適合 agentic workload，但可能還沒那麼流行）、Nvidia 的 TensorRT（速度快但用途較窄）、以及 llama.cpp（適合在 CPU 上跑 inference，很流行）。講者藉此強調：只要能把 inference 加速兩倍甚至快 10%，就是很大的事。

### 4. 三個速度指標：TTFT、latency、throughput

講者定義三個指標來刻畫「快」：

- **Time to first token（TTFT）**：使用者在任何生成發生前要等多久。從送出 query 到第一個 token 出現的時間。這對互動式應用很重要，因為「什麼都沒發生」的等待時間越長，使用者體驗越差；一旦 token 開始出現，速度不必太快，因為人類閱讀本來就有速度上限。
- **Latency**：從單一使用者角度，一個 query 的 token 出現速度有多快（token 串流的速度）。同樣對互動式應用重要。
- **Throughput**：多個 query 合計每秒能吐出多少 token（tokens per second）。這對批次處理（batch processing）很重要，例如你有一整個 petabyte 的資料要用語言模型處理，你只在乎整體工作何時做完，不在乎某一筆是否先完成。

Latency（或其倒數）與 throughput 直覺上很相關——很多改善通常兩者都會變好——但講者也預告：之後會看到兩者之間其實存在真正的 trade-off。

### 5. 根本問題：訓練可平行化，inference 不行

這是講者說「這是這堂課要記住的一個重點」的地方：訓練時你一次看到所有 token（supervised fine-tuning），可以在序列維度上平行化——想想 Transformer 裡 attention、MLP 的計算，序列只是張量的一個維度，一次做完一個大矩陣乘法。Inference 不行，因為自回歸生成必須依序、一次一個 token 生成。這就是為什麼 inference 是和訓練截然不同的工作負載（workload）：無法在序列維度上平行化，導致難以取得高 arithmetic intensity、難以充分利用算力。這是後面所有 T² / T³ 成本分析與 KV cache 動機的根源。

### 6. 記號約定與 Transformer block 的「電路圖」描述

講者重新定義本講記號：`B` 是 batch 維度（同時是序列數量），`T` 是序列維度（同時是 token 數量），`D` 是模型維度，`H` 是 head 維度，`N` 是 head 數量。張量運算圖示中用顏色區分維度角色：紅色是 contracting 維度（出現在兩個運算元中，結果中消失，即被縮併），黑色是一般維度（只出現在一個運算元中，留在結果裡），藍色是 batching 維度（出現在兩個運算元中且留在結果裡，不被縮併/歸約）。

講者用這套記號畫出 Transformer block 的完整描述——像電路圖一樣繁複，但講者認為這是最精確地告訴你張量形狀與依賴關係的方式。Attention 部分：輸入 `X`（某一層的 activations）先過 attention 再過 MLP；`X` 乘上 query、key、value 矩陣，query 矩陣形狀是 batch × sequence × head 數 `N` × head 維度 `H`；K、V 則可能只有較小數量的 key-value head（為 GQA 鋪陳，逐字稿中此處記號經 Q&A 修正為：`K` 是 group 數，`G` 是每個 group 內的 query head 數，即 `N = K × G`）。Attention 運算本身有 batching 維度：`B` 同時出現在兩個運算元裡，並在 head 維度上做縮併——這點稍後會解釋為何是 attention 在 inference 時成為瓶頸的原因。MLP 則相對單純：gating 矩陣、up projection、down projection；慣例上 MLP 把 `D` 維模型維度先升到 `4D`（記為 `F`），模型維度又等於 head 數乘以 head 維度（`D = N × H`）。另外引入 `S` 與 `T` 兩個變數代表序列維度，但意義不同：`S` 是輸入 token 數，`T` 是輸出 token 數；訓練時兩者相同（predict 所有輸入即輸出），但 inference 時 `T = 1`（一次只生成一個 token），`S` 是輸入長度。

### 7. Arithmetic intensity 回顧：從單一矩陣乘法出發

講者複習 Lecture 2 教過的 arithmetic intensity。以 `B × D` 矩陣乘 `D × F` 矩陣為例（`B` 是 batch 維，`D` 是隱藏維度，`F` 是 MLP 的 up-projection 維度）：需要從 HBM 讀 `X`（BF16 下 `2BD` bytes）、讀權重 `W`（`2DF` bytes）、做矩陣乘法（flops 為 `2BDF`，是三次方型的量）、再把結果寫回 HBM（`2BF` bytes）。讀寫的 bytes 大致是「條目數」的量級（近似二次型），矩陣乘法的 flops 則是三次型。Arithmetic intensity 定義為 flops 除以搬移的 bytes：`flops / bytes`。當 `B` 遠小於 `D` 與 `F` 時（令 `D = C·B`、`F = C·B`、`C → ∞`），intensity 化簡為 `≈ B`——這與之前方陣乘法（intensity 約為 `N/3`）的結論是同一類結果，只是換成非方陣的版本。

硬體端則有「accelerator intensity」：查 spec sheet 的 flops/秒與記憶體頻寬（HBM ↔ SRAM 之間搬移速度），兩者相除即得。把計算出的 computational intensity 與 accelerator intensity 比較：若前者較大，代表 compute-bound（好）；若較小，代表 memory-bound（不好）。以 H100 為例，這個特定矩陣乘法在 batch size 大於 295 時才是 compute-bound。極端情況：只有一筆樣本（`B = 1`）時，intensity 等於 1，是 memory-bound；此時你讀進 `D×F` 的矩陣，但因為 `B` 只有 1，實際上只做了 `2DF` 量級的 flops——講者強調這正是 inference 常見的工作型態：拿到的不是完整、飽滿的矩陣，而是非常「瘦」（thin）的矩陣或張量。

### 8. 樸素自回歸生成的代價：`T` 立方

在引入 KV cache 之前，講者先分析最樸素的做法：把 prompt 丟進 Transformer，得到 logits，取樣一個 token，把它接在 prompt 後面再重跑一次，如此反覆。這種做法可行，但代價極高：每生成一個 token，都要花 `O(T²)` 的時間（因為 attention 本身是 `T²`），而生成 `T` 個 token 總共要花 `O(T³)`。原因是每一步都重新對整個目前為止的序列跑一次 attention。

但講者指出：其實不必這麼做。很多計算可以在不同前綴（prefix）之間共享——例如生成「never」與生成「up」這兩種延續，對「never going to give」這段共同前綴而言，其 key/value 應該是一樣的，不需要重算。這是因果（causal）Transformer 的性質：只要序列是 causal 的，先前 token 的 activations 不會因為後面新接上的 token 而改變（若是雙向 / bidirectional 模型，接上新 token 後全部都會變，就不能這樣快取）。

### 9. KV cache：prefill 與 generation 兩階段

基於上一點的觀察，第一個顯而易見的做法就是把 KV cache 存在 HBM 裡，讓連續的 token 生成之間可以重用。於是推理被拆成兩個階段：

- **Prefill**：拿到 prompt，把它餵過 Transformer，填滿 KV cache（每一層、每個 head 對應的 key/value）。這個階段可以像訓練一樣平行化，因為你一次看到整個 prompt。
- **Generation（decode）**：用當前的 KV cache 與最新一個 token，計算下一個 token 的分佈，取樣、把新 token 對應的 key/value 加進 KV cache，如此反覆，一次生成一個 token。

KV cache 正式定義：對每個序列（共 `B` 個）、每個 token（共 `S` 個）、每一層、每個 head，儲存一個 `H` 維向量（key 與 value 各一份）。這個設計的好處是：generation 階段雖然仍要逐一生成，但至少不必為「已經看過的 token」重新計算 KV。

### 10. MLP 層的 flops 與 arithmetic intensity（prefill vs. generation）

講者接著抽象地計算 MLP 與 attention 各自的 flops 與記憶體 I/O，用 `S`（已條件化的 token 數）與 `T`（要生成 logits 的 token 數）表示，之後再具體化成 prefill（`T = S`）與 generation（`T = 1`）兩種情形。為了聚焦重點，講者只分析矩陣乘法本身（其餘運算如 softmax flops 相對很少，且可以融合進 matmul）。

MLP 層：讀 `X`、讀所有參數、算 up projection、寫回、算 gate、寫回、算 down projection、寫回。flops 依賴於 `B、T、D、F`；bytes 傳輸則是相應的表達式。當 `B·T` 遠小於 `D` 與 `F` 時，intensity 化簡為 `≈ B·T`——這與單一矩陣乘法的結論一致，因為 MLP 本質上就是一個大矩陣乘法，而且 batch 維與序列長度維彼此獨立、互不影響。

具體到 generation（`T = 1`）：MLP 的 intensity 變成 `≈ B`。這裡 `B` 在 generation 情境下的意義是「同時處理的請求數」（number of concurrent requests）。在批次處理場景下你可以自己控制 `B`；但若是服務一個 chatbot，`B` 就是同時在線的使用者數，可能隨時間變化、難以預測——這是後面要談 continuous batching 的動機。整體而言只要 batch 夠大，MLP 在 generation 階段不算太糟。

### 11. Attention 層才是真正的瓶頸

Attention 層：讀 QKV 矩陣、算 attention（含 softmax，這部分不太重要）、算與 value 矩陣的乘積、寫回結果。flops 是 `B·S·T·D`，bytes 傳輸是對應表達式；由於這仍是矩陣乘法，flops 應該比 bytes 高一個次方，差別只在於那個係數的形式——講者算出這個係數是 `S·T / (S + T)`。

- **Prefill**（`T = S`）：intensity `= S/2`。只要序列夠長，attention 在 prefill 階段也能維持高 arithmetic intensity，這是好消息。這裡講者特別提醒：這個式子裡沒有出現 batching 維度 `B`（稍後會解釋原因）。
- **Generation**（`T = 1`）：intensity `= S/(S+1)`，恆小於 1（大致可視為 `≈ 1`）。而我們需要的 intensity 大約要到 295（以 H100 為例）才能打滿算力，所以這是壞消息——generation 階段的 attention 是真正的瓶頸。

為什麼 attention 在 generation 時不能像 MLP 一樣靠加大 batch 來救？因為 MLP 的權重對每個序列都一樣（不依賴 `B`），batch 越大，這些權重只需載入一次、就能被所有序列共用，這正是提升 arithmetic intensity 的方式。但 attention 不同：每個序列有自己專屬的 KV cache，這些量全部依賴 `B`。所以增加 `B` 並不會幫上忙——本質上是每個序列各自做一個獨立的矩陣乘法（甚至更像是很多獨立的內積），彼此無法共用權重。這正是文中一開始展示的「`B = 1` 時 intensity 為 1」那個極端例子的本質：本質上是用一個座標（而非完整矩陣）做 batching，等同於做內積，內積的 arithmetic intensity 天生就很差。

總結一句話：**prefill 是 compute-bound，generation 是 memory-bound**。整理成表：prefill 時 MLP intensity 為 `B·S`（很好）、attention intensity 為 `S/2`（尚可，長序列有幫助）；generation 時 MLP intensity 為 `B`（尚可，需要夠多同時請求）、attention intensity 恆 `≈ 1`（根本瓶頸，只要還在用 Transformer 架構，這點無法真正改善）。這也是「大家常說 inference 是 memory bound」這句話背後的原因。

### 12. Llama 2 13B on H100：具體算出 latency 與 throughput

因為 inference 是 memory-bound，只要假設通訊與計算重疊，運算所花的時間幾乎就等於搬移記憶體所需的時間——這讓分析變簡單（只需算記憶體流量），但也令人沮喪（加速器很多時候閒置沒事做）。

講者用 Llama 2 13B 在 H100 上的具體設定（序列長度、模型維度、feedforward 維度、query/KV head 數——此例沒有 GQA、`N = K`、head 維度、層數、詞表大小、H100 記憶體頻寬）走一遍計算：

- **參數量**：把 embedding、MLP、QKV 投影等加總，得到約 130 億參數，與 Llama 2 13B 的命名一致（很好的 sanity check）。
- **記憶體用量**：分成 KV cache（隨 `B` 線性成長，取決於序列長度、head 數、head 維度、層數、K 與 V 各一份、再乘 2 因為 BF16）與參數記憶體（固定，約為參數量的兩倍位元組，因 BF16）。整體記憶體大約是 `B × (KV cache 大小) + 參數記憶體`，是 `B` 的一次函數。
- **Latency**：由記憶體 I/O 決定——因為 inference 是 memory bound，latency 的形式與記憶體用量成正比（除以記憶體頻寬），因此同樣是 `B` 的線性函數。
- **Throughput**：`B` 除以 latency。

具體數字：`B = 1` 時，latency 約 0.008 秒/token，throughput 約 124 tokens/秒。隨著 `B` 增加，latency 變差（KV cache 變大，搬移它要花更多時間），throughput 改善但邊際效益遞減（因為參數的固定成本被更多序列分攤，帶來效率提升，但這種分攤終究會飽和，throughput 不可能趨向無限大）。若持續加大 `B`，記憶體會先耗盡（KV cache 大小超過 H100 記憶體容量）；換成 B200 可以撐更大 `B`，但終究還是會撞到某個上限。因此 throughput 永遠無法真正到達漸近線，會被記憶體容量先卡住。

### 13. Latency 與 throughput 的取捨，以及 TTFT

講者用公車比喻總結：小 batch size 的 latency 較好但 throughput 較差；大 batch size 的 throughput 較好但 latency 較差。個別使用者要「等公車滿了才發車」，所以等待時間（latency）較長；但公車一次能載很多人，所以整體運輸效率（throughput）很好。若要調快 TTFT（本質上就是 prefill 所花的時間），應該用較小的 batch size；若要拉高 throughput，則要用較大的 batch size——這兩個目標互相牽制，取決於服務場景要優化哪個指標。

講者也簡短提到另一個維度：parallelism，即把模型切分到多個裝置上（可參考 scaling book 的 inference 章節）。一個很平凡的例子：如果你直接開 `M` 份模型的副本，latency 不變，throughput 會變成原本的 `M` 倍。

### 14. Grouped Query Attention（GQA）：縮小 KV cache 的第一招

有了「KV cache 是 inference 的記憶體瓶頸，甚至在夠大的 batch size 下比參數量本身還大」這個認知後，第一個直覺就是想辦法縮小 KV cache（同時要小心別讓準確度掉太多）。GQA 是講者複習過的概念：multi-head attention（MHA）每個 token 都有自己的 key、value、query；GQA 則保留相同數量的 query，但只用較少數量的 group 來計算 key、value（`K` 是 group 數）。`K = N`（沒有縮減）就是 MHA；`K = 1` 稱為 multi-query attention（MQA），「幾乎沒有人用，因為效果真的很差」；GQA 則是介於兩者之間，希望在準確度與速度間找到平衡。

講者引用一篇 2023 年提出 GQA 的論文的圖：以「每筆樣本所需時間」（同時關聯 latency 與 throughput）對比 `K`——MHA（全 attention）時間最長；`K = 1` 快很多；一路增加到 `K = 8` 仍然表現不錯；再往上時間才明顯回升。GQA 能改善 latency 與 throughput 的原因很直接：它把 KV cache 縮小了 `N/K` 倍，而縮小記憶體用量直接轉化成速度提升（因為 memory-bound）。

講者把 GQA 套進 Llama 例子：用批次 64 為例，改用 GQA（例如 group 稀疏度約 1:5 這個量級）大幅縮小記憶體，latency 與 throughput 同時改善——這說明 latency 與 throughput 未必總是互斥，若能真正縮小記憶體用量，兩者可以同時變好；真正互斥的是「調整 batch 維度」這個槓桿。進一步把 batch size 加大（原本 256 會爆記憶體，現在因為 KV cache 變小而能塞進去），latency 稍微變差，但 throughput 等比例上升——顯示可以把「縮小 KV cache」與「加大 batch size」兩個槓桿一起調整。

任何有損（lossy）改動都要檢查準確度：GQA 論文在多個評測上顯示效果不錯。但講者特別提醒要抱持保留態度——之後會提到 DeepSeek 的論文顯示 GQA 其實會傷害效果，「不只是數學,一切都要打個折扣來看」。

### 15. Multi-head Latent Attention（MLA，DeepSeek）：壓縮而非減少 head 數

MLA 是縮小 KV cache 的另一個想法。與 GQA 不同：MHA 對每個 token 有相同數量的 key/value；GQA 減少的是「每個 token 對應的 key/value 數量」；MLA 則保留每個 token 各自的 key/value 數量不變，但把用來算 key/value 的表徵先壓縮：正常做法是把 activations 乘上矩陣得到形狀約為 `N × H`（等於模型維度，通常很大）的 key、value；MLA 則先把 activations 投影到一個更小的 `C` 維空間（DeepSeek V2 把它從約 16000 壓縮到 512，是相當激進的壓縮），只儲存這個 `C` 維表徵，需要時再從中還原（materialize）出 key 與 value。

有個小麻煩：MLA 與直接作用在 key/value 上的 RoPE 不相容，所以 DeepSeek 額外加了一些維度專門處理 RoPE。整體而言 KV cache 依然大幅縮小，latency 與 throughput 的改善就是簡單的數學：KV cache 越小，速度越快，幾乎接近線性地縮放，直到某個點；同樣要檢查準確度。

這裡出現一個有趣的「結果對立」：MLA 論文的比較表顯示 GQA 其實表現不太好，而 MLA 的表現與 MHA 差不多甚至略好——與前一個 GQA 論文自己展示的正面結果形成張力，講者的態度是「大致差不多，看你要相信哪篇論文的評測方式」。

Q&A：有學生問「這和直接縮小模型維度相比如何？」講者坦承沒有對應的 ablation，猜測直接、無差別地縮小模型維度可能整體上更糟；這類壓縮技巧的訣竅在於「找到模型裡真正可以被擠壓的地方」，而這件事沒有先驗答案，只能靠實驗摸索。

### 16. Cross-Layer Attention（CLA）：跨層共享 KV cache

另一個縮小 KV cache 的想法是 CLA：正常情況每一層都各自算自己的 key/value；CLA 則只在部分層計算 KV，其餘層直接沿用前一層算好的 KV cache。這相當於「GQA 在 head 維度上共享 KV」的另一個版本——這次是在層（layer）維度上共享。講者引用一篇論文的實證結果：這種做法改善了 Pareto frontier（同樣的 KV cache 大小下品質更好，或同樣品質下 KV cache 更小），比單純調整 `K`（group 數）與 head 維度更有效。

### 17. Local / Sliding Window Attention 與 Linear Attention

Local（sliding window）attention 是相對古老、很自然的想法：完整 attention 矩陣是 `n²`；sliding window 則讓每個要生成的 token 只看最近的 `K` 個 token。這樣一來 KV cache 大小與序列長度無關，只跟批次維度等其他變數有關——對長 context 特別有利。因為經過多層堆疊，資訊可以沿著深度往下傳遞，實際有效的 context 長度會比表面設定的窗口大小更長。也可以做得更花俏：不用密集地在每層都做，可以把 layer 錯開分佈；或做「global + sliding window」，讓每個 token 除了看局部窗口，也固定看一組全域 grid 上的 token。

問題是：這種做法確實會傷害準確度（減少了表達力），講者的說法是「天下沒有白吃的午餐——至少這頓午餐很貴」。解法是把 local attention 與 global（完整）attention 交錯（interleave）：一部分層用完整 attention，一部分層用 local attention，形成 hybrid 模型，在準確度與速度之間取得平衡。

Q&A 中學生追問 linear attention 與 sliding window 的取捨。講者簡短介紹：linear attention 不儲存完整 KV cache，而是把歷史壓縮成某種固定大小的表徵——最樸素的版本直接把所有 KV 加總成單一向量（因此天生與序列長度無關）；更精緻的版本如 GatedNet、DeltaNet、Mamba，試圖在壓縮的同時盡量「不遺忘」。這些方法也被用來取代 sliding window attention，效果不錯，也可以把完整 attention、sliding window attention、linear attention 三者混合使用，因為它們捕捉的是不同性質——需要局部高解析度資訊時 sliding window 較好；只需要對過去做粗略摘要時 linear attention 可能較好。

對「長 context 是否適合用 linear attention」，講者的回答強調沒有免費午餐：如果需要在極長的歷史裡做「大海撈針」（needle in a haystack）式的精確檢索，把整個歷史壓縮進一個小狀態必然會遺失資訊，可能就是找不回來。另一位學生進一步追問 Mamba/DeltaNet 與 sliding window 的具體 trade-off，講者的看法是：Mamba、DeltaNet 這類方法在表達力上比 sliding window attention 更強，因為它們的遞迴（recurrence）某種程度上可以模擬「只看最後一個 state」，等同能表現出 sliding window 的某些行為；換句話說一旦選擇 sliding window attention，能力就固定在那裡了，而 linear attention 這條路線上還有更多「空間」可以擴展。

### 18. DeepSeek 持續在 attention 上創新：Sparse / Compressed Attention

講者快速帶過 DeepSeek 後續的創新：除了前面提到的 multi-latent attention（壓縮 key/value），DeepSeek 還提出所謂的 compressed sparse attention／DeepSeek sparse attention／heavily compressed attention（講者坦言記不清所有縮寫代表什麼）。概念大致是：先把每 `M` 個 token 壓縮成一個 token（compressed attention）；接著 DeepSeek sparse attention 從中挑出一個子集保留下來——挑選方式是先用較輕量的 query/key 做一次小規模 attention 算出 index score，藉此快速判斷哪些 token 值得保留；之後再對挑出的子集做進一步壓縮。

### 19. 縮小 KV cache 這條主線的總結

這一整段（GQA、MLA、CLA、sliding window、linear attention、DeepSeek sparse attention）的共同目標都是縮小 KV cache——因為 KV cache 與記憶體直接掛勾，而我們已經看到 inference 是 memory-bound，縮小 KV cache 就直接轉化為 throughput 與 latency 的改善。手法可以是跨層、跨 head、跨 head 維度做低維 KV cache，或是 local attention、linear attention 等等。講者也順帶提到 diffusion model：一種非自回歸（non-autoregressive）的生成方式，可能大幅加快生成速度，但本講並未深入展開。

### 20. Quantization：系統層面而非架構層面的壓縮

Quantization 被講者定位為「較少是架構、較多是系統角度」的加速手段：核心想法就是降低數字的精度（從 BF16 一路降到 INT4），記憶體變少直接帶來 latency 與 throughput 改善，同樣要擔心準確度。

- **Quantization-aware training（QAT）**：如果擔心 quantization 傷害太大，可以在訓練時就把 quantization 考慮進去——在 forward pass 中做 quantize / dequantize，模擬量化誤差。這樣權重會逐漸適應量化，效果通常較好，缺點是需要昂貴的大規模訓練。
- **Post-training quantization（PTQ）**：訓練完之後才量化，通常便宜得多。
  - 樸素做法：對每個 layer 或 tensor 各自決定 scale 與 zero point，再各自量化；效果通常不夠好。
  - **GPTQ**：利用 Hessian 資訊，逐層（layer by layer）量化，並追蹤誤差、把誤差傳播、修正到尚未量化的權重上，藉此補償量化帶來的誤差。
  - **Activation-aware quantization**：觀察某些 activation channel 的數值特別大，而與這些 channel 互動的權重相對更重要，因此應該給這些權重分配更高精度。具體做法：把 FP16 權重矩陣量化到（例如）INT3，但先找出哪些 activation channel 普遍偏大，對這些 channel 對應的權重保留較高精度（例如 FP16），其餘維持低精度（例如 INT3）。

### 21. Model Pruning 與蒸餾式修復

另一個想法是模型剪枝：拿一個大模型，剪掉一部分（估計各部分重要性後，剪掉相對不重要的 hidden unit、甚至整層），然後修復它。修剪完的模型「不會很好」，所以下一步是 post-train：在你關心的資料或任務上繼續訓練一段時間，把它「治好」（heal）。

講者引用 Nvidia 的一篇論文：把一個 15B 模型剪成 8B，準確度沒有掉太多，而且花費的（修復）訓練量遠少於從頭訓練一個等大模型。本質上這是一種「用一個好模型的部分權重去初始化較快架構」的蒸餾式訓練。

Q&A：學生問如何判斷哪些層／單元重要。講者說法是：準備一個 calibration set，把輸入跑過模型，觀察 activation 的量級；接近零（尤其是「死掉的」單元）可以判定不重要，數值大的則要保留。另一位學生追問：如果一個神經元對所有輸入都恆為高值（例如恆為 100），這是否代表它有意義，還是只是訓練過程的人為產物？講者的回答是：這確實是一種經驗觀察（某些 channel 天生比其他 channel 數值大很多），這些技巧能奏效正是因為這個現象真的存在；但如果數值恆高（高均值、低變異數），不能直接移除（移除會整個崩壞），此時或許可以換一種方式——把它當作一個 bias 項納入，而不是硬性刪除。

### 22. 縮小規模的總結：兩條路徑

本段小結：目標是縮小 inference 複雜度（可以理解為減少參數量或減少 KV cache），同時不傷準確度。可以走兩條路：(1) 直接設計一個更快的架構，重新訓練；(2) 設計一個更快的架構，但用原模型（架構可能不同）的權重去初始化，做出一個「科學怪人」式的拼裝模型，再透過蒸餾修復這個較快模型。

### 23. Speculative Decoding：無損的加速技巧

前面談的都是有損（lossy）方法。Speculative decoding（也稱 speculative sampling）則是一種優雅的無損方法。關鍵觀察：如果做 prefill，可以平行地對整段序列打分（同時得到機率），這是快的、compute-bound、各種好處都有；但 generation 必須一次一個 token。也就是說，「檢查」一段序列比「生成」一段序列快很多——如果你給我一段序列，我判斷它好不好，遠比一個一個生成快。

因此可以利用這個不對稱性：用一個便宜的 draft 模型（`P`）先生成幾個 token 的猜測（例如四個），再用真正在意的、昂貴的目標模型（`Q`）批次地檢查（review）這些猜測，決定接受或拒絕。這樣安排的目的是平衡：draft 模型雖然是 memory-bound、必須一個個生成，但因為模型小所以還好；目標模型雖然大且貴，但只需要平行處理一批 token（像 prefill 一樣），所以也還好。

**演算法**：從 draft 模型 `P` 取樣 `K` 個 token；平行地用目標模型 `Q` 算出這些 draft token 的 logits；決定接受或拒絕——以機率 `min(1, Q/P)` 接受（`Q` 相對 `P` 越大，越傾向接受）；否則從殘差分佈（residual distribution，即 `Q` 減去 `P` 之後標準化調整的分佈）取樣並結束這一輪。這本質上是拒絕取樣（rejection sampling）的變體，差別在於一般的 rejection sampling 拒絕時「什麼都得不到」，但這個演算法保證每一輪都能拿到一個確實服從目標模型 `Q` 的精確樣本。講者略過完整證明，但表示論證方式與一般 rejection sampling 相同。

原始論文顯示這樣做確實更快；draft token 數太少，沒有充分利用目標模型的批次處理能力；draft token 數太多，被拒絕的機率上升。存在一個甜蜜點（原論文的例子大約在三到四個 token 左右）。一般而言 draft 模型要遠比目標模型小，理想上希望 draft 模型盡量逼近目標模型的分佈——這意味著你會想要蒸餾（distill）出這樣一個 draft 模型。也因此，前面談過的所有壓縮技巧（GQA、MLA、量化、剪枝……）都可以拿來當作 draft 模型的候選：如果壓縮出來的模型本身已經夠好，就直接拿去服務；如果還不夠好，至少可以拿它當 draft 模型，讓完整模型負責修正它。

### 24. 動態工作負載：Continuous Batching 與 Selective Batching

前面的分析都建立在乾淨、規則的批次上，但真實情境是服務一個即時網站：請求在不同時間抵達，有不同的共享前綴，長度也各不相同——遠比訓練時那種整齊劃一的區塊複雜、混亂得多。

**Continuous batching**（源自一個叫 Orca 的系統，是很早期、很有影響力的設計）：概念是每一步為批次中所有序列各解碼一個 token；下一步再為所有序列各解碼下一個 token；一旦某個序列結束，就把它從批次中移除；新請求抵達時就加入批次繼續處理。因為批次的組成會動態更新（舊序列被移除、新序列加入），所以稱為 continuous batching。

問題是：一般的 batching 要求所有序列有相同的維度（張量的每個切片形狀一致），但這裡每個請求的長度不同。對 attention 運算而言，長度不同的序列（例如 3×3 與 9×9 的 attention 矩陣）無法有效地共用張量，這部分無法迴避；但對於不涉及 attention 的 MLP 層（佔了大部分 flops），可以把不同長度的序列直接串接（concatenate）成一個大的「巨型序列」一起處理——這就是 **selective batching** 的概念：attention 分別算，MLP 合併算。

### 25. PagedAttention：把 KV cache 的儲存問題當作作業系統問題

最後一個主要想法是 PagedAttention，出自 vLLM 論文（雖然 vLLM 現在已經有很多其他附加功能，但這是當時的核心概念）。問題是：KV cache 該怎麼存放？如果請求陸續抵達，就必須把它們放進記憶體的某處，一般會遇到碎片化（fragmentation）問題——這和硬碟過去會發生的情況一樣，需要「重整磁碟（defrag）」。

碎片化分兩種：**內部碎片化**（internal fragmentation）——因為你事先不知道一個序列什麼時候會結束，可能設定最大 token 上限（例如 1024），必須先把這整塊記憶體都預留起來，但在生成到達上限之前，這塊預留空間裡什麼都放不進去，非常浪費；**外部碎片化**（external fragmentation）——不同請求之間可能留有空隙，這些空隙太小而無法有效利用，也是浪費。

解法是拿系統人熟悉的作業系統手法來用：既然這個問題以前就解決過（虛擬記憶體分頁），就直接套用同一套想法。把一個序列的 KV cache 切成不連續（non-contiguous）的固定大小區塊（例如以「Four score and seven years ago our fathers brought forth」這句話為例，切成大小為 4 的區塊）。區塊實際放在記憶體的哪裡不重要，只要維護索引、知道每塊放在哪裡，區塊彼此之間即使實體位置分散也沒關係，邏輯上仍是對齊、有序的。

這個設計帶來一個重要好處：兩個請求如果共享前綴，就可以直接共享同一批 KV cache 區塊。例如很多請求共用同一個 system prompt 時，這個 system prompt 對應的 KV cache 只要算一次，之後所有 query 都能重用，不必每個請求都重算一次。另一個常見情境是：同一個 prompt 想要生成多個不同的回應（多個 samples），這時 prompt 部分的 KV cache 可以共用，只有各自生成的回應部分是獨立的。講者用「fourscore and seven years ago are blank」為例：多個延續一開始共用「fourscore and seven」這幾個區塊；如果不同延續恰好取樣到相同 token，就繼續共用同一區塊；一旦取樣到不同 token，就把該區塊「複製後分裂」（**copy-on-write** 語意），各自沿自己的分支繼續——這樣就能盡可能地共用前綴快取。講者提到還有許多其他優化（例如特定 kernel），因時間關係略過。

### 26. 全講總結與對未來架構的展望

講者總結：inference 非常重要，即使用的是同一個模型，inference 也是與訓練截然不同的工作負載——它是 memory-bound 的，而且（在即時 chatbot 場景下）是動態的。本講看過的技巧包括：quantization、新架構設計（各種 KV cache 縮減手法）、剪枝與蒸餾、speculative sampling，這些都遵循同一個原則：縮小 KV cache，但不要過度傷害準確度；此外也有系統面的想法，例如 paging 與（某種意義上的）speculative execution，可以應用在真正的、線上的 inference 伺服器上。

講者最後補充一個沒有充分展開、但被強調「潛力巨大」的方向：新架構——像是 state space model（狀態空間模型）、linear attention、diffusion model。某種程度上，KV cache 與 Transformer attention 的建構方式，從根本上使它成為一種「對 inference 不友善」的架構；如果能設計出一種從一開始就是為 inference 而生（而非像 Transformer 那樣事後才被迫加各種補丁）的新架構，可能可以解鎖巨大的效能空間。講完後預告下一講由 Tatsu 回歸，講 Scaling Laws Part 2。

## 重要定義、公式、演算法、工程限制、例子與問答

### 定義

- **TTFT（time to first token）**：從送出 query 到第一個生成 token 出現所花的時間，本質上等於 prefill 所需時間。
- **Latency**：單一使用者視角下，token 串流出現的速度。
- **Throughput**：多個 query 合計下，每秒生成的 token 數。
- **Prefill**：inference 的第一階段，把 prompt 編碼、填滿 KV cache；可平行化。
- **Generation / decode**：inference 的第二階段，依序、一次一個 token 生成。
- **KV cache**：對每個序列、每個 token、每層、每個 head，儲存的 key、value 向量集合，用來避免重算已看過 token 的 attention 表徵。
- **Arithmetic intensity**：flops 除以搬移的 bytes 數。
- **Accelerator intensity**：硬體 flops/秒除以記憶體頻寬。
- **Compute-bound / memory-bound**：computational intensity 大於／小於 accelerator intensity。
- **MHA / GQA / MQA**：multi-head attention（`K = N`，無縮減）、grouped query attention（`K` 個 group，`G` 個 head/group，`N = K·G`）、multi-query attention（`K = 1`，效果差、少用）。
- **MLA（multi-head latent attention）**：把 key/value 的來源表徵先投影壓縮到低維 `C`，需要時再還原出 key/value。
- **CLA（cross-layer attention）**：只在部分層計算 KV，其餘層沿用前一層的 KV cache。
- **Local / sliding window attention**：每個生成 token 只 attend 最近的 `K` 個 token。
- **Linear attention**：把歷史壓縮成固定大小表徵而非完整 KV cache，例如純加總、GatedNet、DeltaNet、Mamba。
- **Quantization**：降低數字表示精度以縮小記憶體用量；QAT 在訓練時模擬量化誤差，PTQ 在訓練後才量化；GPTQ 用 Hessian 資訊逐層量化並修正誤差；activation-aware quantization 針對數值偏大的 activation channel 保留較高精度。
- **Model pruning**：剪掉大模型的部分單元／層，再以 post-training／蒸餾修復。
- **Speculative decoding（speculative sampling）**：用小的 draft 模型生成候選 token，大的 target 模型平行驗證、接受或拒絕，保證取樣結果精確服從 target 分佈。
- **Continuous batching**：動態地把完成的序列移出批次、新請求加入批次，讓批次組成隨時間持續變化。
- **Selective batching**：attention 因序列長度不同無法共用張量、需分別計算；MLP 則可將不同序列串接成一個大序列一起計算。
- **PagedAttention**：把 KV cache 切成非連續的固定大小區塊，以類似作業系統分頁（paging）的方式管理，支援跨請求共享前綴 KV cache 與 copy-on-write。

### 公式

矩陣乘法（`B×D` 乘 `D×F`）的 arithmetic intensity：

```text
flops ≈ 2·B·D·F
bytes ≈ 2BD + 2DF + 2BF
intensity = flops / bytes → B   (當 B ≪ D, F)
```

樸素自回歸生成（無 KV cache）：

```text
每個 token 的生成成本 ≈ O(T^2)
生成 T 個 token 的總成本 ≈ O(T^3)
```

MLP 層 arithmetic intensity：

```text
intensity ≈ B·T   （抽象形式，B·T ≪ D, F 時）
generation（T = 1）：intensity ≈ B
```

Attention 層 arithmetic intensity：

```text
intensity 因子 = S·T / (S + T)
prefill（T = S）：intensity = S / 2
generation（T = 1）：intensity = S / (S + 1) ≈ 1
```

KV cache 與整體記憶體、latency、throughput（Llama 例子形式）：

```text
KV cache（每序列） ∝ S × (K or N) × H × layers × 2(K,V) × 2 bytes(BF16)
total memory ≈ B × KV_cache_per_seq + parameter_memory
latency ≈ total memory / memory_bandwidth   （B 的一次函數）
throughput = B / latency
```

GQA 對 KV cache 的縮減：

```text
KV cache 縮小倍率 = N / K
```

平行副本（trivial parallelism）：

```text
M 份模型副本：throughput × M，latency 不變
```

Speculative decoding 接受機率：

```text
accept with probability min(1, Q(x) / P(x))
若拒絕，改從殘差分佈取樣並結束該輪
```

### 演算法

- **KV cache 生成流程**：prefill 階段用完整 prompt 一次性填滿 KV cache（可平行化）；generation 階段每步只處理新 token，讀取並更新 KV cache，重複直到結束。
- **Speculative decoding**：(1) 用 draft 模型 `P` 取樣 `K` 個候選 token；(2) 用 target 模型 `Q` 平行算出這些候選 token 的 logits／機率；(3) 依序逐一以機率 `min(1, Q/P)` 判定接受或拒絕，一旦拒絕便從殘差分佈取樣一個 token 並終止本輪；(4) 進入下一輪，重複挑選新的 draft token。
- **Continuous batching（Orca 概念）**：每一個 decode step 為批次內所有仍在生成的序列各解碼一個 token；序列完成後即從批次中移除；新請求隨時可插入批次；attention 因序列長度不同須逐一計算，MLP 可將所有序列串接成單一大序列一起算（selective batching）。
- **PagedAttention 的區塊管理**：把每個序列的 KV cache 切成固定大小、可分散存放的區塊，以索引表追蹤區塊位置；共享前綴（如 system prompt 或同一 prompt 的多個 samples）可共用相同區塊；當共享的分支取樣出不同 token 時，觸發 copy-on-write，複製並分裂區塊。

### 工程限制

- Inference 無法在序列維度上平行化（自回歸生成），因此天生難以達到高 arithmetic intensity。
- Generation 階段的 attention 是無法迴避的記憶體瓶頸：只要仍使用標準 Transformer 架構，這點就無法真正解決。
- KV cache 會隨批次大小與序列長度成長，在夠大的 batch size 下甚至可能超過參數本身佔用的記憶體，並可能超出加速器（如 H100/B200）的可用記憶體容量，限制可用的最大 batch size。
- Latency 與 throughput 互相牽制：小 batch 有利 latency，大 batch 有利 throughput；TTFT 與吞吐量的最佳化方向也彼此衝突。
- 幾乎所有壓縮手法（GQA、MLA、量化、剪枝、local/linear attention）都是有損的，必須額外驗證準確度，且不同論文對同一手法的評測結果可能互相矛盾（例如 GQA 論文與 MLA 論文對 GQA 準確度的評價不一致）。
- MLA 與直接作用在 key/value 上的 RoPE 不相容，需要額外維度處理。
- Local/sliding window attention 會降低模型表達力，需要與 global attention 混合使用來平衡準確度與速度。
- 動態服務場景（continuous batching）中，序列長度不一致使得 attention 無法直接跨序列共用張量，只有 MLP 部分能靠串接序列來共用計算。
- KV cache 儲存本身有內部與外部碎片化問題，需要類似作業系統分頁的機制（PagedAttention）來解決。

### 例子

- OpenAI 每天生成約 8.6 兆 token，對比 GPT-4 訓練用了 32 兆 token：不到 4 天，inference 產生的 token（compute）就追上訓練 GPT-4 所需的量。
- 開源 inference 工具：vLLM、SGLang（適合 agentic workload）、Nvidia TensorRT（快但窄）、llama.cpp（CPU 推論）。
- Llama 2 13B 在 H100 上的具體 latency/throughput 計算：batch size 為 1 時 latency 約 0.008 秒/token、throughput 約 124 tokens/秒；批次加大時 latency 上升、throughput 上升但邊際遞減，最終受限於記憶體容量。
- GQA 2023 論文的 time-per-sample 圖：MHA 慢，`K=1`（MQA）快很多，`K=8` 仍表現良好，之後時間回升。
- DeepSeek V2 的 MLA：把 key/value 來源表徵從約 16000 維壓縮到 512 維。
- Nvidia 剪枝論文：15B 模型剪成 8B，準確度損失有限，且修復訓練成本遠低於從頭訓練。
- Orca 系統：continuous batching 的早期代表性系統。
- vLLM 論文：PagedAttention，以「Four score and seven years ago our fathers brought forth」為例說明區塊切分；以「fourscore and seven years ago are blank」的多個延續為例說明 copy-on-write 的前綴共享。

### 問答重點

- 學生質疑 GQA 記號中 `K`／`G` 分別代表什麼；講者當場修正：`K` 應為 group 數，`G` 為每個 group 內的 head 數。
- 學生問 MLA／KV cache 壓縮與「直接縮小模型維度」相比如何；講者坦承沒有對應 ablation，猜測無差別地縮小整體維度效果更差，關鍵在於找到模型中真正可壓縮的位置，這需要實驗而非先驗判斷。
- 學生問剪枝時如何判斷重要／不重要的層或單元；講者答：用 calibration set 觀察 activation 量級，接近零（含「死掉的」單元）可判定不重要。
- 學生追問「若某單元對所有輸入恆為高值（如恆為 100），是否代表它有意義，還是訓練產物」；講者答：這是經驗上真實存在的現象（某些 channel 天生數值較大），若是高均值、低變異數的情況，也許不必刪除，而是把它當作 bias 項處理。
- 學生問 linear attention 與 sliding window attention 的取捨；講者答：兩者服務不同目的（局部高解析度 vs. 粗略歷史摘要），可混合使用；沒有免費午餐——長 context 下若需要精確檢索（needle in haystack），壓縮歷史必然遺失資訊。
- 學生進一步追問 Mamba/DeltaNet 相較 sliding window 的具體優劣；講者答：Mamba/DeltaNet 表達力更強，理論上能模擬 sliding window 的部分行為（透過只看最近 state 的遞迴），因此「還有更多空間」，而 sliding window 一旦選定就沒有更多彈性。

## 從零實作語言模型的意義

1. **需要實作什麼**：一個可用的 inference pipeline 至少要實作 KV cache（分配、讀寫、隨生成成長）、prefill／generation 兩階段的分流邏輯、以及某種形式的 batching（哪怕只是最簡單的靜態批次）。若要貼近業界實務，還需理解 continuous batching 與類似 PagedAttention 的記憶體管理，這些屬於系統工程而非單純模型程式碼。
2. **需要理解什麼取捨**：從零實作時必須清楚意識到 inference 是 memory-bound、而非 compute-bound 的工作負載；任何「讓模型變快」的介入，都應該先問「這樣做能不能縮小要搬移的記憶體量（尤其是 KV cache）」，而不是直覺地想著減少 flops。同時要理解 latency 與 throughput 是一組真正互斥的取捨，選擇 batch size 本質上是在選擇你要優化哪個指標。
3. **會影響哪些後續章節**：本講許多想法直接呼應先前的架構與系統章節——GQA、MoE 等架構選擇（Lecture 3/4）在這裡有了明確的推論成本理由；arithmetic intensity、記憶體頻寬（Lecture 2、5）是貫穿全講的分析工具；量化、kernel 相關概念（Lecture 6）在此被用於 inference 情境。往後看，Lecture 11 的 Scaling Laws Part 2、Lecture 12 Evaluation（需要生成）、以及後續 post-training／RL 章節（rollout 生成）都會直接用到本講的 inference 直覺與詞彙。

## 跨章連結

- 前置章節：Lecture 2（PyTorch/einops，arithmetic intensity 分析工具的原始出處）、Lecture 3/4（架構，GQA、MoE 等已於此處被引用並賦予推論成本的解釋）、Lecture 5（GPU/TPU，H100 記憶體頻寬、HBM 概念）、Lecture 6（kernel/Triton，量化與 kernel 融合相關背景）、Lecture 7/8（parallelism，本講簡短提及模型分片與多副本 throughput 擴展）、Lecture 9（scaling laws，「overtraining／serving 成本」的討論已預告本講會談 inference 成本如何回頭影響訓練決策）。
- 後續章節：Lecture 11（Scaling Laws Part 2，由 Tatsu 接手）；Lecture 12（Evaluation，需要生成式評估，直接用到本講的 inference 效率概念）；Lecture 15/16（post-training/RLHF/RLVR，rollout 生成需要 inference，本講開頭已提及）。
- 需要回頭補充的術語：GQA、MoE 的「active/total parameters」等概念若尚未在 Lecture 3/4 章節中明確定義，建議由主控 agent 檢查術語是否一致；KV cache、arithmetic intensity 等詞若在更早章節已出現，需確認翻譯與定義一致。
- 需要新增的圖表候選（待材料階段確認是否已有官方圖可用）：Transformer block 的張量形狀「電路圖」、KV cache prefill/generation 兩階段流程圖、latency-throughput trade-off 曲線、PagedAttention 區塊分頁示意圖、speculative decoding 的 draft/target 互動示意圖。

## 相關作業與材料

此段只建立關聯，不提供作業解答。

- Course material：Lecture 10 lecture code `data/Stanford CS336 Language Modeling from Scratch/cs336_materials/lectures-main/lecture_10.py`；trace `var/traces/lecture_10.json`。皆已下載，待材料階段閱讀。
- Assignment 關聯：依 `plan/cs336-materials-plan.md` 課程排程表，本講對應 Assignment 2 due、Assignment 3 out；Assignment 2（Systems）涉及 profiling、Triton FlashAttention2、記憶體效率分散式訓練，與本講的 arithmetic intensity、記憶體頻寬分析工具直接相關；Assignment 3（Scaling）與下一講的 scaling laws 更直接相關。本筆記未閱讀 Assignment 2/3 repo 內容，不展開細節。
- 本地材料路徑：`data/Stanford CS336 Language Modeling from Scratch/code/assignment2-systems-main/`、`data/Stanford CS336 Language Modeling from Scratch/code/assignment3-scaling-main/`（皆已下載，待閱讀）。
- 材料狀態：待材料階段閱讀（lecture code、trace、assignment repo 均尚未讀取內容）。
- 缺少的材料或 URL：講者多次提到的「Google 的 scaling book（關於 transformer 與 inference 的章節）」是本講許多圖表與敘述的引用來源，但本地未見該材料，也沒有 URL；若要在書稿中更精確重現圖表或公式，需要使用者提供該書的檔案或連結。GQA 2023 論文、MLA/DeepSeek V2 論文、CLA 論文、NVIDIA 剪枝論文、GPTQ 論文、activation-aware quantization 論文、Orca 論文、vLLM/PagedAttention 論文的確切標題、作者與連結，逐字稿中均未給出，需材料階段或使用者提供。

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| Transformer block「電路圖」的精確圖示 | Lecture 10 slides/code 或講者投影片 | 待材料階段閱讀 `lecture_10.py`，確認是否含對應圖示或程式碼 |
| GQA 記號的最終正確版本（K/G 定義） | 講者本人事後修正的投影片 | 逐字稿內已有口頭修正，本筆記採用修正後版本，但仍待投影片核對 |
| Google scaling book 的具體章節、公式、圖表 | 該書檔案或 URL | 待使用者提供，暫不外查 |
| GQA（2023）、MLA/DeepSeek V2、CLA、NVIDIA 剪枝、GPTQ、activation-aware quantization、Orca、vLLM/PagedAttention 等論文的正式標題與連結 | 對應論文全文或課程材料引用列表 | 待材料階段或外部補充階段查核，本筆記不外查 |
| 具體數值（如 Llama 2 13B 例子中各 config 的確切數字、H100 記憶體頻寬數值） | Lecture 10 slides 或 trace 檔 | 待材料階段從 `lecture_10.py`／trace 核對 |
| 講者姓名 | 課程官網或材料計畫已排定為 Percy，但逐字稿本身未自報姓名 | 依材料計畫記錄，標注為推斷而非逐字稿直接證據 |
| DeepSeek Sparse Attention 各縮寫的正式名稱與定義 | DeepSeek 官方論文 | 待材料階段或外部補充階段查核 |

## 暫不處理的外部補充

- 不外查 Google 的 scaling book（transformer/inference 章節）。
- 不外查 GQA（2023）論文原文。
- 不外查 DeepSeek V2 / MLA、DeepSeek Sparse Attention 相關論文。
- 不外查 Cross-Layer Attention 論文。
- 不外查 NVIDIA 剪枝論文、GPTQ 論文、activation-aware quantization（如 AWQ 類方法）論文。
- 不外查 Orca 論文、vLLM/PagedAttention 論文。
- 不外查 Mamba、DeltaNet、GatedNet 等 linear attention / state space model 原始論文。
- 不外查任何 speculative decoding 後續文獻。

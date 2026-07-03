# Lecture 18：Guest Lecture — Dan Fu（Inference / Mega Kernels / Parse）閱讀筆記

## 基本資料

- 課程：Stanford CS336 Language Modeling from Scratch, Spring 2026
- 講次：Lecture 18, Guest Lecture: Dan Fu
- 逐字稿檔案：`data/cs336/transcripts/18_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Guest_Lecture_Dan_Fu.txt`
- 完整閱讀範圍：第 1 行到第 1914 行（`wc -l` 回報 1913 行，最後一行為 "Thanks so much for having me." 無結尾換行）
- 總行數：1913（內容讀到檔案最後一句）
- 本筆記限制：未使用網路搜尋，未加入逐字稿外部資料。所有模型／硬體／論文名稱（Groq、Cerebras、SambaNova、NVL72、Nemotron、DeepSeek、Thunderkittens、Parse、recurrent depth、Claude Mythos 等）皆只依講者口頭描述整理，ASR 疑似誤轉寫者保留原文並標「存疑」，不外查原始論文或官方資料。
- 相關材料狀態：本講為客座講座，講者明言投影片全由 Nano Banana Pro（AI 圖像生成）產生、「近看會有錯字」；plan/材料清單中是否有對應 code/slide 待主控確認。

## 逐字稿完整閱讀紀錄

閱讀範圍確認：

- 起點：第 1 行（"Cool. Yeah. So, so thanks so much uh everyone for coming."）
- 終點：第 1914 行（"Thanks so much for having me."）
- 是否從頭到尾完整閱讀：是，分四段（1–480、480–960、960–1440、1440–1914）依序讀完全部內容，未跳段、未只用搜尋或抽樣。
- 跳過段落：無。

## 講者身分疑點（需主控複查）

- 逐字稿內講者明確自我介紹：代表兩個組織——UCSD（自述有一個 small lab）與 Together（AI cloud，提供 GPU、inference、fine-tuning），並感謝 Percy 邀請。講座主題為 inference、mega kernels（Stanford × Together 合作，Thunderkittens）與 Parse（UCSD lab，由 Hayden 主導，Zachary、Taylor 協作）。
- 這些內容與章節標題「Dan Fu」一致（Dan Fu 與 Together、Stanford 系統/kernel 研究相符）。逐字稿內部沒有出現與「Daniel Selsam」相符的自我介紹或主題。
- tracker 已知疑點為課程排程 June 1 Daniel Selsam vs 逐字稿標題 Dan Fu。依鐵律，我不自行推斷或修正講者身分：**以逐字稿實際內容為準，內容全程指向 Dan Fu**，但排程對應問題仍標為需主控最終複查。

## 本講主問題

這一講從「模型訓練完成之後的另一面」切入：一旦你有了一個語言模型，要怎麼把它 serve 出去、做 inference，把電力（GPU）變成 token、變成 intelligence？講者主張若能深入理解 inference 與底層 GPU kernel，就能打通從演算法到硬體的 full-stack 創新。全講分三段：(1) 一個 token 的一生（inference engine 全貌與工程選擇）；(2) 研究專案一 mega kernels（讓 decode 逼近記憶體頻寬極限）；(3) 研究專案二 Parse（用 loop/recurrent transformer 追求「每個參數的智慧」，並用 SSM 理論穩定訓練）。

## 核心概念

### 1. Inference 是把電力變成智慧的引擎

講者以類比開場：我們正經歷一場新工業革命（呼應 1902 年曼哈頓 13 萬匹working horse 的糞便危機，1898 年開會結論「無解、只能忍」，但 1912 年汽車數量已超過馬——十年翻轉；語言模型的「1912 時刻」大約發生在去年）。GPU 是新的石油（數千億美元、主權基金級投資湧入），但石油要有引擎才有用——inference engine、GPU kernel 就是把 GPU（Percy 說的「沙子」）變成可用智慧的引擎。ML 模型只是「存在於以太中的運算 DAG」，真正要 programming 的是把它 map 到 GPU 上的 kernel。核心 takeaway：理解 inference 與 kernel → 可以做 full-stack 創新。

### 2. 一個 token 的一生（inference engine 全貌）

投影片改編自其學生 Austin 在 Together 的簡報。一個 request 進來的流程：
- 排程到不同 GPU，可能 disaggregated prefill/decode 在不同機器。
- 對 KV cache 查詢「這個 request（或其版本）我看過嗎？有沒有可省的 compute？」
- 執行核心 ML 運算，可跨 node、跨 GPU 平行化（依模型大小與切法）。
- 最後 sample 出 token，做後處理（找 stop token、safety check），輸出字串。
- engine 就在這個 scheduling → execution → token sampling 迴圈裡不斷等 request。

### 3. Workload 的形狀：production 流量與訓練/想像都不一樣

不同 workload 有不同的 input/output token 分布：
- coding（如 cursor，把整個 codebase 給 agent）：input 常達數萬 token，output 視是否 thinking 而定。
- narrative summarization（把整本書貼進 chat 再來回討論）與 standard chat（「解釋一階微積分」）形狀差很多。
- 今日多為 turn-based agentic workflow：多輪來回、agent 會自行 invoke 工具（搜尋 codebase、上網查）再餵回模型。
- 時間特性各異：互動式 chat/語音要快；放著跑的 agentic workflow cadence 不同；agent 卡住求助又沒人理會造成 turn 間 gap。
- 定義 workload 的量：每 turn 新 token 數、生成 token 數、session 長度（黏著使用者 vs 問一次就走）、turn 間隔（講者自己與 ChatGPT 的健身計畫 chat 約兩週互動一次）。
- SLA/目標：TTFT（如首 token < 1 秒）、整段回應在特定時間內完成讓使用者讀得夠快。

### 4. Prefill vs Decode：兩種截然不同的運算

- **Prefill**：一次處理大量沒看過的 token（例如 10,000 token in、1 token out），非常 compute-bound，很像訓練（只是沒有 backward pass），能吃滿 GPU flops。
- **Decode**：一次生成一個 token（有 speculative decoding 時三四個），flops 不多但每生一個 token 都要把整個模型權重載入一次，極度 memory-bandwidth-bound——把大規模平行系統變成「a glorified memory loader」。
- Prefill 單次比單一 decode step 久，但 decode step 數量遠多（prefill 對每個 prompt 一次，decode 對每個 token 一次）。
- 因此常把 prefill 與 decode 拆到不同 workers/機器 specialize。硬體上也分化：Nvidia 收購 Groq（逐字稿「Grock/Gro」，存疑）的 LPU 供 decode、GPU 供 prefill；OpenAI 與 Cerebras 合作（Cerebras 更擅長 decode）；還有 SambaNova（逐字稿「Sabbonova」，存疑）等。

### 5. Continuous batching

同一系統同時處理多個 request：時間往下流，新 request 陸續進來、佔用 compute 與 memory（KV cache）資源；短 request 完成後空位讓新 request 進來；若 GPU memory 不足（KV cache 放不下）就開始 queue。呈現多 request 並存的複雜度。

### 6. KV cache 與 prefix sharing

很多使用者都說「hi ChatGPT / hi Claude」，理論上不必為每個使用者重算 activation；長文件 prefill 一次後，下一輪對話的 addendum 也不必重算整份。機制：用傳統資料結構（如基本的 tree/trie）做 prefix sharing，比對哪些 token 看過、哪些是新的，再 lookup activation。

### 7. 模型切分：Tensor parallelism 與 MoE expert 切分

例如 trillion 參數模型跑在（逐字稿「280 gigabyte GPUs」，數字存疑，疑為 80GB 或 H200 級）GPU 上，單 GPU 放不下整個模型。切法：
- **Tensor parallelism**：把每個 tensor 切成四份分到四個 GPU。
- **MoE**：state-of-the-art 多為 mixture of experts，個別 expert 依 token 選擇性啟動，可把不同 expert 切到不同 GPU。
- 切法決定 bottleneck、需要幾個 GPU、能同時 serve 多少 session。

### 8. KV cache 的記憶體階層 = 經典 OS 分頁問題

要盡量把 KV cache 做大（跨多使用者、多 session 快取）。階層：GPU memory → 滿了放 CPU DRAM → 再滿放 disk/SSD。因此：
- Jensen 近期很在意 CPU 效能——上一代 CPU 太慢會 bottleneck 五億美元的機器（KV cache 讀回速度關鍵）。
- OpenAI 傳聞掃光全世界 SSD/DRAM，部分原因就是要把 KV cache 塞得越多越好。
- 這個 evict/prefetch 之舞「就是 70/80 年代作業系統的 scheduling 問題」：開太多應用程式 → CPU memory 不足 → 換頁到 disk，完全同構。
- 學生問「offloading 是不是特定 workload」：講者說這是經典 scheduling。Nano Banana 在圖上幻覺出 LRU eviction——LRU 其實是不錯的 heuristic（某 OS paper 說 LRU 在 optimal 的 2x 內）。最理想是「預測未來」prefetch（例如使用者打開一個月前的舊對話，是很強的訊號，可預載到 GPU）。實務上就是想盡量把更多流量放到 GPU footprint 上。

### 9. 大規模才會出現的 nasty bugs

serve 每天 trillion 級 token 時，小規模沒事的東西在 0.001% 或更低機率下會爆（多發生於去年底的開源 inference engine）：
- **NaN → 重複 token 迴圈**：kernel 有極罕見觸發條件的錯誤，logit 半途變 NaN，模型開始一直輸出同一 token（"hi hi hi highi..." 或一堆驚嘆號）。
- **Tool call 處理 bug → doom loop**：有人改了 tool call 處理，模型說「做網路搜尋」卻沒被正確 return，於是不斷「做網路搜尋、做網路搜尋…」拖到數萬 token；症狀是 completion length 暴衝。
- **Off-by-one kernel bug → 隨機中文字**：一度同時打趴多家 inference provider、還被誤怪成 quantization 問題。實際是 kernel off-by-one，讀到 GPU 未初始化記憶體、過 attention 後吐出隨機中文字，模型「以為使用者在說中文」便一路歪成中文。講者提醒：有時是模型真的被訓練成會思考中文，有時只是 off-by-one。

### 10. 新硬體與 fault tolerance

Blackwell 世代的 NVL72（逐字稿「NVL sendme 2 grace Blackwell」，存疑）把 72 個 GPU 以高速 interconnect 連起。衍生問題：怎麼把 trillion 參數模型切到 72 GPU？值不值得？fault tolerance——這些機器常故障（例如接頭是塑膠不是金屬，插太用力會壓彎、造成 flaky NVLink）。當模型切到 64 GPU、serve 百萬使用者、trillion token，單一 GPU 掛掉怎麼辦？還有百萬 token context 要不要跨多 GPU 切分。

### 11. Cache-aware prefill/decode disaggregation（Together 的簡單優化）

幾個月前 Together 釋出的工作：routing layer 只加約兩行 code 卻很有效。想法：多數 request 是對話中途的 turn-based 請求；若平均對話 10 turn，代表約 10% 是全新、動輒數千 token、較貴的 fresh request。不要讓「剛貼進一本書」的長 prefill 跟「1+1 為什麼等於 2」的短互動擠在同一批 GPU。做法：新進、cache hit rate 很低的 request 送一組 GPU 一起處理；其餘 warm request 送另一組 prefill node。可得最高約 40% 更快的 serving。講者定位：這領域「非常早期」，十年後回看會覺得理所當然，但現在才剛在 production 看到這些新流量型態。

### 12. 研究專案一：Mega kernels（讓 decode 逼近 speed of light）

Stanford × Together 合作。問題：decode 要「跑整個模型只為生一個 token」，把大規模平行系統變成 memory loader。傳統寫法是「一個 operation 一個 kernel」（norm kernel、map kernel、attention kernel…好寫但引入大量 downtime）。

以一張 cartoon（源自某 attention inference kernel）說明：x 軸時間、y 軸 GPU 上所有 streaming multiprocessor（H100 有 132 個、B200 約 148 個），有 bar 表示在做有用工作、空白是等待。downtime 來源：
- kernel launch / teardown 的大 gap（紅、黃）。
- tail effect：一批輸入中有很短、有很長，就得等最長的做完（同一現象從整體 prompt 一路延伸到 attention 運算）。
- 跨多 kernel 執行時，kernel 之間的 gap 會累加。

**Mega kernel**：不再每個 operation 各寫一個 kernel，而是「用單一 kernel 涵蓋多個 operation」，比 flash attention 的 fusion 更激進、跨更多運算。把 GPU 從「單一裝置跑單一 operation」重新想成「一個大型分散式系統」：我有一堆工作、彼此有依賴（紅色依賴某些綠色 bar），如何排程、分配工作以最大化 GPU 利用率。
- 只對 attention inference kernel 做 → 30–70% 加速。
- 對整個模型做（示範 Llama 1B 一層）→ 各 bar 以奇怪方式 overlap：把下一層的 weight load 疊到 attention、在 attention 結束前先跑部分 reduction。
- 例一：QKV+rope（藍）還在跑時，就先把 KV cache load 進 attention（橘＋圓圈）；QKV 一好就有新 query token，再跑其餘 attention。
- 例二：attention（橘）還沒結束，O projection（紅）就先開始 load weight。
- 用 CUDA 框架、instruction-based abstraction，每個 subkernel 各自一個檔案，配一個大的 virtualized shared memory 系統來 orchestrate。
- 底層 library：**Thunderkittens**（類似 Triton 但更 low-level、對細節控制更細）。
- 成效：near speed-of-light decoding，mega kernel（teal bar）比多個 state-of-the-art engine 快；H100 上達 72% bandwidth utilization（逼近該運算物理極限）。
- takeaway：對 kernel 與硬體有很深的控制，能開啟很不同的 compute paradigm，而這些只有深入玩 inference 才看得到。

### 13. 研究專案二：Parse（loop/recurrent transformer 與 SSM 穩定化）

出自其 UCSD lab，Hayden 主導，Zachary、Taylor 協作。模型名 ASR 轉寫不一（"PERS"/"parse"/"parade"/"parse a"，此處以 **Parse** 記，存疑）。動機：除了 scale 參數與資料，還有沒有別的方式取得同樣品質？Parse 是他們對 **loop transformer** 的版本——把 transformer 的某些 block 放進迴圈重複跑（activation 走到 looped block 就在同一層跑 N 次；紫色 block 為 recurrent block），參數固定但等於多一個「增加 flops」的旋鈕。

優點/動機：
- 參數不變卻能增加 flops → 若「flops 越多品質越高」，這是不加參數就提升品質的路。
- 舊工作（幾年前）顯示同樣參數量下 looped model 有更高 expressivity（有些東西非 looped 表達不出來）。
- 核心問題：best quality/intelligence per parameter（或 per parameter-and-data）。
- 前導證據：Tom Goldstein 的 Maryland group 的 recurrent depth 論文（ARC 任務上似乎優於 transformer）；加上釋出前一週某 OpenAI 的人在 Twitter 宣稱「Claude Mythos（存疑）是 looped/recurrent 模型」，引爆 hype，後來對方發文承認是編的（純屬虛構）。

問題與解法：
- 這類 loop model 很脆——只要動一點訓練設定（如 learning rate 稍改），做個 lr sweep 常十次有九次爆掉（NaN、大 loss spike）。以往 hack：每層放 norm、或只准用 lr = 2e-4。講者主張 loss spike 代表底層有更深的問題。
- 用 SSM（state space model）風格的數學分析穩定化。整個 recurrent block（attention、GLU、大 FFN、softmax、rope、非線性…）很難 analytic 分析；他們改看 **residual** 逐 block 如何變化，實證發現 residual 每次變化其實不大 → 可建模。
- 對 residual 寫下 dynamic system：把所有非線性東西塞進一個盒子 R 擱一邊，剩下 A、B 兩個矩陣（B 是對初始向量的 transformation，A 是每次 loop 對 residual 的 transformation）。這個簡化框架可以統一看待先前所有 loop transformer（有的把 A 當 identity 只做加法，有的用完全可學矩陣）。
- 丟掉那個複雜非線性項後，得到可用「高中微積分」解出的簡單系統，有 closed-form 解，第 t+1 步 activation 主要被 A^t 主宰。關鍵量是 A 的 **spectral radius**（≈ norm）：若 A 學成類似 2、t≈16，activation 會被放大到 2^16，解釋了大 loss spike。先前論文的 A、B 選擇多屬 marginally stable 或 unstable。
- **Parse-A**：約束 A 與 B 使數學上不爆。A 設為 negative diagonal matrix（powering up 後項趨近 0，不爆）；B 因只 apply 一次不太會爆，加一個簡單 linear norm。使 spectral radius < 1 → stable 系統。訓練後即使用對其他模型很糟的 6e-4 learning rate（逐字稿另處提 2e-4）也得到穩定 loss，並自然約束 activation 的 state norm。
  - 對照：橘色 baseline 完全不約束 → 爆到 10^19；藍色線是「有 apply norm」的模型——模型想把 activation 撐大（更多空間可表示更多概念），norm 又把它壓回 1，兩股力對抗仍會 manifest 成 loss spike（即使 norm 看起來很好，activation 沒爆，loss 仍會很難看）。

成效與 scaling laws：
- Parse 不只更穩，品質也更高：對比先前 loop transformer（recurrent depth model）及強 transformer baseline（nano chat 那種被大家調到學最快的）——同一基本 transformer 架構開始 loop 並穩定後，得到更好 perplexity 與 end-to-end 品質。
- Scaling laws：iso-param、iso-flop 曲線；左右參數相同，換顏色代表用更多資料（更多 flops）訓練；同時 vary 資料與 recurrence 數。結果同樣呈「down and to the right」→ 固定參數下，資料增加時也該增加 recurrence。recurrence 遵循經典 power law，可聯合預測 quality（recurrence × token）。
- 一張難看的 3D 圖（params、data、recurrence）指向「三者一起 scale」。有趣的是：目前所有模型 recurrence = 0（都在曲線最左端）卻資料很多，暗示大 pre-training run 或許都該加一點 loop。另一實驗：橘＝固定 depth（傳統 transformer）、藍＝固定 flop budget 的 looping model；同 flop 同 size 但藍色（靠增加 recurrence 而非只增資料）得到更小 validation loss。

### 14. Q&A 重點

- **Parse 是否 from scratch / 可用預訓練模型嗎**：主要 from scratch；但有個「troll 部落格」——某人沒訓練任何東西、只把 Qwen 模型的兩三層 loop 起來，就在部分數學題上得到更高品質。他們有相關 looking work 可能快發表；為何 loop 一下就變好講者自陳「困惑、不知道原因」，希望 Hayden 去盯 activation/weight 找答案。
- **Loop model 的 inference/memory 好處**：參數少 → 可放更多 KV cache、少 communication（切更少 GPU）。夢想是 recurrent block 小到能寫進一個小 mega kernel 迴圈；目前 block 還做不夠小；下一代 LPU/Groq 晶片記憶體很小（約 250MB），若能設計到塞得進，就能把權重一直留在記憶體、activation 快速穿過，得到 nonlinear 好處。
- **Mega kernel 的 trade-off**：「工程師的血汗與淚水」——極度 labor-intensive。一個有才的 kernel 工程師一年大概只能為「一種硬體、兩三個模型、batch size 1–16」寫出 mega kernel；batch 17 就得重來。Together 正做 compiler 想自動化。能寫出來就超快、無法更快，但耗費大量心力。
- **與新硬體的 co-design**：先受 memory 限制——看目標晶片（如 Cerebras wafer）有多少 memory，把模型 size 到塞得下且留足 KV cache。中國模型的一些選擇像是在為 Huawei 晶片設想。量化：要 serve 在 Nvidia 就用 NV FP4（Nvidia 專屬格式，Nemotron 模型即用；逐字稿「Neotron」）；AMD 則用 MX FP4，各有優劣。
- **Parse：compute-optimal 下會選 loop 還是加參數**：compute-optimal 本身有點 contrived（固定 flop budget 找落點）；想要更高品質就加 flop budget、固定 size 就訓更久或 loop 更久、沒資料了就挑一個能被最充分訓練的 size。實務還要考慮好不好被採用、怎麼 serve、open source 能不能在筆電上跑。「把模型做更大、資料更多，永遠會更好」，但取捨看設計點。
- **不同 use case 的最佳架構差異**：agentic looped workflow 最在意「KV cache 保持 hot」；一次性 batch processing（每份文件只看一次）KV cache 相對不重要。可看 DeepSeek MLA attention（對 KV cache 的激進壓縮）、FP8/FP4 KV cache。最大差異是 causal vs non-causal attention：batch processing（如 Google 長期用、可能仍用 BERT 做搜尋）用 bidirectional，一次得到向量塞進 database；chat workflow 一定有 decode 段。T5 是中間路線（先 bidirectional 再 generation）。
- **Mega kernel 跨多 GPU communication**：早期 preliminary work 顯示可把 NCCL（逐字稿「nickel」）call 也 fuse 進 mega kernel；尚未找到殺手級用例（有時被 NCCL call 本身 latency 綁住）。DeepSeek（逐字稿「Deepseek 4 / Deepseek foes」）曾為 MoE inference layer 釋出 mega kernel 並 fuse 部分 communication。趨勢：對「部分運算」有小 mega kernel，而非整個模型都做（除非付出血汗代價）。

## 重要細節

### 定義

- Prefill：一次處理整段 prompt（多 token in、一 token out），compute-bound，近似訓練 forward。
- Decode：逐 token 生成，memory-bandwidth-bound，每步需載入整個模型。
- Continuous batching：多 request 動態進出、同時共用 compute/memory 的批次方式。
- KV cache / prefix sharing：快取已算 activation，以 tree/trie 比對前綴重用。
- Disaggregation：把 prefill 與 decode（甚至不同硬體）分開部署。
- Tensor parallelism：把每個 tensor 切到多 GPU；MoE 則切 expert。
- Mega kernel：以單一 kernel 涵蓋多個 operation，跨運算 fuse、把 GPU 當分散式系統排程，消除 kernel 間 downtime。
- Loop / recurrent transformer：重複跑同一組 block，固定參數換取更多 flops。
- Spectral radius：矩陣的一種 norm；A^t 主宰 activation 成長，spectral radius < 1 才穩定。

### 公式／量化描述（皆講者口頭數字）

- H100 streaming multiprocessor 約 132 個、B200 約 148 個。
- Mega kernel 只對 attention → 30–70% 加速；whole-model mega kernel 於 H100 達 72% bandwidth utilization。
- Cache-aware disaggregation 最高約 40% 更快 serving，routing layer 約兩行 code。
- 大規模 bug 觸發率約 0.001% 或更低。
- NVL72：72 GPU 高速互連（逐字稿轉寫存疑）。
- LPU/Groq 晶片記憶體約 250MB（存疑）。
- Kernel 工程師產能：一年約「一硬體 × 2–3 模型 × batch 1–16」的 mega kernel。
- Loop 穩定性：一次 lr sweep 約九成配置會 blow up；不穩時 activation 可爆到 10^19；Parse-A 用 6e-4（另處 2e-4）lr 仍穩定。
- 量化格式：NV FP4（Nvidia 專屬，Nemotron）、MX FP4（AMD）。

### 演算法／流程

- Token 一生：request → 排程（可 disaggregated）→ KV cache 查詢/prefix sharing → prefill → decode（逐 token，含 sampling、stop token、safety check）→ 輸出字串；engine 迴圈等待。
- KV cache 階層：GPU → CPU DRAM → SSD/disk；用 LRU eviction，理想是預測未來做 prefetch（如打開舊對話 → 預載）。
- Mega kernel：把 model 所有 op 的依賴圖攤開，跨 op 排程與 overlap（下一層 weight load 疊 attention、KV cache load 疊 QKV+rope、O projection weight load 疊 attention）。
- Parse 穩定化：對 residual 寫 dynamic system → 非線性塞進 R、留 A（每 loop 的 transform）與 B（初始 transform）→ 丟掉非線性得 closed-form（A^t 主宰）→ 約束 A 為 negative diagonal、B 加 linear norm → spectral radius < 1。
- Parse scaling：iso-param/iso-flop 曲線 down-and-to-right → 固定參數、增資料時應同步增 recurrence；三維（params/data/recurrence）皆應一起 scale。

### 工程限制

- Decode 是 memory-bandwidth-bound：每生一 token 都要載整模型。
- 大規模系統中「小規模能跑」的東西必然在極低機率下爆（NaN/off-by-one/tool-call）。
- KV cache 大小受 GPU/CPU/SSD 記憶體階層與其讀回速度限制；CPU/SSD 速度會 bottleneck 昂貴 GPU。
- Mega kernel 極度 labor-intensive、對 batch size 與硬體/模型高度特化，換 batch/硬體就得重寫。
- Loop transformer 天生訓練不穩，需數學約束（Parse-A）才能穩定 scale。
- 量化格式綁定硬體（NV FP4 vs MX FP4）。

### 講者例子

- 曼哈頓馬糞危機（1898 會議、1902 十三萬匹馬、1912 汽車超越馬）類比 AI 轉折。
- GPT-2「太危險不敢釋出」；本課學生可訓 GPT-2 品質模型。
- 講者自己與 ChatGPT 的健身計畫 chat，約兩週互動一次（session/turn 間隔範例）。
- NaN → "hi hi hi highi..."／驚嘆號迴圈；tool-call doom loop；off-by-one → 隨機中文字被誤怪成 quantization。
- Nano Banana Pro 生成投影片，近看有錯字（5 變 S 等）。
- 某人只 loop Qwen 兩三層、沒訓練就在數學題上變好的「troll 部落格」。
- 某 OpenAI 的人謊稱「Claude Mythos 是 looped 模型」引爆 Twitter，後承認虛構。

### 問答重點

見「Q&A 重點」節（from-scratch/預訓練 loop、loop 的 inference 記憶體好處、mega kernel 代價、與新硬體 co-design、compute-optimal 下 loop vs 加參數、use case 對架構的影響、mega kernel 跨 GPU communication）。

### 容易忽略的提醒

- Prefill 像訓練、decode 完全不同，兩者該被 specialize（甚至用不同晶片）。
- KV cache 管理本質是老派 OS 分頁/scheduling 問題。
- Loss spike 不是要靠 hack 壓住，而是底層數學不穩的訊號。
- 論文報的「token 數」「品質」需小心：本講重點在方法與趨勢，非精確 benchmark。

## 從零實作語言模型的意義

1. 本課主要教 training（含 flash attention），但「模型訓練完之後」的 inference 是另一整個複雜世界；理解它才能做 full-stack 創新。
2. 需要理解的取捨：prefill/decode 的 compute vs memory-bandwidth 本質、KV cache 記憶體階層、tensor/MoE 切分、continuous batching、mega kernel 的 fusion 與排程。
3. 影響後續：與 systems/kernel（flash attention）、scaling laws（此處延伸到 recurrence 維度）、architecture（loop/SSM）、量化與硬體 co-design 皆相關。
4. Parse 給出「參數效率」的新視角：固定參數用 recurrence 換 flops，並示範用 SSM 理論診斷/修復訓練不穩。

## 書稿章節草稿

（實際書稿見 `docs/cs336-language-modeling/18-guest-lecture-dan-fu.md`，此處不重複展開，避免雙份維護。書稿分節：導讀、核心內容（數子節）、工程取捨、常見誤解、小結。）

## 跨章連結

- 前置章節：Lecture 17（前一講）——需主控確認 17 的主題以精準銜接；本講開頭把「訓練」與「serve/inference」對立，並多次以「你們在課堂上做的 training（含 flash attention）」為對照，17→18 大致是「訓練面 → 推論面」的過渡。**與 17 的確切連結待主控核對 17 內容。**
- 後續章節：本講為客座講座，未明確預告下一講。
- Scaling laws（前面章節，約 Lecture 9/11）：Parse 把 data/params 的 scaling law 延伸到第三軸 recurrence，並用 iso-flop/iso-param 曲線與 power law 論證。
- Systems / flash attention 章節：mega kernel 是 flash attention fusion 概念的更激進版；Thunderkittens 為其 kernel library。
- Architecture / SSM 章節：Parse 用 state space model 理論穩定 loop transformer。
- 需回頭補充的術語：streaming multiprocessor、spectral radius、MoE expert parallelism、MLA、NV FP4/MX FP4、NCCL。
- 需要新增的圖表：token 一生流程圖、prefill/decode 對比、KV cache 記憶體階層、mega kernel overlap 示意（可用 Mermaid 抽象）、Parse loop 結構與 A/B 分解。

## 相關作業與材料

此段只建立關聯，不提供作業解答。

- Course material：本講為客座講座，講者自述投影片全由 Nano Banana Pro 生成；是否有對應 code/slide/trace 於 plan 材料清單，**待主控確認**。
- Assignment 關聯：未在逐字稿中點名特定 assignment。
- 本地材料路徑：僅確認逐字稿 `data/cs336/transcripts/18_...Dan_Fu.txt`。
- 材料狀態：待主控確認是否有其他材料（客座講座常無 code）。
- 缺少的材料或 URL：Parse 論文、Thunderkittens、cache-aware disaggregation、recurrent depth（Tom Goldstein group）等原始連結皆未提供，待第 6 階段外補。

## 資訊不足與待補清單

| 缺口 | 需要的材料或來源 | 暫定處理 |
|---|---|---|
| 講者身分（tracker：June 1 Daniel Selsam vs 標題 Dan Fu） | 課程官方排程 | 逐字稿內容全程指向 Dan Fu，不自行修正；標為需主控最終複查 |
| 模型名「Parse/PERS/parade」正確拼寫 | Parse 原始論文 | 逐字稿轉寫不一，暫記 Parse，標存疑，待外補 |
| 「Claude Mythos」是否為正確名稱 | 原始 Twitter/blog | 保留逐字稿轉寫，標存疑 |
| Groq（逐字稿 Grock/Gro）、SambaNova（Sabbonova）、NVL72（NVL sendme 2）、Nemotron（Neotron）、NCCL（nickel） | 官方資料 | 保留原文並在括號註存疑，不外查 |
| 「280 gigabyte GPUs」數字 | — | 疑為口誤（80GB 或 H200 級），標存疑 |
| Tom Goldstein group recurrent depth 論文、DeepSeek MLA/mega kernel、Austin 的 Together 簡報 | 原始論文/簡報 | 依講者口述整理，待外補 |
| Lecture 17 內容以精準銜接 | Lecture 17 筆記/書稿 | 待主控核對 |
| 是否有對應 slide/code/trace 材料 | plan 材料清單 | 待主控確認 |

## 外部補充

外部搜尋只在逐字稿完整閱讀與本章初稿完成後進行。

| 來源 | URL | 補充重點 | 是否納入書稿 |
|---|---|---|---|
| 待填 | 待填 | 待填 | 待填 |

## 修訂紀錄

| 日期 | 動作 | 備註 |
|---|---|---|
| 2026-07-03 | 建立 | 完整閱讀 Lecture 18 逐字稿（第 1–1914 行，wc 1913 行），產出閱讀筆記與書稿 |

## Worker 回報欄

- 完整閱讀的逐字稿檔名：`18_Stanford_CS336_Language_Modeling_from_Scratch_Spring_2026_Guest_Lecture_Dan_Fu.txt`
- 逐字稿總行數：1913（讀到最後一句 "Thanks so much for having me."）
- 新增或修改檔案：`docs/cs336-language-modeling/notes/lecture-18-guest-lecture-dan-fu.md`、`docs/cs336-language-modeling/18-guest-lecture-dan-fu.md`
- 本講核心概念：見上方「核心概念」14 節
- 需要主控 agent 複查的點：講者身分排程疑點；Parse/Claude Mythos/Groq 等 ASR 存疑名稱；與 Lecture 17 的銜接
- 缺少的材料或需要使用者提供的 URL：見「資訊不足與待補清單」
- 是否使用外部資料：否。

# 立場

**CUDA 是沼澤，不是護城河。**（借自 Jim Keller，見 `voices.md`。）留住使用者的不是 NVIDIA 設計得多好，而是十幾年積下來、誰都搬不走的程式碼、函式庫和技能。沼澤不會被另一片沼澤取代（Itanium、OpenCL、ROCm 都想另挖一條乾淨的河），只能從上面架橋跨過；而公共的橋（Triton）走不過去，跨過去的人走的都是硬體廠自己蓋的橋（Google TPU 與自家軟體、Anthropic 走 Google 與 Amazon 的堆疊、AMD 用認股權證付錢請 OpenAI 過橋）。架橋的造價固定，所以只有大戶的離開威脅可信；毛利率是懸賞金額（借自 George Hotz），而懸賞實際發給了這些大戶：NVIDIA 與 AMD 在 2025 年秋天都按部署量付錢給 OpenAI，NVIDIA 也投資 Anthropic。

沼澤和護城河預測的不同：護城河的威脅來自規格更好的對手，沼澤的威脅來自付得起離開的買方。所以 MI300X 規格領先沒用，競爭變成兩邊付錢給同一批大戶。真有護城河的人，不必付錢讓客戶留下。

修正（2026-10-23）：原立場把 Triton 當成那座橋。讀了 Lattner（Triton 在 H100 上常損失 20%、AMD 上更糟、路線圖在 OpenAI）與 SemiAnalysis（AMD 還沒跨過、NVIDIA 在挖深）後，保留「沼澤」，修正「橋」：公共的橋不夠，橋要由硬體廠自己蓋或付錢。這也直接回應 SemiAnalysis 的「護城河」說法：NVIDIA 加深的是泥，不是牆。

再修正（2026-10-25，獨立審查後）：審查指出「大戶跨出沼澤」漏掉了 OpenAI 與 NVIDIA 的 10 GW 意向書、Anthropic 與 Microsoft、NVIDIA 的合作，這兩筆是多源採購，不是過橋；也指出 NVIDIA 自己寫核心函式庫、又在挖深，沼澤與護城河的差別會消失。修正為「大戶站在岸邊兩邊收錢」，並寫明兩個詞預測的不同。

最強的反方：黃仁勳說新演算法需要通用可程式的架構。若每一種新模型架構都先長在 CUDA 上，沼澤就一直在漲水，橋永遠差一年。這是全書要盯的戰場。

撐住立場的事實：CUDA、AlexNet、cuDNN 三方投入；NVIDIA 對 OpenAI 最多 1,000 億美元、對 Anthropic 最多 100 億美元的投資，AMD 對 OpenAI 最多 1.6 億股認股權證；Itanium 與 OpenCL 推不動；OpenAI 與 AMD、Anthropic 與 Google 的合約；Gemini 只用 TPU 訓練；中國營收占比從約 20% 降到約 9%。

要正面處理的反例：AMD MI300X 規格領先仍未讓多數買方離開（硬體贏不了沼澤，支持立場）；DeepSeek 受限後往下寫 NVIDIA 專屬的 PTX（被困的人陷得更深）；黃仁勳說 Anthropic 是特例，不是趨勢。

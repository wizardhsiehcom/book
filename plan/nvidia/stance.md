# 立場

**CUDA 是沼澤，不是護城河。**（借自 Jim Keller，見 `voices.md`。）留住使用者的不是 NVIDIA 設計得多好，而是十幾年積下來、誰都搬不走的程式碼、函式庫和技能。沼澤不會被另一片沼澤取代（Itanium、OpenCL、ROCm 都想另挖一條乾淨的河），只會被從上面架橋跨過（Triton、PyTorch 編譯器、自研晶片的軟體堆疊）。架橋的造價固定，所以大戶先跨；毛利率是懸賞金額（借自 George Hotz），毛利越高，來架橋的人越多。

最強的反方：黃仁勳說新演算法需要通用可程式的架構。若每一種新模型架構都先長在 CUDA 上，沼澤就一直在漲水，橋永遠差一年。這是全書要盯的戰場。

撐住立場的事實：CUDA、AlexNet、cuDNN 三方投入；Itanium 與 OpenCL 推不動；OpenAI 與 AMD、Anthropic 與 Google 的合約；Gemini 只用 TPU 訓練；中國營收占比從約 20% 降到約 9%。

要正面處理的反例：AMD MI300X 規格領先仍未讓多數買方離開（硬體贏不了沼澤，支持立場）；DeepSeek 受限後往下寫 NVIDIA 專屬的 PTX（被困的人陷得更深）；黃仁勳說 Anthropic 是特例，不是趨勢。

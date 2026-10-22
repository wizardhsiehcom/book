# 市場競爭與護城河

談 NVIDIA 的競爭，最常見的問題是：護城河有多深？

這個問題預設護城河對每個人都一樣深。但同一條河，對一家只有十位工程師的公司和對 OpenAI，是完全不同的寬度。**比較要緊的問題是：誰付得起過河的代價？**

---

## 鎖住買方的是什麼

[CUDA 生態](cuda-ecosystem.md)的切換成本，來自累積在平台上的東西：程式碼、函式庫、工程師的技能、以它為預設後端的框架。換掉 GPU 不難，難的是重寫或重新驗證這些東西。

兩個主題以外的案例可以說明，鎖住買方的是這些互補資產，而不是公司本身：

| 案例 | 發生了什麼 |
|------|-----------|
| Intel 的 Itanium | x86 的擁有者 Intel 自己推出不相容 x86 的 64 位元架構，市場卻選了 AMD 相容 x86 的擴充（2003 年起）。Intel 隨後採用同一套擴充，Itanium 最後一批在 2021 年年中出貨 |
| OpenCL | Apple 發起的開放標準，2018 年連 Apple 自己都在 macOS 棄用。一項研究發現，在 NVIDIA 硬體上，同一份程式用 CUDA 或 OpenCL 寫，單一運算的耗時幾乎相同；販售 CUDA 替代方案的 Modular 分析，落後的地方在於各廠實作不一致，以及缺少高階 AI 函式庫 |

2024 年 2 月，曾主導 AMD Zen 與 Apple A4 設計、時任 Tenstorrent 執行長的 Jim Keller 在 X 上寫：「CUDA 是沼澤，不是護城河。x86 也是沼澤。」Tenstorrent 賣的正是 NVIDIA 的替代品。

<!-- mech: ecosystem_lockin -->
!!! note "詮釋"
    Keller 的比喻比「護城河」準。護城河是主人挖來防禦的，沼澤是多年積下來的泥：x86 和 CUDA 留住使用者，靠的不是設計多好，而是大家已經陷在裡面。Itanium 和 OpenCL 都想在旁邊另挖一條更乾淨的河，結果沒人過去。**沼澤不會被另一片沼澤取代，只會被從上面架橋跨過。**

---

## 規格領先為什麼不夠

AMD 的 MI300X 在廠商規格上不輸 H100：

| 比較面向 | NVIDIA H100 SXM | AMD MI300X |
|----------|-----------------|------------|
| HBM 容量 | 80 GB | 192 GB |
| 峰值算力（FP16，稠密） | 989 TFLOPS | 1,307 TFLOPS |
| 軟體生態 | CUDA | ROCm（追趕中） |

規格領先，並沒有讓多數買方換掉 NVIDIA。

---

## 鎖定從最大的買方開始鬆動

| 時間 | 事件 |
|------|------|
| 2025 年 10 月 | OpenAI 與 AMD 簽下 6 GW、多年期多世代合約，首批 1 GW MI450 於 2026 年下半年部署；AMD 發給 OpenAI 最多 1.6 億股認股權證，依部署量等里程碑分批生效 |
| 2025 年 10 月 | Anthropic 宣布取得最多一百萬顆 Google TPU、超過 1 GW 的運算量，2026 年上線；Anthropic 同時使用 TPU、Amazon Trainium 與 NVIDIA GPU，並以 Amazon 為主要訓練夥伴 |

2023 年，George Hotz 創辦 tiny corp，要讓 AMD GPU 成為 NVIDIA 的對手。他寫道：「只要有 3% 的機會推翻 NVIDIA、吃進它 80% 的毛利，我們就會非常非常有錢。」

<!-- mech: ecosystem_lockin, test: lockin_by_buyer_scale -->
!!! note "詮釋"
    架橋是大戶的特權。橋的造價固定，用量越大，攤到每張卡上越便宜；OpenAI 和 Anthropic 先跨出去，正因為它們陷得最深、付得最多。Hotz 把毛利率讀成懸賞金額，這比任何護城河分析都直接：毛利越高，來架橋的人越多。黃仁勳說 Anthropic 是「特例，不是趨勢」；但懸賞掛在那裡，特例不會只有一個。

<!-- mech: ecosystem_lockin -->
!!! example "示意場景"
    兩家公司拿到同一份報價：新硬體便宜兩成，記憶體多一倍；代價是整套訓練流程要重新驗證、自訂核心要重寫，得專門養一支團隊來做。一家只租幾百張卡的新創算下來，省下的錢養不起這支團隊，於是留下。一家要部署數十萬張卡的模型公司，同一支團隊的成本攤下來微不足道，於是導入。兩家都沒有算錯。

**判斷鎖定有沒有鬆動，先問：這個買方的規模，攤提得了移植成本嗎？**

---

## 客戶也是對手

NVIDIA 不是中立的供應者，它和自己的客戶有兩次正面衝突：

- **Arm（2020–2022）：**NVIDIA 宣布以 400 億美元收購 Arm。美國聯邦貿易委員會（FTC）起訴阻擋，稱 Arm 是「半導體業的瑞士」，擔心 NVIDIA 會看到競爭者的授權資訊、左右 Arm 的研發方向；Qualcomm、Microsoft、Google 都向監管機構表達反對。黃仁勳承諾維持 Arm 的開放授權模式，交易仍在 2022 年 2 月放棄。
- **DGX Cloud（2023–2025）：**NVIDIA 向 AWS 等雲端租回自家 GPU，再轉售給企業客戶，等於和最大的客戶搶生意。據 The Information 報導，2025 年 9 月 NVIDIA 縮減對外推廣，改以內部研究使用為主，原因是需求偏低、價格高於一般雲端；NVIDIA 公開否認策略轉向。

<!-- mech: neutral_supplier, test: customer_stays_vs_leaves -->
!!! note "詮釋"
    供應者下場做生意，客戶就會想自立門戶。Arm 的授權客戶有監管機構可以求助，交易被擋下；雲端業者面對 DGX Cloud 沒有退路，只能繼續買。這和台積電一書裡 Apple 在 2011–2013 年和三星互告、卻照樣交給三星代工是同一個結構：不滿要等到有了退路，才會變成轉移。

Google 是 NVIDIA 的客戶，也自研 TPU。據 SemiAnalysis，Gemini 各代模型都只用 TPU 訓練；Google 也把 TPU 租給外部客戶，包括上一節的 Anthropic。

<!-- mech: neutral_supplier (weak) -->
!!! note "詮釋"
    Google 是第一個在沼澤上填出自己乾地的大戶。TPU 的起點也許只是成本，但它填出來的地，現在租給了 Anthropic 這些其他大戶。客戶自己造的退路，最後會對外營業。

---

## 沼澤還在漲水嗎

<!-- mech: abstraction_shift (weak), test: open_standard_vs_upper_layer -->
**介面上移會不會鬆動 CUDA？**OpenAI 在 2021 年開源 Triton，用 Python 寫 GPU 核心；2023 年 PyTorch 2.0 的編譯器以 Triton 產生核心，AMD 文件說明 Triton 可在 ROCm 上執行。和 OpenCL 不同，它們長在開發者已經在用的那一層，不必改寫。但反方向的證據也在：AMD 正式產線仍另加硬體專屬的手調核心；DeepSeek 受限於 H800，反而往下走到 NVIDIA 專屬的 PTX 指令集。

做這類上層的人自己也不樂觀。2025 年 3 月，Chris Lattner 在 Modular 的部落格寫道，Triton 在 H100 上「常見會損失 20%」，「移到 AMD GPU 更糟」，「Triton 並沒有統一生態系，也沒有挑戰 CUDA 的主導地位」，而且「Triton 是開源的，但路線圖握在 OpenAI 手上」。Modular 賣的正是另一套跨硬體的軟體堆疊。2024 年 12 月，SemiAnalysis 實測 MI300X 後寫道，「AMD 還沒有跨過 CUDA 護城河」，NVIDIA 的工程師正在加班用新功能、函式庫和效能更新把它挖深。

<!-- mech: abstraction_shift (weak) -->
!!! note "詮釋"
    公共的橋走不過這片沼澤。Triton 在 NVIDIA 自家的卡上就短少兩成，搬到 AMD 更糟，路線圖還握在一家模型公司手裡。真正跨過去的人，走的都是硬體廠自己蓋的橋：Google 用自己的 TPU 和軟體訓練 Gemini，Anthropic 走 Google 和 Amazon 的橋，AMD 乾脆發認股權證，付錢請 OpenAI 過橋。SemiAnalysis 說 NVIDIA 在挖深護城河；挖深的其實是沼澤，泥越深，橋越只能由帶著自家硬體的人來蓋。

**黃仁勳的回答。**在 2026 年的 Dwarkesh Patel 訪談裡，黃仁勳說，要發明新的注意力機制、混合 SSM，或融合擴散與自迴歸的模型，「你需要一個通用可程式的架構」。

<!-- mech: ecosystem_lockin (boundary) -->
!!! note "詮釋"
    這是對 Keller 最強的回答，也是這場爭論真正的戰場。橋要架在穩定的地基上，而 NVIDIA 的策略是讓地基每年都變：每一種新模型架構若仍先在 CUDA 上跑起來，沼澤就一直在漲水，橋永遠差一年。所以要盯的不是 AMD 的規格表，而是下一種新架構的第一個開源實作，寫在 CUDA，還是寫在某家硬體廠自己的堆疊上。

針對推理的新創（Groq、Cerebras、SambaNova）不在本章範圍。

---

## 資料來源

- AMD × OpenAI：[AMD 新聞稿](https://ir.amd.com/news-events/press-releases/detail/1260/amd-and-openai-announce-strategic-partnership-to-deploy-6-gigawatts-of-amd-gpus)
- Google × Anthropic：[DatacenterDynamics](https://www.datacenterdynamics.com/en/news/google-and-anthropic-confirm-massive-1gw-cloud-deal-with-up-to-one-million-google-tpus/)
- NVIDIA × Arm：[TechCrunch（FTC 起訴）](https://techcrunch.com/2021/12/02/ftc-sues-to-block-nvidias-purchase-of-arm/)、[Redmond（交易終止）](https://redmondmag.com/Articles/2022/02/08/Nvidia-40B-Proposed-Acquisition-of-Arm-Shuts-Down.aspx)
- DGX Cloud：[TipRanks 轉述 The Information](https://www.tipranks.com/news/the-fly/nvidia-to-scale-back-dgx-cloud-business-the-information-reports-thefly)
- x86-64 與 Itanium：[Wikipedia](https://en.wikipedia.org/wiki/X86-64)
- OpenCL：[MacRumors（Apple 棄用）](https://www.macrumors.com/2018/06/05/apple-deprecates-opengl-opencl-gaming/amp/)、[Modular 分析](https://www.modular.com/blog/democratizing-ai-compute-part-5-what-about-cuda-c-alternatives)、[arXiv 1611.06945](https://arxiv.org/pdf/1611.06945)
- Triton 的限制：[Chris Lattner，Modular，2025 年 3 月 26 日](https://www.modular.com/blog/democratizing-ai-compute-part-7-what-about-triton-and-python-edsls)
- MI300X 實測：[SemiAnalysis，2024 年 12 月 22 日](https://newsletter.semianalysis.com/p/mi300x-vs-h100-vs-h200-benchmark-part-1-training)
- Triton on ROCm：[AMD 文件](https://rocm.docs.amd.com/projects/radeon/en/latest/docs/install/native_linux/install-triton.html)
- Gemini 以 TPU 訓練：[SemiAnalysis](https://newsletter.semianalysis.com/p/tpuv7-google-takes-a-swing-at-the)
- Jim Keller：[Wccftech](https://wccftech.com/jim-keller-calls-nvidia-cuda-a-swamp-says-x86-was-a-swamp-too/amp/)
- George Hotz：[Import AI 331](https://importai.substack.com/p/import-ai-331-16x-smaller-language)
- 黃仁勳訪談：[The Transcript Desk 逐字稿](https://thetranscriptdesk.substack.com/p/jensen-huang-will-nvidias-moat-persist)
- DeepSeek PTX：[Tom's Hardware](https://tomshardware.com/tech-industry/artificial-intelligence/deepseeks-ai-breakthrough-bypasses-industry-standard-cuda-uses-assembly-like-ptx-programming-instead)
- 中國反壟斷初步認定：[JURIST](https://www.jurist.org/news/2025/09/china-finds-nvidia-violated-antimonopoly-law-in-preliminary-probe/)

本章的案例與機制底稿見 `plan/nvidia/cases.yml`、`plan/nvidia/mechanisms.yml` 與 `plan/nvidia/voices.md`。

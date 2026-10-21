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

<!-- mech: ecosystem_lockin -->
!!! note "詮釋"
    收稅靠的不是稅吏，是納稅人自己搬不走的家當。連 x86 的擁有者 Intel 都推不動不相容的 Itanium，開放標準 OpenCL 在核心效能相當時也輸了。**鎖住買方的不是 NVIDIA，是買方自己累積在 CUDA 上的東西。**所以 NVIDIA 最該怕的不是更快的 GPU，而是讓家當不必重搬的那一層。

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

<!-- mech: ecosystem_lockin, test: lockin_by_buyer_scale -->
!!! note "詮釋"
    逃稅是大戶的特權。移植成本是固定的，用量越大，攤到每張卡上越便宜。OpenAI 和 Anthropic 先跨出去，不是因為它們比較不依賴 CUDA，而是因為它們繳的稅最多。護城河不是均勻變淺，而是從最大的納稅人那一端開始被跨過。

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
    收稅者下場做生意，納稅人就會想自立門戶。Arm 的授權客戶有監管機構可以求助，交易被擋下；雲端業者面對 DGX Cloud 沒有退路，只能繼續繳。這和台積電一書裡 Apple 在 2011–2013 年和三星互告、卻照樣交給三星代工是同一個結構：不滿要等到有了退路，才會變成轉移。

Google 是 NVIDIA 的客戶，也自研 TPU。據 SemiAnalysis，Gemini 各代模型都只用 TPU 訓練；Google 也把 TPU 租給外部客戶，包括上一節的 Anthropic。

<!-- mech: neutral_supplier (weak) -->
!!! note "詮釋"
    Google 是第一個建出自己稅區的大戶。TPU 的起點也許只是成本，但它造出來的退路，現在租給了 Anthropic 這些其他大戶。客戶自己蓋的避稅天堂，最後會對外營業。

---

## 稅基的兩道裂縫

<!-- mech: abstraction_shift (weak), test: open_standard_vs_upper_layer -->
**介面上移會不會鬆動 CUDA？**OpenAI 在 2021 年開源 Triton，用 Python 寫 GPU 核心；2023 年 PyTorch 2.0 的編譯器以 Triton 產生核心，AMD 文件說明 Triton 可在 ROCm 上執行。和 OpenCL 不同，它們長在開發者已經在用的那一層，不必改寫。但反方向的證據也在：AMD 正式產線仍另加硬體專屬的手調核心；DeepSeek 受限於 H800，反而往下走到 NVIDIA 專屬的 PTX 指令集。介面上移是在改寫稅基本身：如果新家當長在 Triton 上，就不必再向 CUDA 繳稅。

<!-- mech: ecosystem_lockin (boundary) -->
**飛輪轉得比誘因快嗎？**常見說法是開發者越多、工具越多、切換成本越高，毛利再投入研發。但毛利越高，大買方自研或導入第二供應商的誘因也越大；OpenAI 與 AMD、Anthropic 與 Google 的合約，都發生在 NVIDIA 毛利最高的時期。毛利率就是稅率，稅率越高，自立稅區越划算；飛輪轉得越快，替自己培養的逃稅者也越多。

針對推理的新創（Groq、Cerebras、SambaNova）不在本章範圍。

---

## 資料來源

- AMD × OpenAI：[AMD 新聞稿](https://ir.amd.com/news-events/press-releases/detail/1260/amd-and-openai-announce-strategic-partnership-to-deploy-6-gigawatts-of-amd-gpus)
- Google × Anthropic：[DatacenterDynamics](https://www.datacenterdynamics.com/en/news/google-and-anthropic-confirm-massive-1gw-cloud-deal-with-up-to-one-million-google-tpus/)
- NVIDIA × Arm：[TechCrunch（FTC 起訴）](https://techcrunch.com/2021/12/02/ftc-sues-to-block-nvidias-purchase-of-arm/)、[Redmond（交易終止）](https://redmondmag.com/Articles/2022/02/08/Nvidia-40B-Proposed-Acquisition-of-Arm-Shuts-Down.aspx)
- DGX Cloud：[TipRanks 轉述 The Information](https://www.tipranks.com/news/the-fly/nvidia-to-scale-back-dgx-cloud-business-the-information-reports-thefly)
- x86-64 與 Itanium：[Wikipedia](https://en.wikipedia.org/wiki/X86-64)
- OpenCL：[MacRumors（Apple 棄用）](https://www.macrumors.com/2018/06/05/apple-deprecates-opengl-opencl-gaming/amp/)、[Modular 分析](https://www.modular.com/blog/democratizing-ai-compute-part-5-what-about-cuda-c-alternatives)、[arXiv 1611.06945](https://arxiv.org/pdf/1611.06945)
- Triton on ROCm：[AMD 文件](https://rocm.docs.amd.com/projects/radeon/en/latest/docs/install/native_linux/install-triton.html)
- Gemini 以 TPU 訓練：[SemiAnalysis](https://newsletter.semianalysis.com/p/tpuv7-google-takes-a-swing-at-the)
- DeepSeek PTX：[Tom's Hardware](https://tomshardware.com/tech-industry/artificial-intelligence/deepseeks-ai-breakthrough-bypasses-industry-standard-cuda-uses-assembly-like-ptx-programming-instead)
- 中國反壟斷初步認定：[JURIST](https://www.jurist.org/news/2025/09/china-finds-nvidia-violated-antimonopoly-law-in-preliminary-probe/)

本章的案例與機制底稿見 `plan/nvidia/cases.yml` 與 `plan/nvidia/mechanisms.yml`。

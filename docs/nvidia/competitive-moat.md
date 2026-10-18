# 市場競爭與護城河

談 NVIDIA 的競爭，最常見的問題是：護城河有多深？

這個問題預設護城河對每個人都一樣深。但同一條河，對一家只有十位工程師的公司和對 OpenAI，是完全不同的寬度。**比較要緊的問題是：誰付得起過河的代價？**

本章的正文是可查證的事實；「詮釋」是根據事實所做的推論；「詮釋的限制」用於證據還不夠的推論；「示意場景」只描寫角色的處境與選項。

---

## 同一條「護城河」，三種讀法

| 位置 | 「護城河」意味著 |
|------|----------------|
| 投資人 | 可持續的超額利潤 |
| 大型買方 | 被單一供應商定價的依賴 |
| 監管機構 | 可能被濫用的市場力量（2025 年 9 月，中國市場監管總局初步認定 NVIDIA 收購 Mellanox 違反反壟斷法） |

---

## 鎖住買方的是什麼

[CUDA 生態](cuda-ecosystem.md)的切換成本，來自累積在平台上的東西：程式碼、函式庫、工程師的技能、以它為預設後端的框架。換掉 GPU 不難，難的是重寫或重新驗證這些東西。

兩個主題以外的案例可以說明，鎖住買方的是這些互補資產，而不是公司本身：

| 案例 | 發生了什麼 |
|------|-----------|
| Intel 的 Itanium | x86 的擁有者 Intel 自己推出不相容 x86 的 64 位元架構，市場卻選了 AMD 相容 x86 的擴充（2003 年起）。Intel 隨後採用同一套擴充，Itanium 最後一批在 2021 年年中出貨 |
| OpenCL | Apple 發起的開放標準，2018 年連 Apple 自己都在 macOS 棄用。一項研究發現，在 NVIDIA 硬體上，同一份程式用 CUDA 或 OpenCL 寫，單一運算的耗時幾乎相同；落後的地方在於各廠實作不一致，以及缺少高階 AI 函式庫 |

<!-- mech: ecosystem_lockin -->
!!! note "詮釋"
    連平台擁有者自己都推不動不相容的新架構，開放標準在核心效能相當時也贏不了。**鎖住買方的不是 NVIDIA，是買方自己累積在 CUDA 上的東西。**OpenCL 的落敗分析來自販售 CUDA 替代方案的 Modular，屬於利害關係人，讀的時候要打折。

---

## 規格領先為什麼不夠

AMD 的 MI300X 在廠商規格上不輸 H100：

| 比較面向 | NVIDIA H100 SXM | AMD MI300X |
|----------|-----------------|------------|
| HBM 容量 | 80 GB | 192 GB |
| 峰值算力（FP16，稠密） | 989 TFLOPS | 1,307 TFLOPS |
| 軟體生態 | CUDA | ROCm（追趕中） |

規格領先，市占卻沒有跟上。常被引用的「NVIDIA 約九成、AMD 約一成以下」市占數字，本書找不到可靠出處，所以不列出。

!!! example "示意場景"
    一家中型公司的平台團隊拿到報價：新硬體便宜兩成，記憶體多一倍。但整套訓練流程要重新驗證，自訂的核心要重寫，出問題時網路上能查到的答案少很多。省下的錢，要攤在幾千張卡上才划得來。

---

## 鎖定從最大的買方開始鬆動

| 時間 | 事件 |
|------|------|
| 2025 年 10 月 | OpenAI 與 AMD 簽下 6 GW、多年期多世代合約，首批 1 GW MI450 於 2026 年下半年部署；AMD 發給 OpenAI 最多 1.6 億股認股權證，依部署量等里程碑分批生效 |
| 2025 年 10 月 | Anthropic 宣布取得最多一百萬顆 Google TPU、超過 1 GW 的運算量，2026 年上線；Anthropic 同時使用 TPU、Amazon Trainium 與 NVIDIA GPU，並以 Amazon 為主要訓練夥伴 |

<!-- mech: ecosystem_lockin, test: lockin_by_buyer_scale -->
!!! note "詮釋"
    同樣面對 AMD 的硬體，一般買方留下，最大型的買方卻導入了。差別在規模：移植成本是固定的，用量越大，攤到每張卡上越便宜。所以護城河不是均勻變淺，而是從最深的那一端開始被跨過。

**判斷鎖定有沒有鬆動，先問：這個買方的規模，攤提得了移植成本嗎？**

---

## 客戶也是對手

NVIDIA 不是中立的供應者，它和自己的客戶有兩次正面衝突：

- **Arm（2020–2022）：**NVIDIA 宣布以 400 億美元收購 Arm。美國聯邦貿易委員會（FTC）起訴阻擋，稱 Arm 是「半導體業的瑞士」，擔心 NVIDIA 會看到競爭者的授權資訊、左右 Arm 的研發方向；Qualcomm、Microsoft、Google 都向監管機構表達反對。黃仁勳承諾維持 Arm 的開放授權模式，交易仍在 2022 年 2 月放棄。
- **DGX Cloud（2023–2025）：**NVIDIA 向 AWS 等雲端租回自家 GPU，再轉售給企業客戶，等於和最大的客戶搶生意。據 The Information 報導，2025 年 9 月 NVIDIA 縮減對外推廣，改以內部研究使用為主，原因是需求偏低、價格高於一般雲端；NVIDIA 公開否認策略轉向。

<!-- mech: neutral_supplier, test: customer_stays_vs_leaves -->
!!! note "詮釋"
    Arm 的授權客戶有反對的管道（監管機構），所以交易被擋下。雲端業者面對 DGX Cloud 卻照樣大量採購，因為短期內沒有退路。這和台積電一書裡 Apple 在 2011–2013 年和三星互告專利、卻仍交給三星代工是同一個結構：不信任要等到替代者可行，才會變成轉移。

!!! note "詮釋的限制"
    Google 自研 TPU、對外出租，看起來像是「有退路的客戶離開了」。但 Google 發展 TPU 的動機是成本還是不信任 NVIDIA，沒有證據，不能寫成因果。

---

## 抽象層上移：方向還不確定

開發者面對的介面正在往上移：OpenAI 在 2021 年開源 Triton，用 Python 寫 GPU 核心；2023 年 PyTorch 2.0 的編譯器以 Triton 產生核心。AMD 的官方文件說明，Triton 可以在 ROCm 上執行。

<!-- mech: abstraction_shift (weak), test: open_standard_vs_upper_layer -->
!!! note "詮釋的限制"
    這很容易被讀成「CUDA 鎖定正在瓦解」，但證據指向兩個方向。一方面，同一份 Triton 原始碼可以在 NVIDIA 和 AMD 上執行；另一方面，AMD 的正式產線仍另外加上硬體專屬的手調核心。更明顯的反例是 DeepSeek：受出口管制只能用 H800，它反而往下走到 NVIDIA 專屬的 PTX 指令集去最佳化。和 OpenCL 比，Triton 與 PyTorch 的不同在於它們長在開發者已經在用的那一層，不必改寫。但這個機制目前只有一個支持案例，本章只記錄「介面正在上移」這個事實。

---

## 飛輪還是誘因

常見的說法是正向循環：更多開發者 → 更多工具 → 更高的切換成本；更高的毛利 → 更多研發 → 更強的硬體。

<!-- mech: ecosystem_lockin (boundary) -->
!!! note "詮釋的限制"
    這個飛輪對一般買方成立，但它還有反向的一面：毛利越高，大買方自研或導入第二供應商的誘因就越大。OpenAI 與 AMD、Anthropic 與 Google 的合約，都發生在 NVIDIA 毛利最高的時期。飛輪和誘因同時在轉，哪一個比較快，目前的資料無法判定。

其他競爭者，如 Groq、Cerebras、SambaNova 等針對推理的新創，本章的資料沒有涵蓋，不做判斷。

---

## 資料來源

- AMD × OpenAI：[AMD 新聞稿](https://ir.amd.com/news-events/press-releases/detail/1260/amd-and-openai-announce-strategic-partnership-to-deploy-6-gigawatts-of-amd-gpus)
- Google × Anthropic：[DatacenterDynamics](https://www.datacenterdynamics.com/en/news/google-and-anthropic-confirm-massive-1gw-cloud-deal-with-up-to-one-million-google-tpus/)
- NVIDIA × Arm：[TechCrunch（FTC 起訴）](https://techcrunch.com/2021/12/02/ftc-sues-to-block-nvidias-purchase-of-arm/)、[Redmond（交易終止）](https://redmondmag.com/Articles/2022/02/08/Nvidia-40B-Proposed-Acquisition-of-Arm-Shuts-Down.aspx)
- DGX Cloud：[TipRanks 轉述 The Information](https://www.tipranks.com/news/the-fly/nvidia-to-scale-back-dgx-cloud-business-the-information-reports-thefly)
- x86-64 與 Itanium：[Wikipedia](https://en.wikipedia.org/wiki/X86-64)
- OpenCL：[MacRumors（Apple 棄用）](https://www.macrumors.com/2018/06/05/apple-deprecates-opengl-opencl-gaming/amp/)、[Modular 分析](https://www.modular.com/blog/democratizing-ai-compute-part-5-what-about-cuda-c-alternatives)、[arXiv 1611.06945](https://arxiv.org/pdf/1611.06945)
- Triton on ROCm：[AMD 文件](https://rocm.docs.amd.com/projects/radeon/en/latest/docs/install/native_linux/install-triton.html)
- DeepSeek PTX：[Tom's Hardware](https://tomshardware.com/tech-industry/artificial-intelligence/deepseeks-ai-breakthrough-bypasses-industry-standard-cuda-uses-assembly-like-ptx-programming-instead)
- 中國反壟斷初步認定：[JURIST](https://www.jurist.org/news/2025/09/china-finds-nvidia-violated-antimonopoly-law-in-preliminary-probe/)

本章的案例與機制底稿見 `plan/nvidia/cases.yml` 與 `plan/nvidia/mechanisms.yml`。

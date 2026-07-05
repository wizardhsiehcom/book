# EE274 Lecture 1 閱讀筆記

- **逐字稿檔名**：`Stanford EE274： Data Compression I 2023 I Lecture 1 - Course Intro, Lossless Data Compression Basics.txt`
- **閱讀範圍**：全篇讀完（Line 1 to EOF）。
- **講者**：Pulkit Tandon (前半), Shubham Chandak (後半)

## 核心概念與重點

1. **資料增長的規模**：
   - 介紹從 Megabyte (MB), Gigabyte (GB), Terabyte (TB), Petabyte (PB) 一路到 Exabyte (EB) 與 Zettabyte (ZB)。
   - 世界上產生的資料以指數成長，如 Netflix 影片佔據網路巨量頻寬、AWS S3 需要管理 PB 級資料。
   - 壓縮不僅是為了解決「靜態儲存（Data at rest）」的問題，更是為了解決「傳輸中的資料（Data in motion）」問題。

2. **壓縮無所不在（Omnipresent）**：
   - Git 的版本控制（git pull 時的 compressing objects）。
   - 機器學習模型的量化（Quantization）。
   - 腦機介面（Brain-machine interfaces）的巨量感測器資料。

3. **壓縮的本質與 Trade-offs**：
   - 「Succinct representation of information」：丟棄多餘的資料，保留真正的「資訊」。
   - 好的壓縮器本質上就是一個好的預測器（Predictor）。
   - 展示了聲音與圖像的失真壓縮實驗（Rate-Distortion curve），不同人對音質或畫質的接受度不同。

4. **課程三大主軸**：
   - **理論（Theory）**：Shannon 資訊理論、Entropy、Rate-Distortion。
   - **演算法（Algorithms）**：Huffman, LZ, 轉換編碼（klt, fft, dct）。
   - **實作與硬體（Implementation）**：Instruction set architectures 的最佳化、影片串流的 frame groups (I, P, B frames) 設計。

5. **無失真壓縮基礎（Shubham 主講）**：
   - Bit（位元）與 Byte（位元組，8 bits）。
   - Fixed bit-width code（固定長度編碼）：例如 ASCII，不管字母出現頻率多寡都用固定 bits。缺點是效率低。
   - Variable length codes（變動長度編碼）：核心精神是**「為高機率出現的符號分配較少的 bits，低機率的符號分配較多的 bits」**。
   - 評估指標：Expected code length（期望編碼長度，平均每個符號花費多少 bit），計算方式為 $\sum P(x) \cdot L(x)$。

## 待補與疑問

- 本講提及許多未來的技術細節（如 Rate Distortion, LZ），目前僅作大綱預覽，將在後續講次深入。
- 無需使用者補充資料，本講基礎已完備。

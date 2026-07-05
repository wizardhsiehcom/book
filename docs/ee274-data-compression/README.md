# 導讀：資料壓縮的理論與應用

歡迎來到史丹佛大學 EE274《Data Compression: Theory and Applications》(2023) 的繁體中文教學書。

在當今資訊爆炸的時代，從手機中的照片、Netflix 的 4K 串流影片，到大型語言模型（LLMs）的權重，我們所產生與處理的資料量已經達到 Zettabyte（$10^{21}$ 位元組）的驚人等級。如果沒有**資料壓縮（Data Compression）**技術，網際網路將會癱瘓，雲端儲存的成本也將高到難以負擔。

這本書將帶您深入淺出地理解資料壓縮的核心。這不僅僅是按下「壓縮成 ZIP」這麼簡單，它是一門結合了資訊理論、演算法、機器學習與硬體工程的深刻學問。

## 全書架構

本書分為兩大部分：

1. **無失真壓縮（Lossless Compression）**（第 1 ~ 10 章）：
   - 從 Claude Shannon 的資訊理論出發，探討壓縮的理論極限（Entropy）。
   - 介紹常見的經典演算法：Huffman Codes、Arithmetic Coding，以及近期流行的 ANS (Asymmetric Numeral Systems)。
   - 深入實務應用：LZ 系列演算法（如 Gzip）以及如何利用語言模型（LLMs）來進行文字壓縮。

2. **失真壓縮（Lossy Compression）**（第 11 ~ 18 章）：
   - 探討「Rate-Distortion Theory」，在檔案大小與失真程度（Error/Quality）之間取得最佳平衡。
   - 學習信號轉換（Transform Coding），如 DCT 等數學工具。
   - 深入解析真實世界的壓縮標準：JPEG、BPG 影像壓縮，以及現代的「學習型影像壓縮」（Learnt Image Compression）。
   - 探討人類視覺系統如何影響壓縮，以及影音串流平台（如 Netflix、YouTube）背後的視訊壓縮（Video Compression）技術。

這本書的內容源自 2023 年由 Kedar Tatwawadi, Shubham Chandak, Pulkit Tandon 與 Tsachy Weissman 等人教授的 EE274 課程。我們會保留課程中直觀的類比與生動的實驗，並把口語的講解轉化為易讀的書面知識。

現在，就讓我們進入資料壓縮的世界，從第一章開始了解無失真壓縮的基礎吧！

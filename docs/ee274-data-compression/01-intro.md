# 1. 課程簡介與無失真壓縮基礎

## 章節導讀

這章是資料壓縮旅程的起點。我們將先從宏觀的角度探討「為什麼我們需要資料壓縮」，理解壓縮在現代運算與網際網路中無所不在的角色。接著，我們將介紹評估壓縮演算法的第一個關鍵指標——**期望編碼長度（Expected Code Length）**，並引入**變動長度編碼（Variable Length Codes）**的核心概念。

## 核心概念

### 資料規模與壓縮的必要性

我們正處於資料量呈指數成長的時代。你手機裡的一張無失真照片大約是 Megabyte（$10^6$ bytes）等級，一段幾分鐘的 4K 影片則是 Gigabyte（$10^9$ bytes）等級。而當我們把視野放大到全球：
- 中大型企業在 AWS 或 Google Cloud 上管理的資料庫規模通常是 Petabytes（$10^{15}$ bytes）。
- 每天透過網際網路傳輸的資料量大約是 Exabytes（$10^{18}$ bytes）。
- 全球累積產生與複製的資料總量，更是達到了 Zettabytes（$10^{21}$ bytes）的驚人規模。

在這樣的規模下，壓縮不只是為了解省硬碟空間（Data at rest），更關鍵的是解決傳輸頻寬（Data in motion）的問題。例如，在 COVID-19 疫情期間，Netflix 就曾因為網路流量爆增，而被歐盟要求降低畫質或改進壓縮演算法，以避免癱瘓整個網路頻寬。

### 壓縮無所不在與其三大面向

資料壓縮的應用範圍遠超過我們平常右鍵點擊「加到 ZIP 檔」。在 GitHub 進行 `git pull` 時背景執行的版本控制、大型語言模型（LLMs）的權重量化（Quantization）、甚至是腦機介面（Brain-machine interfaces）的感測器資料傳輸，全都依賴於壓縮技術。

本課程將從三個不同的面向來剖析壓縮技術：
1. **理論（Theory）**：源自 Claude Shannon 的資訊理論。無論你使用多強大的電腦，無失真壓縮都存在著一個數學上的極限（Entropy，熵）。
2. **演算法（Algorithms）**：例如 Lempel-Ziv（LZ，Gzip 的基礎）與各類數學轉換（如 DCT）。
3. **工程實作（Implementation）**：為了讓影片能在瀏覽器中即時解碼，工程師甚至會在硬體指令集（Instruction Set Architectures）層級進行最佳化，或是設計特殊的幀群組（Frame Groups）來支援我們在 YouTube 上的快轉與倒轉。

### 無失真壓縮的基礎：編碼長度

在進入演算法之前，我們必須先定義資料是如何被儲存的。電腦底層使用 Bit（位元，0 或 1）來儲存資料，而 8 個 Bits 構成一個 Byte（位元組）。

#### 固定長度編碼（Fixed Bit-width Code）
傳統上，我們常使用固定長度的編碼來表示符號。最經典的例子就是 ASCII 碼，它為每個英文字母與符號分配了固定的 8 個 bits。
假設我們的文本只包含 A, B, C, D 四種符號。如果用固定長度編碼，我們需要 $\log_2(4) = 2$ 個 bits 來表示每一個符號（例如：A=00, B=01, C=10, D=11）。

#### 變動長度編碼（Variable Length Codes）
然而，固定長度編碼往往缺乏效率。如果 A 佔了文本的 90%，而 D 只有 1%，我們為什麼要為 A 和 D 花費一樣多的 bits 呢？

**變動長度編碼的核心精神是：為出現機率高的符號分配較短的編碼，為出現機率低的符號分配較長的編碼。**

假設符號的分佈與編碼如下：
- A（機率 0.50） $\rightarrow$ 編碼 `0` （長度 1）
- B（機率 0.25） $\rightarrow$ 編碼 `10` （長度 2）
- C（機率 0.125） $\rightarrow$ 編碼 `110` （長度 3）
- D（機率 0.125） $\rightarrow$ 編碼 `111` （長度 3）

我們可以計算它的**期望編碼長度（Expected Code Length）**，也就是平均每個符號花費的 bits 數：
$$
\text{Expected Length} = \sum P(x) \cdot L(x)
$$
代入數值：
$$
0.50 \times 1 + 0.25 \times 2 + 0.125 \times 3 + 0.125 \times 3 = 1.75 \text{ bits/symbol}
$$
這比固定長度編碼的 2 bits/symbol 還要短！這代表我們成功地壓縮了資料。

## 工程取捨與實務限制

在實務上，特別是在影像或音訊的「失真壓縮（Lossy Compression）」中，我們經常面臨**大小（Size）與失真（Error/Distortion）**的取捨（Trade-off）。

當檔案大小被極度壓縮時，就會產生失真（例如音訊聽起來變得尖銳，或是影像邊緣出現偽影 Ringing artifacts）。每個人對失真的容忍度不同，這也就是為什麼 Spotify 會提供「最佳音質」與「節省數據」模式，讓使用者根據自身的網路與儲存限制進行選擇。

## 小結

- 資料壓縮是現代資訊科技的基石，不僅解決儲存問題，更解決了傳輸頻寬的瓶頸。
- 壓縮的核心本質是**對資訊的簡潔表示（Succinct representation of information）**，好的壓縮器就是好的預測器。
- 為了提升壓縮效率，我們放棄了固定長度編碼，改採「變動長度編碼」，讓高頻符號擁有較短的編碼。
- **期望編碼長度**是我們衡量無失真壓縮演算法表現的基礎指標。

---
---
## 相關作業與材料

本章節的實作與練習對應於 Stanford EE274 官方提供的作業與專案：
- **對應內容**：HW1: Basic Probability, Prefix-Free Codes, Kraft Inequality, Entropy

> **注意**：為了遵守學術誠信與課程規範，本書不提供作業的解答代碼。強烈建議讀者親自前往 [EE274 課程筆記網站 (Homeworks 區塊)](https://stanforddatacompressionclass.github.io/notes/) 下載 starter code 並實作，以深化對演算法的理解。

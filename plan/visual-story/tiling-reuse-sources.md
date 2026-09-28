# GPU 資料重用視覺解說：來源與假設

## 章節支持（故事直接轉述）

| 內容 | 章節 |
|---|---|
| GEMM 定義、C[i][j] 為點積、計算量 O(mkn) | `docs/gpu/prerequisites/matrix-math.md` |
| A 的每一列重用 n 次、B 的每一行重用 m 次；Shared Memory 一次載入 tile、避免反覆讀 HBM | 同上「為什麼 GPU 擅長 GEMM？」 |
| 記憶體層次（Register、Shared Memory/L1、L2、HBM）；Compute Bound vs Memory Bound；`__shared__` 手動控制 | `docs/gpu/architecture/memory-hierarchy.md` |

故事刻意不轉述章節裡的頻寬數字（~20 TB/s、3.35 TB/s 等）：本篇沒有逐一查證，也不需要它們。

## 查證事實（教學補充）

| 用途 | 來源 | 查閱 |
|---|---|---|
| naive：A 被讀 B.width 次、B 被讀 A.height 次；共享記憶體分塊後 A 只讀 B.width / block_size 次、B 讀 A.height / block_size 次；每執行緒一個 C 元素、累加在暫存器 | NVIDIA, *CUDA C++ Programming Guide* v12.4, §3.2.4 Shared Memory（https://docs.nvidia.com/cuda/archive/12.4.0/cuda-c-programming-guide/index.html#shared-memory） | 2026-09-28，原文已比對 |
| roofline：operational intensity = 每 byte DRAM 流量的運算數；Attainable = min(峰值浮點效能, 峰值記憶體頻寬 × operational intensity)；log-log 圖、ridge point | S. Williams, A. Waterman, D. Patterson, "Roofline: An Insightful Visual Performance Model for Multicore Architectures," *Communications of the ACM* 52(4), 2009（讀的是作者預印本 https://people.eecs.berkeley.edu/~kubitron/cs252/handouts/papers/RooflineVyNoYellow.pdf 第 3 節） | 2026-09-28 |
| FP32 = 4 bytes；一次乘加算 2 FLOP | 慣例 | — |

## 教學假設（故事內都標出）

- 方陣 N×N、T 整除 N；一個執行緒算一個 C 元素；FP32。
- 只數全域記憶體讀取次數，視為都到 HBM：不含 L1/L2 快取、合併存取（實際以區段交易傳輸）、bank conflict、同步成本；C 的寫回 N² 次兩種寫法相同，不算進算術強度（本篇的算術強度是「FLOP ÷ 讀取位元組」）。
- roofline 參數：峰值 10 TFLOP/s、頻寬 2 TB/s（ridge point 5 FLOP/byte）。自設，不對應任何 GPU。預測二把頻寬改為 4 TB/s。
- tile 不能無限放大（共享記憶體容量、每 block 執行緒數有上限），本篇不給具體上限數字。
- 暫存器分塊（每個執行緒算多個 C 元素以再提高算術強度）只在邊界頁提一句，不建模。

## 不宣稱

- 不給任何 GPU 的實際 kernel 效能、不預測加速倍數。
- 真實 naive kernel 因快取，HBM 流量通常低於 2N³；本篇的 naive 數字是「沒有任何重用」的上界。

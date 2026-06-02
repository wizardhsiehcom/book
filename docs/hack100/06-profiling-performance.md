# Profiling、硬體計數器與效能工程

效能問題最怕兩種事：第一種是完全不量測，第二種是量測了卻不知道自己量到什麼。Binary Hacks 在 profiling 主題上留下的最大資產，是一種非常節制的態度：**先量，再判斷，再優化。**

## 效能工程的基本流程

```mermaid
flowchart LR
    A["症狀"] --> B["界定工作負載"]
    B --> C["選擇工具"]
    C --> D["收集時間線 / 計數器"]
    D --> E["判斷瓶頸類型"]
    E --> F["修改實作"]
    F --> G["重新量測"]
    G --> H["保留或回退"]
```

這個流程看似普通，但它能阻止最常見的失敗：在完全不知道瓶頸位置時，就開始改模型、改 batch、改 kernel、改架構。

## CPU profiling、GPU profiling 與 PMU

### CPU profiling

CPU profiling 主要回答：

- 哪些函式耗時最高？
- 熱點是在 Python、C++，還是系統函式？
- 問題是計算、記憶體存取，還是同步等待？

### GPU profiling

GPU profiling 主要回答：

- kernel launch 是否太頻繁？
- 記憶體搬移是否壓過計算？
- 單一 kernel 的 occupancy、throughput、memory behavior 是否健康？

### PMU 與硬體計數器

PMU 的價值在於，它讓你不只知道「慢」，還能知道「為什麼慢」：

- cache miss 高不高
- branch mispredict 多不多
- 指令退休速度如何
- cycle 跟 instruction 的比例是否異常

這類訊號對 CPU 端前後處理、tokenization、排程器與資料管線尤其重要。

## AI 時代的常見誤判

### 1. 只看平均延遲

平均值很容易掩蓋：

- 第一個 request 特別慢
- 偶發的同步停頓
- 長尾延遲

### 2. 把 GPU 忙碌當成 GPU 有效

GPU 很忙，不代表工作有效率。可能只是：

- kernel 太碎
- 記憶體頻寬成為主瓶頸
- CPU 沒有餵飽 GPU

### 3. 用錯量測尺度

微基準、端對端 benchmark、線上服務延遲，三者不能混為一談。你在其中一個尺度量到的結論，不一定能直接搬到另一個尺度。

## 為什麼微基準仍然重要

很多人對 microbenchmark 有戒心，怕它脫離真實場景。這個警覺是對的，但不代表微基準沒用。真正的問題是：**你有沒有知道自己在隔離哪個成本。**

例如你可以用微基準回答：

- 一個新的 allocator 是否真的更快
- 某個 layout 轉換的 CPU 成本是多少
- 一段 kernel 的 launch overhead 大概在哪裡

但你不能直接用它回答整個服務的使用者體感。

## 實務上的工具分層

| 問題 | 優先工具 |
| --- | --- |
| 服務整體延遲分布 | 應用層 metrics、trace、端對端 benchmark |
| CPU 熱點 | `perf`、火焰圖、語言對應 profiler |
| GPU 時間線 | Nsight Systems、`torch.profiler` |
| 單一 kernel 行為 | Nsight Compute、裝置端 counters |
| 微觀單元成本 | microbenchmark 與專用測試 |

## Binary Hacks 留下的真正方法論

它教你的不是某個舊工具，而是以下判斷：

1. 先把瓶頸放到正確層級。
2. 量測要能回到執行模型，不只是漂亮圖表。
3. 任何優化都要能被重新驗證。

如果一個效能結論無法被重複量到，它就不應該進入架構決策。

與[JIT、編譯器與 Kernel 生成](03-codegen-jit.md)合讀時，能更清楚看見「codegen 改動」是否真的轉成「硬體上的收益」。

> 本頁主題對應 Binary Hacks 第 6 章，並延伸到現代 CPU/GPU profiling 與微基準方法論。

# GPUs, TPUs

## 導讀

前幾講我們把語言模型看成一串神經網路運算：token 進來，經過 embedding、attention、MLP，最後預測下一個 token。這種視角是必要的，但不夠完整。真正訓練與服務大型語言模型時，問題不只是「公式對不對」，而是「這些公式如何落在硬體上」。

本講開始進入 systems。核心觀念很直接：現代語言模型的進步高度依賴 compute，而 compute 不是抽象數字。它來自 GPU、TPU、記憶體階層、矩陣乘法單元、低精度格式、kernel fusion、tiling，以及許多看似瑣碎但會讓吞吐差一大截的 shape 對齊問題。

講者一開始給出一個目標：到本講結束時，我們應該能解釋為什麼同樣是矩陣乘法，某些矩陣尺寸非常快，某些只差一個維度卻突然變慢。這個問題看似是 GPU trivia，實際上正好濃縮了 LLM 系統工程的核心：硬體不是均勻的計算海洋，資料移動與對齊方式常常比運算式本身更重要。

## 從 CPU 到 GPU：低延遲與高吞吐

CPU 與 GPU 的差別不只是「GPU 比較快」。CPU 的設計目標偏向低延遲序列執行：它要快速處理複雜控制流程、條件分支與各式各樣的指令。為了做到這件事，CPU 有較複雜的控制單元，搭配相對少量但靈活的運算單元。

GPU 的設計哲學不同。GPU 追求高吞吐，而不是讓單一任務最快完成。它有大量輕量運算單元，可以同時處理許多相似工作。單一 thread 可能等待記憶體、被暫停、之後再繼續，但整體上 GPU 讓大量工作保持在飛行中，藉此提高總吞吐。

這正好符合深度學習的需求。語言模型裡最重要的操作大多是大矩陣乘法；這類操作有規則、可平行、資料量大。當 Dennard scaling 讓單顆 CPU 靠提高 clock speed 變快的路徑逐漸失效後，GPU 代表的是另一條路：不再把單一路徑跑得更快，而是把大量路徑同時鋪開。

## GPU 的硬體模型

理解 GPU，先抓住幾個名詞。

SM，也就是 Streaming Multiprocessor，是 GPU 的主要計算單元。可以把它想成 GPU 裡一個獨立工作的核心。每個 SM 裡有許多更小的執行單元，也有靠近自己的快取與 shared memory。大型 GPU 會有很多 SM，讓許多 block 同時執行。

Thread 是最小的平行工作單位。GPU thread 採用 SIMT 模型：同一組 thread 執行相同指令，但用不同資料。這讓 GPU 能以較低控制成本管理大量 thread，也讓程式設計者必須避免過度分歧。

Block 是一組 threads，保證會在同一個 SM 上執行。這件事重要，是因為同一個 block 內的 threads 可以共享該 SM 的 shared memory。後面談 tiling 時，block 會把一小塊矩陣搬到 shared memory，讓多個 threads 重複使用。

Warp 是排程單位，通常由 32 個連續 threads 組成。當我們說 warp 內 threads 執行相同指令，意思是硬體以這種小隊為單位推進工作。

## 記憶體階層才是主角

如果只看 FLOPs，會誤以為 GPU 效能完全由運算單元決定。但本講反覆強調：現代機器學習最佳化常常是 memory problem。

GPU 的記憶體不是單一層。最快的是 registers，容量很小，保存地址或少量中間值。接著是 shared memory 與 L1 cache，它們非常靠近 SM，延遲低。L1 cache 由硬體自動管理；shared memory 則是程式可以明確控制、放入、取出與共享的空間。再往外是 L2 cache。最外層是 global memory，也就是高階使用者通常說的 GPU memory 或 HBM，容量大但離計算單元遠、延遲高。

這個階層帶來一條工程原則：能不碰 global memory 就不碰，非碰不可也要少碰。高效 GPU kernel 的許多技巧，其實都是在回答同一個問題：如何讓資料一旦被搬到靠近 SM 的地方，就被用好、用滿、用很多次？

## TPU：相似問題的另一種答案

本講大部分談 GPU，但 TPU 是有用的對照。TPU 與 GPU 在高層次上很像：都有矩陣乘法單元、向量操作、控制邏輯，以及快慢記憶體階層。這不是巧合，而是機器學習加速器的趨同演化。要高效率跑大型矩陣運算，最後很容易走向類似結構。

差異在於配置。GPU 有很多較小、較彈性的運算單元；TPU 則偏向少量但更大的矩陣乘法單元，更專門面向機器學習 workload。這使 GPU 通常更彈性，TPU 則在符合其假設的工作上很有力。

還有一個容易混淆的命名：GPU 的 Tensor Core 指矩陣乘法單元；TPU 語境中的 tensor core 則可指處理器級單元。讀文件時必須看上下文。

## Roofline：你到底卡在算力還是記憶體？

要判斷一段程式為什麼慢，可以用 roofline model 建立直覺。它把可達吞吐量看成兩個限制的較小者：

```text
可達吞吐 <= min(硬體峰值 FLOPs, memory bandwidth * arithmetic intensity)
```

其中 arithmetic intensity 是每搬動一單位資料能做多少運算：

```text
arithmetic intensity = FLOPs / bytes moved
```

如果 intensity 太低，運算單元等資料，程式是 memory-bound。這時增加更多矩陣乘法單元沒用，因為資料送不進來。如果 intensity 夠高，運算單元被餵飽，程式進入 compute-bound，吞吐接近硬體峰值。

這解釋了為什麼小矩陣乘法常常不快：工作量不夠大，資料搬運成本攤不掉。也解釋了為什麼效能最佳化不是單純「少做運算」，有時候我們反而願意多做一點運算，只要能少搬很多資料。

## 讓 GPU 跑快的基本技巧

第一個技巧是避免 control divergence。GPU warp 內 threads 應盡量走相同指令流。如果一個 `if/else` 讓同一個 warp 的 threads 分成兩邊，硬體往往要把兩個分支都走過一次，不屬於該分支的 threads 只能被 mask 掉等待。這就是為什麼 GPU code 常偏好 mask 或向量化條件運算，而不是大量細碎分支。

第二個技巧是低精度。從 FP32 到 BF16，資料大小減半；到 FP8、FP4，資料更小，矩陣乘法硬體也可能提供更高吞吐。但低精度不是把所有數字粗暴截短。矩陣乘法可以低精度輸入、較高精度累加；softmax、exp、最後輸出層等則可能需要更高精度。FP8 還需要 scaling factor 避免 overflow 或 underflow。更進階的 MXFP8 會讓不同小區塊使用不同 scale，提升表示能力，但代價是轉置與量化管理更複雜。

第三個技巧是 operator fusion。假設我們計算 `sin(x)^2 + cos(x)^2`，天真的 PyTorch graph 可能拆成 sin、cos、square、add 多個操作。每個操作若各自讀 global memory、寫 global memory，就會讓資料反覆在 HBM 和 SM 之間來回。Fusion 把多個操作合成一個 kernel：讀一次，在 SM 內完成一串計算，最後寫一次。簡單 fusion 可由 compiler 自動做；複雜情況則可能需要專門 kernel。

第四個技巧是 recomputation。反向傳播通常保存 forward activations，backward 時直接使用。但如果記憶體比運算昂貴，可以丟掉部分 activation，backward 時重新算。這用更多 compute 換更少 memory access。對大型 attention 這種會產生巨大中間矩陣的操作，這個交換非常重要。

第五個技巧是 memory coalescing。DRAM 不是一次只有效率地取一個數，而是以連續 burst section 的方式工作。若同一 warp 的 threads 讀取連續位置，硬體可以把這些讀取合併，效率很高。若 threads 以跨 stride 的方式散落在不同 burst section，就會搬很多用不到的資料。這也是 row-major、column-major、padding、矩陣維度對齊會影響效能的原因。

第六個技巧是 tiling。矩陣乘法中，同一個元素會被重複使用很多次。與其每次都從 global memory 讀，不如把矩陣切成 tile，先把一小塊搬到 shared memory，再在 shared memory 裡反覆使用。對 `n x n` 矩陣乘法，naive 做法中每個輸入元素可能從 global memory 讀 `n` 次；若 tile size 是 `T`，global memory 讀取約可降到 `n/T` 次，剩下的重用發生在快得多的 shared memory 中。

## 為什麼 padding 可以變快？

本講最有代表性的例子是：把 vocabulary size 從 50257 padding 到 50304，反而得到明顯加速。表面上 padding 增加了維度，似乎應該更慢；但硬體看的是 tile、burst section、warp、SM wave，而不是語義上的 vocabulary。

如果矩陣尺寸不對齊，讀一個 tile 可能跨過多個 burst section，導致 memory coalescing 變差。若尺寸不能整除 tile，也可能產生很瘦的邊界 tile，浪費運算。相反地，把維度 padding 到硬體友善的倍數，雖然多算了一點無用位置，卻可能讓每次讀寫更整齊，總時間反而下降。

這裡的重要教訓不是「永遠使用 32 的倍數」這種口訣，而是理解口訣背後的原因：常見倍數之所以有效，是因為它們更容易符合 warp、burst window、tile size 與矩陣乘法單元的對齊需求。

## Wave Quantization：只差一格也可能掉速

吞吐曲線中的另一種怪現象來自 wave quantization。假設 kernel 使用 `256 x 128` 的 tile。當矩陣尺寸是 1792 時，總共有 98 個 tiles；當尺寸變成 1793 時，因為兩個方向都多出邊界 tile，tile 數可能跳到 120。

如果 A100 有 108 個 SM，98 個 tiles 可以一波派完，所有工作大致同時完成。120 個 tiles 則需要第二波，但第二波只剩 12 個 tiles，絕大多數 SM 閒置等待。於是只增加一個維度，吞吐可能大幅下降。

這種例子說明，效能不是平滑函數。模型維度、batch size、sequence length、vocab size 只要跨過某些硬體邊界，時間就可能突然變化。

## FlashAttention：系統技巧的總結

標準 attention 可以寫成：

```text
S = Q K^T
P = softmax(S)
O = P V
```

數學式很簡潔，但 naive 實作會產生 `S` 與 `P` 這類 `n x n` 中間矩陣。這些矩陣若寫到 HBM，再從 HBM 讀回來，就會付出巨大記憶體成本。FlashAttention 的貢獻不是改寫 attention 的數學意義，而是把同一個計算重新安排成硬體友善的流程。

它先把 Q、K、V 切成 tiles，在 SRAM/shared memory 中做 tiled matmul。困難點是 softmax 看起來是全域操作：要知道整列的最大值與正規化分母，似乎必須先看完整 row。FlashAttention 的關鍵是 online softmax。它逐 tile 維護目前看過的最大值與 exponential sum；如果遇到新的最大值，就用比例因子修正舊 accumulator。

單元素版本的直覺可以寫成：

```text
m_new = max(m_old, x)
l_new = exp(m_old - m_new) * l_old + exp(x - m_new)
```

tile 版本則把 `x` 換成 tile 的局部最大值與局部和。這讓 softmax 可以分塊進行，不必把完整 `n x n` score matrix 寫回 HBM。backward 時，FlashAttention 也可選擇不保存所有巨大 activation，而是在需要時按 tile 重算。這正是 tiling、fusion、recomputation、memory hierarchy awareness 的組合。

## 工程取捨

第一個取捨是彈性與效率。GPU 比 TPU 彈性，能處理更多不同形狀與控制流程；TPU 更專門，某些矩陣乘法工作可能更直接受益。語言模型系統設計不能只問硬體峰值 FLOPs，也要問模型 shape、kernel、networking 是否符合硬體假設。

第二個取捨是精度與穩定性。低精度可以降低記憶體流量、提高吞吐，但每一層、每一種操作的數值穩定性不同。矩陣乘法適合低精度，softmax 與最後輸出層則更敏感。追求 FP8 或 FP4 時，scale factor、轉置副本、quantize/dequantize overhead 都會變成實際成本。

第三個取捨是 compute 與 memory。Recomputation 看似浪費，因為同一段 forward 被算了兩次；但若 memory access 是瓶頸，多算反而更快。FlashAttention 正是用這個思路避免保存巨大 attention matrix。

第四個取捨是可讀性與 kernel 最佳化。高階框架讓我們容易寫模型，但天真的運算圖可能有太多中間張量與 kernel launch。Compiler 可以 fuse 一些簡單圖形，但特殊操作、特殊 shape 或最新 attention kernel 仍需要理解底層。

第五個取捨是語義尺寸與硬體尺寸。模型作者可能從語言或統計角度選擇 vocabulary size、hidden size、head dimension，但硬體關心的是是否對齊 tile、warp、burst section 與 SM wave。多 padding 一點有時是合理工程選擇。

## 常見誤解

第一個誤解是「GPU 快，所以任何程式丟上 GPU 都會快」。GPU 擅長規則、大量、可平行、資料重用高的工作。小工作、分支多、記憶體搬運密集的程式可能無法吃滿 GPU。

第二個誤解是「FLOPs 是唯一瓶頸」。在現代加速器上，compute 成長速度快於 memory bandwidth。很多 LLM workload 卡在資料搬運，不是乘法單元不夠。

第三個誤解是「矩陣越大一定越快或越慢」。實際吞吐會受 operational intensity、tile 對齊、coalescing、SM 數量與 wave quantization 影響。只差一個維度也可能跨過硬體邊界。

第四個誤解是「powers of two 有魔法」。常見倍數有效，不是因為數字本身神祕，而是因為它們常對齊 burst window、warp、tile size 或矩陣乘法硬體需求。

第五個誤解是「FlashAttention 是新的 attention 公式」。它計算的是同一個 attention，重點在系統實作：不把巨大中間矩陣反覆寫入 HBM，改用 tile、online softmax 與 recomputation。

第六個誤解是「shared memory 和 L1 cache 一樣」。兩者都快，但 L1 cache 主要由硬體自動管理；shared memory 是程式可以明確控制、讓 block 內 threads 協作重用的空間。

## 小結

本講把語言模型從抽象神經網路拉回硬體。GPU 與 TPU 的價值不只是提供更多 FLOPs，而是提供一套以大量平行、矩陣乘法、記憶體階層為中心的計算模型。要有效使用這套模型，必須理解資料在哪裡、如何移動、何時重用、何時該多算少存。

六個基本技巧可以串成同一條線：避免 warp 內分歧、降低 precision、fusion 減少中間讀寫、recomputation 用算力換記憶體、coalescing 讓 DRAM 讀取整齊、tiling 讓資料在 shared memory 中重用。FlashAttention 則展示了這些技巧如何合成一個實際改變 LLM 訓練與推論效率的 kernel。

對從零實作語言模型來說，本講的訊息很務實：不要只寫出數學上正確的模型，也要讓模型形狀、資料格式與核心操作符合硬體。真正的 scale 不只來自更大模型，也來自更有效地使用已經買到的每一分 compute。

## 相關作業與材料

- Course material：`data/cs336/lectures material/lecture_05.pdf`。狀態：已核對 PDF metadata / outline；投影片未完整閱讀。
- Assignment 關聯：Assignment 2（`data/cs336/code/assignment2-systems-main/`）對應 profiling、benchmarking、memory accounting、mixed precision 與 single-GPU memory 的實作/分析範圍。狀態：已核對 README、PDF outline、測試介面；handout 未完整閱讀。
- 本段只整理學習目標與章節關聯，不提供作業解答。

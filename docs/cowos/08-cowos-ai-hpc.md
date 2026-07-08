# CoWoS 在 AI 加速器中的角色

CoWoS 不只是封裝技術，它是決定 AI 加速器效能天花板的核心架構選擇。以下從具體產品角度解析 CoWoS 如何在系統層面發揮作用。

## NVIDIA H100：CoWoS-S 的代表作

```mermaid
flowchart TB
    subgraph "H100 SXM5 封裝（~2100 mm² 中介板）"
        GPU["GH100 Die<br/>4nm TSMC<br/>814 mm²"]
        H1["HBM3 #1<br/>16GB"] & H2["HBM3 #2<br/>16GB"] & H3["HBM3 #3<br/>16GB"]
        H4["HBM3 #4<br/>16GB"] & H5["HBM3 #5<br/>16GB"] & H6["填充 die<br/>未啟用"]
        INT["CoWoS-S 矽中介板"]
        GPU & H1 & H2 & H3 & H4 & H5 & H6 --> INT
    end
```

- GPU Die 居中，6 個 HBM 位置環繞兩側——**5 顆啟用（共 80 GB）、1 顆為維持機械平衡的結構填充 die**
- 每顆啟用的 HBM3 透過中介板 RDL 與 GPU 的 HBM PHY 直連
- 總頻寬：3.35 TB/s，是前代 A100（2 TB/s）的 1.7 倍

## AMD MI300X：最激進的 CoWoS 應用

AMD MI300X 把 Chiplet 架構推到極致：

- **8 個 Compute Die（CCD）**：5nm，分兩層堆疊（3D 結構）
- **4 個 IO Die（IOD）**：6nm，負責記憶體控制器與 PCIe
- **8 顆 HBM3**：共 192 GB 容量
- **中介板面積**：~3,000 mm²（需多片光罩拼接）

```mermaid
flowchart TB
    subgraph "MI300X 封裝（俯視概念圖）"
        I1["IOD"] & I2["IOD"] & I3["IOD"] & I4["IOD"]
        HB1["HBM3"] & HB2["HBM3"] & HB3["HBM3"] & HB4["HBM3"]
        HB5["HBM3"] & HB6["HBM3"] & HB7["HBM3"] & HB8["HBM3"]
        INT["大面積 CoWoS-S 中介板"]
        I1 & I2 & I3 & I4 --> INT
        HB1 & HB2 & HB3 & HB4 --> INT
        HB5 & HB6 & HB7 & HB8 --> INT
    end
```

> 8 個 Compute Die（XCD）以 SoIC 3D 堆疊在 4 個 IOD **之上**，俯視時被 IOD 遮住，故圖中只見 IOD 與 HBM。

## CoWoS 為 AI 帶來的系統級影響

### 1. 大模型推理：記憶體容量決定模型大小
- GPT-4 等大型模型需要數百 GB 顯存
- CoWoS 讓每顆加速器可配置 80–192 GB HBM
- 比傳統方案多 4–8 倍容量

### 2. 訓練效率：頻寬決定 Gradient 同步速度
- 在 Tensor Parallelism 中，每個 AllReduce 操作需要高頻寬
- CoWoS 的高 HBM 頻寬直接縮短等待時間

### 3. 功耗效率：HBM 的能效遠優於 GDDR

```mermaid
graph LR
    A["GDDR6X<br/>能效 ~7–15 pJ/bit<br/>（文獻估計不一）"]
    B["HBM3<br/>能效 ~3–4 pJ/bit"]
    C["功耗大幅節省<br/>（記憶體介面部分）"]
    A & B --> C
```

## 供應鏈瓶頸

CoWoS 目前是 AI 晶片的**最大供應瓶頸**之一：

- 全球能製造大面積 CoWoS 的廠商幾乎只有 TSMC
- 2023–2024 年 TSMC CoWoS 產能嚴重供不應求
- 每塊大面積中介板的良率挑戰使產能擴充困難

> 相關：[可靠性與製造挑戰](10-reliability-manufacturing.md)

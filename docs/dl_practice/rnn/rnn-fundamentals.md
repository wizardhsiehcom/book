# RNN 基礎與序列建模

## 為什麼需要 RNN？

MLP 和 CNN 假設輸入是獨立的——一張影像、一筆特徵向量。但自然語言、時間序列、音訊都有**順序依賴**：「我吃了飯」與「飯吃了我」意思天差地遠。

RNN 透過**隱藏狀態（Hidden State）**在時步之間傳遞記憶：

$$\mathbf{h}_t = f\!\left(W_{hh}\,\mathbf{h}_{t-1} + W_{xh}\,\mathbf{x}_t + \mathbf{b}\right)$$

```mermaid
flowchart LR
    X0["x₀"] --> RNN0["RNN 單元<br/>h₀"]
    X1["x₁"] --> RNN1["RNN 單元<br/>h₁"]
    X2["x₂"] --> RNN2["RNN 單元<br/>h₂"]
    X3["xₙ"] --> RNN3["RNN 單元<br/>hₙ"]
    RNN0 -->|"h₀"| RNN1
    RNN1 -->|"h₁"| RNN2
    RNN2 -->|"..."| RNN3
    RNN3 --> OUT["輸出 ŷ"]
```

## 三種輸入輸出模式

```mermaid
flowchart TD
    subgraph "多對一（情感分析）"
        A1["x₁ x₂ x₃"] --> B1["hₙ"] --> C1["一個標籤"]
    end
    subgraph "一對多（圖片描述）"
        A2["一張影像"] --> B2["h₀"] --> C2["y₁ y₂ y₃ ..."]
    end
    subgraph "多對多（機器翻譯）"
        A3["x₁ x₂ x₃"] --> B3["Encoder"] --> C3["Decoder"] --> D3["y₁ y₂ y₃"]
    end
```

## 時間展開（BPTT）

反向傳播在 RNN 中沿時間軸展開（Backpropagation Through Time, BPTT）。梯度需要經過 $T$ 個時步連乘傳回，這正是梯度消失問題在 RNN 中特別嚴重的原因。

```mermaid
flowchart RL
    HT["hₜ"] -->|"∂L/∂hₜ"| HT1["hₜ₋₁"]
    HT1 -->|"∂L/∂hₜ₋₁"| HT2["hₜ₋₂"]
    HT2 -->|"×W × ×W ×..."| H0["h₀"]
```

**問題**：序列越長，早期輸入的梯度越小，模型對長程依賴的學習越差。

## 雙向 RNN（Bi-RNN）

許多任務需要同時看前文和後文（例如：命名實體辨識）。雙向 RNN 讓兩個 RNN 分別從左到右、從右到左處理序列，再合併兩個方向的隱藏狀態：

$$\mathbf{h}_t = [\overrightarrow{\mathbf{h}}_t;\overleftarrow{\mathbf{h}}_t]$$

---

RNN 的梯度消失問題促使了 [LSTM 與 GRU](lstm-gru.md) 的誕生。

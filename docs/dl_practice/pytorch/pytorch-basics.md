# PyTorch 基礎操作

## 核心抽象：張量（Tensor）

PyTorch 的基本資料結構是 `torch.Tensor`，概念上是多維陣列，底層支援 GPU 加速與自動微分。

```python
import torch

# 建立張量
x = torch.tensor([[1.0, 2.0], [3.0, 4.0]])
print(x.shape)   # torch.Size([2, 2])
print(x.dtype)   # torch.float32

# 移至 GPU
device = "cuda" if torch.cuda.is_available() else "cpu"
x = x.to(device)

# 常用操作
a = torch.randn(3, 4)     # 隨機初始化
b = torch.zeros(3, 4)     # 全零
c = a @ b.T               # 矩陣乘法 (3×4) @ (4×3) = (3×3)
```

## 自動微分（Autograd）

PyTorch 在計算過程中動態建立計算圖，`.backward()` 自動計算梯度：

```python
x = torch.tensor(3.0, requires_grad=True)
y = x ** 2 + 2 * x + 1    # y = (x+1)^2

y.backward()               # 反向傳播
print(x.grad)              # dy/dx = 2(x+1) = 8.0
```

## 定義模型：nn.Module

所有 PyTorch 模型都繼承自 `nn.Module`：

```python
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self, in_dim, hidden_dim, out_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, out_dim),
        )

    def forward(self, x):
        return self.net(x)

model = MLP(784, 256, 10).to(device)
print(sum(p.numel() for p in model.parameters()))  # 參數量
```

## 常用層速查

| 層 | 說明 | 常見用途 |
|----|------|---------|
| `nn.Linear(in, out)` | 全連接層 | MLP、分類頭 |
| `nn.Conv2d(C_in, C_out, k)` | 2D 卷積 | CNN |
| `nn.LSTM(input, hidden)` | LSTM 層 | 序列建模 |
| `nn.MultiheadAttention(d, h)` | 多頭注意力 | Transformer |
| `nn.Embedding(vocab, dim)` | 詞嵌入 | NLP |
| `nn.BatchNorm2d(C)` | Batch 正規化 | CNN 加速訓練 |
| `nn.Dropout(p)` | Dropout | 防止過擬合 |
| `nn.LayerNorm(dim)` | Layer 正規化 | Transformer |

## 優化器與損失函數

```python
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)
criterion = nn.CrossEntropyLoss()
```

---

有了這些積木，看看如何組裝成[完整訓練流程](training-loop.md)。

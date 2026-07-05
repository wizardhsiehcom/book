# 第 3 章：屬性規範 (一) (Property Specification 1)

在上一章中，我們討論了如何對系統建立模型。要驗證一個安全關鍵系統 (Safety Critical Systems)，我們需要兩個主要輸入：一是**系統模型 (System Model)**，二是**屬性規範 (Property Specification)**。本章我們將先收尾系統建模的驗證方法，接著探討如何量化與規範系統的預期行為。

## 3.1 系統建模總結與驗證

### 3.1.1 貝氏參數學習 (Bayesian Parameter Learning)
相較於最大概似估計 (MLE) 只給出一組最佳參數，**貝氏參數學習**會維持一個參數的機率分配。根據貝氏定理：
$$P(\theta | D) \propto P(D | \theta) P(\theta)$$
我們結合了事前分配 (Prior) $P(\theta)$ 與概似模型 (Likelihood) $P(D|\theta)$ 來計算事後分配 (Posterior) $P(\theta|D)$。
- **機率程式設計 (Probabilistic Programming)**：當事後分配難以解析計算時，我們可以使用馬可夫鏈蒙地卡羅 (MCMC) 等抽樣方法，從事後分配中抽取樣本。例如，Julia 語言中的 `Turing.jl` 套件提供了這種功能。
- **共軛事前分配 (Conjugate Prior)**：在某些特定的分配組合下，事後分配會和事前分配屬於同一種分配族。例如：Beta 分配是二項式 (Binomial) 概似的共軛事前分配。使用共軛事前分配可以得到解析解，省去抽樣的運算成本。

### 3.1.2 過度擬合與模型驗證
建立模型時必須避免**過度擬合 (Overfitting)**。我們通常會保留一組未參與訓練的驗證集，或是使用交叉驗證 (Cross-validation) 來評估模型的泛化能力。

即使我們做好了參數估計，若模型的基礎假設偏離現實，後續所有的驗證結果將毫無意義。因此，我們需要透過以下工具來檢驗模型是否符合真實數據：
1. **視覺化診斷 (Visual Diagnostics)**：
   - **機率密度函數 (PDF) 與 累積分配函數 (CDF)**：對比模型與實際數據的分配形狀。
   - **QQ 圖 (Quantile-Quantile Plot)**：繪製模型與資料對應分位數 (Quantile) 的散佈圖，若完全吻合，所有點應落在 $y=x$ 的直線上。
   - **校準圖 (Calibration Plot)**：類似 QQ 圖，但軸上繪製的是分位數對應的百分比 (Alpha)。
2. **總結指標 (Summary Metrics)**：
   - **KL 散度 (KL Divergence)**：用於量化兩個 PDF 之間的差異。
   - **KS 統計量 (KS Statistic)**：衡量兩個 CDF 之間的最大垂直差距。
   - **最大 / 期望校準誤差 (Max / Expected Calibration Error)**：衡量校準圖與 $y=x$ 理想直線的距離。

> [!CAUTION]
> **多維度特徵的陷阱**
> 僅分別比較個別特徵的邊際分配 (Marginal Distributions) 是不夠的。兩個不同的特徵即使邊際分配與數據完美吻合，但其聯合分配 (Joint Distribution) 可能完全錯誤。因此，必須考量多個特徵間的交互關係（例如將資料投影至不同方向，或使用多維度的 KL 散度）。

---

## 3.2 屬性規範的概念

**屬性規範**旨在以形式化的方式，精確定義系統應該完成的任務與行為。我們可以將系統的行為對應到兩種不同的表示方式：

1. **指標 (Metric)**：將系統行為對應到一個**實數**。例如：兩架飛機在遭遇時的「最小未命中距離 (Miss Distance)」。
2. **規範 (Specification)**：將系統行為對應到一個**布林值 (Boolean, True/False)**。例如：「最小未命中距離是否大於 50 公尺」。

這兩者可以互相轉換：從指標出發，給定一個門檻值即可得到規範；而從規範出發，我們可以計算該規範被滿足的**機率**，這又成了一個實數值的指標。

```mermaid
graph LR
    A["系統軌跡 (System Trajectories)"] --> B["指標 (Metric)<br/>回傳實數值"]
    B --> C["規範 (Specification)<br/>回傳布林值"]
    C --> D["期望機率<br/>(回到實數)"]
```

---

## 3.3 風險指標 (Risk Metrics)

在安全關鍵系統中，我們經常處理隨機系統，因此會得到軌跡的分佈。比起看平均值，我們更在乎**最壞情況 (Worst-case outcomes)**。這時候我們會定義**風險指標 (Risk Metric)**，其特點是：**數值越高，結果越糟**（例如將未命中距離轉換為「失去的安全距離 (Loss of Separation)」）。

給定風險的分佈，如果僅看期望值，可能會無法區分風險的高低。因此我們引入了以下兩種進階風險評估指標：

### 3.3.1 風險值 (Value at Risk, VaR)
VaR 給定一個機率參數 $\alpha$ (例如 $\alpha = 0.7$)，表示**風險有 $\alpha$ 的機率保證不會超過該數值**。在數學上，這等價於風險指標的 $\alpha$-分位數 (Quantile)。
- **意義**：如果 VaR 很低，代表我們有信心地認為風險不會太高。

### 3.3.2 條件風險值 (Conditional Value at Risk, CVaR)
CVaR 同樣帶有一個參數 $\alpha$，它是**所有超過 VaR 的風險值的平均（期望值）**。
- **意義**：相對於 VaR 只是一個門檻，CVaR 更進一步評估了「當最壞的情況發生時，平均而言會有多糟」。
- 當 $\alpha \to 1$ 時，只看絕對最壞的情形；當 $\alpha \to 0$ 時，CVaR 就等同於整個分佈的期望值。

---

## 3.4 複合指標與多目標 (Composite Metrics)

系統設計中經常遇到多個互相衝突的目標。例如，防撞系統的「警報率 (Alert Rate)」與「碰撞率 (Collision Rate)」我們都希望越低越好，但若要碰撞率極低，系統可能會過度敏感，導致警報率大幅上升。

### 3.4.1 柏拉圖最佳 (Pareto Optimality)
如果在不使任何一個指標變差的情況下，無法再改善其他任何指標，這樣的系統設計就被稱為**柏拉圖最佳 (Pareto Optimal)**。所有柏拉圖最佳設計的集合，構成了一條**柏拉圖前緣 (Pareto Frontier)**。

```mermaid
graph TD
    subgraph "多目標優化（Multi-Objective Optimization）"
        P1["警報率高，碰撞率低"]
        P2["警報率低，碰撞率高"]
        P3["柏拉圖最佳解集"]
    end
    P1 --> P3
    P2 --> P3
```

### 3.4.2 單一化複合指標
由於柏拉圖前緣上有多個點，我們需要一種方法來選擇最終的系統設計。常用的方法有：
1. **加權總和 (Weighted Sum)**：給每個指標設定權重 $w_i$，直接加總求極值。
2. **目標距離指標 (Goal Distance Metric)**：先定義一個理想但無法達到的「烏托邦點 (Utopia Point)」（例如警報率為 0，碰撞率也為 0），然後在柏拉圖前緣上找出與該烏托邦點距離最近的設計。
3. **加權指數總和 (Weighted Exponential Sum)**：結合權重與距離的方法。

（關於如何透過「偏好引出 (Preference Elicitation)」來找出合適的權重，將在下一節繼續探討。）

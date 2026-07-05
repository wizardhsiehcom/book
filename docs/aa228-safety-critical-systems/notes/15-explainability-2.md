# Lecture 15: 可解釋性 2 (Explainability 2)

## 1. 核心概念 (Core Concepts)

- **可解釋性的動機 (Motivation for Explainability)**：工程師在系統部署後遭遇關鍵失效時，需回答三個核心問題：
  1. **為什麼這個失效發生？(Why did the failure happen?)**
  2. **我們能做什麼？(What can we do about it?)**
  3. **如何向利益相關人保證問題已修復？(How can we guarantee the fix?)**

- **Shapley 值 (Shapley Values)**：源自賽局理論的特徵歸因方法，可衡量各特徵（或時間步的雜訊）對結果的個別貢獻。
  - 公式：$\phi_i = \sum_{S \subseteq N \setminus \{i\}} \frac{|S|!(|N|-|S|-1)!}{|N|!}[F(S \cup \{i\}) - F(S)]$
  - 問題：維度詛咒，n 個特徵需枚舉 n! 個子集（例如 40 個時間步需 10^47 次操作）。

- **策略視覺化 (Policy Visualization)**：在低維度狀態空間中繪製策略熱圖，可直接觀察策略的死區 (Dead Zone) 或異常行為。

- **最壞案例分析 (Worst-Case Analysis)**：直接審視表現最差的樣本，常能揭示資料集偏差或分佈外 (Out-of-distribution) 問題。

- **視覺模型可解釋性 (Vision Model Explainability)**：
  - **擾動法 (Perturbation)**：遮蔽圖像區域，觀察輸出變化。
  - **梯度法 / 顯著圖 (Gradient / Saliency Map)**：對損失函數對輸入像素求梯度，因 Softmax 飽和問題效果不佳。
  - **整合梯度 (Integrated Gradients)**：從黑色基準逐步插值到原始輸入，累積梯度以避免飽和問題。
  - **Grad-CAM**：對 CNN 後期特徵圖的梯度進行全局平均池化，得到高層語意定位圖。

- **Clever Hans 問題**：模型可能學習到偽相關特徵（如背景顏色、時間戳記），而非真正的預測特徵。

- **健全性檢查 (Sanity Check)**：對可解釋性方法本身進行驗證，確認隨機化模型權重後解釋結果是否正確改變。

- **機制性可解釋性 (Mechanistic Interpretability)**：
  - **稀疏自編碼器 (Sparse Autoencoders, SAE)**：用編碼器→ReLU→解碼器架構，加 L1 稀疏懲罰，從模型激活中提取語意特徵方向。
  - **方向性表示 (Directional Representation)**：LLM 內部以高維空間中的方向（而非個別維度）表示概念，且方向數量可超過嵌入維度（超完備字典）。
  - **電路追蹤 (Circuit Tracing)**：利用 SAE 找出語意節點，再建構類似貝氏網路的因果圖，追蹤模型推理路徑。

- **因果 vs 相關 (Causal vs Correlational)**：
  - 貝氏網路只能建模相關/關聯，無法回答干預實驗問題，也不具分佈偏移穩健性。
  - 因果圖可回答「如果我們改變 X，Y 會如何？」的問題。

## 2. 深入解析 (Deep Dive)

### 2.1 失效歸因：留一法 vs Shapley
- **留一法 (Leave-One-Out)**：逐一將某時間步雜訊歸零，重新模擬，看哪一步的雜訊是罪魁禍首。
  - 限制：若雜訊具有相關性（多步同向），單一歸零不足以扭轉失效。
- **Shapley 值**：考慮所有特徵子集，計算特徵 i 在各子集組合中的邊際貢獻的平均值。
  - 適用場景：特徵較少（< 20）的線性迴歸模型或中小型策略。

### 2.2 梯度法的 Softmax 飽和問題
- 分類模型的最後一層通常是 Softmax，當模型非常確定某個類別時，logit 遠大於其他類別，梯度趨近於零。
- 整合梯度透過從「無資訊基準」（全黑圖像）逐步積分，能穿越有效梯度區域，避免飽和。

### 2.3 Grad-CAM 的空間映射
- 在 CNN 架構中，後期特徵圖解析度較低（如 16x16），Grad-CAM 在此計算梯度後，透過上採樣映射回原始圖像解析度。

### 2.4 機制性可解釋性的三步驟
1. **節點提取 (Node Extraction)**：用稀疏自編碼器從 LLM 激活中找出語意方向字典。
2. **圖結構學習 (Graph Learning)**：利用節點字典，訓練大規模貝氏網路（數千節點 x 數百萬樣本）。
3. **因果對齊 (Causal Alignment)**：確認建構的圖具有真正的因果方向（而非純關聯），可支援干預實驗。

### 2.5 干預實驗 (Intervention)
- 找到「種族 (ethnicity)」方向後，在推論時對該方向進行干預（歸零或覆寫），觀察輸出是否改變，以驗證模型是否確實使用該概念做決策。
- Anthropic 的「Golden Gate Bridge」實驗：強制激活 Golden Gate Bridge 方向，模型回答「我是金門橋」。

## 3. 可解釋性二維分類框架 (2D Taxonomy)

|  | 關聯性 (Correlational) | 機制性 (Mechanistic) |
|---|---|---|
| 模型層面 (Model) | 顯著圖、Shapley 值、Grad-CAM | 稀疏自編碼器、電路追蹤 |
| 真實世界 (World) | 貝氏網路 | 微分方程（Navier-Stokes 等）、因果圖 |

## 4. 關鍵圖表與視覺化 (Key Diagrams)

- **Cart Pole 策略熱圖**：X 軸為角度，Y 軸為角速度，顏色表示策略輸出方向。死區可見於非訓練分佈區域。
- **TaxiNet 案例**：飛機地面滑行的神經網路控制器，以 Grad-CAM 定位模型關注的跑道區域。
- **稀疏自編碼器架構**：輸入嵌入 → 線性編碼器 → ReLU（帶 L1 懲罰）→ 線性解碼器 → 重建損失。
- **電路追蹤圖**：展示 LLM 回答「德克薩斯州含達拉斯的州的首府是？」→「奧斯汀」的推理路徑。

## 5. 待釐清與外部連結 (Open Questions & References)

- **健全性挑戰**：部分可解釋性方法（如 Guided Grad-CAM）在完全隨機化模型權重後仍產生類似解釋，需謹慎驗證。
- **尺度問題**：如何將電路追蹤擴展到極大型模型（數百億參數）仍是開放問題。
- **與形式化驗證的連結**：如何將機制性可解釋性與可達性分析結合，是未來研究方向。
- **推薦課程**：CS 221M（機制性可解釋性）by Thomas Icard，Stanford 春季學期。
- **Andrej Karpathy 建議**：直接審視最壞表現樣本是最實用的初步分析手段。
- **相關文獻**：Anthropic 的 SAE 論文、Judea Pearl 的因果圖研究、MIT Technology Review 2026 突破技術（機制性可解釋性）。

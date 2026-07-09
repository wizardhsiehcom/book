# MIT 14.12 章節模板

## 基本資料

- 章節編號：24
- 章節標題：Cheap Talk
- 對應逐字稿（`data/mit14-12/clean/`）：24 - Lecture 24： Cheap Talk.txt
- 完整閱讀日期：2026-07-09
- 閱讀者：AI Agent
- 狀態：已成章

## 逐字稿完整閱讀紀錄

閱讀範圍確認（逐字稿為單行含標點純文字）：

- 檔案大小（bytes）：58908
- 是否從頭到尾完整閱讀：是
- 跳過段落：無。
- 是否回查 `raw/*.vtt`：否（逐字稿無明顯錯誤需回查）。

## 本講主問題

本講探討當參與者之間存在利益衝突，且訊息傳遞本身是無成本（costless）時，是否還能進行可信的溝通。透過 Crawford 與 Sobel (1982) 的廉價對話（Cheap Talk）模型，分析傳送者（Sender）與接收者（Receiver）在不同偏誤（bias）程度下，如何達成部分揭露資訊的分區均衡（partitional equilibria）。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| Cheap Talk (廉價對話) | 傳送訊息本身沒有直接成本，不直接影響報酬（payoff-irrelevant），與訊號傳遞（signaling）中需付出成本不同。 | 核心定義，作為本章開頭對比 signaling 的切入點。 |
| Crawford-Sobel Model | Sender 知道狀態 T，Receiver 採取行動 Y。Sender 偏好 Y = T + beta，Receiver 偏好 Y = T。分析雙方的溝通可能性。 | 詳細展開模型設定與偏好。 |
| Babbling Equilibrium (喋喋不休均衡 / 無溝通均衡) | Sender 傳送與狀態無關的無意義訊息，Receiver 維持事前信念（prior）不理會訊息，這總是一個均衡。 | 作為極端狀況的基準點。 |
| Partitional Equilibrium (分區均衡) | Sender 將狀態空間 [0,1] 劃分為 K 個區間，僅透露狀態落在哪個區間。 | 詳細介紹 K=2 的推導，再推廣到 K 區間的結論。 |
| Bias and Information (偏誤與資訊量) | 偏誤 beta 越小，能支持的區間數量 K 越大，能傳遞越精確的資訊。當 beta >= 1/4 時，只存在無溝通均衡。 | 整理公式與定理條件，搭配圖表說明偏誤範圍。 |
| Pareto Dominance of Most Informative Equilibrium | 給定偏誤 beta，存在多個分區均衡，其中具備最多區間（最高 K）的均衡對 Sender 和 Receiver 都是事前最有利的。 | 放在結論處說明福利分析的直覺。 |

## 重要細節

- 定義（解概念／賽局元素／經濟量）：Sender Type $T \sim U[0,1]$。Sender Message $M \in \mathcal{M}$。Receiver Action $Y \in \mathbb{R}$。
- 定理敘述與證明思路：
  - Sender 效用：$U_S = -(Y - (T + \beta))^2$
  - Receiver 效用：$U_R = -(Y - T)^2$
  - 證明完全溝通不可能：若 $M = T$，Receiver 會選擇 $Y = M$。但 Sender 看到狀態 $T$ 時會想要傳送 $M = T + \beta$ 來誘使 Receiver 選擇 $Y = T + \beta$，故存在偏離誘因。
  - 推導 K=2 區間：設閾值 $T_1$。傳送 L 表示 $T < T_1$，H 表示 $T > T_1$。Receiver 回應為區間中點。Sender 在 $T_1$ 必須對 L 和 H 無異，即 $T_1 + \beta$ 必須是 $Y_L$ 與 $Y_H$ 的中點。解出 $T_1 = 1/2 - 2\beta$。
- 賽局實例（矩陣、賽局樹、payoff 設定；標明「依口語重建」或 `待補`）：無具體數字賽局矩陣，主要為連續狀態空間的動態賽局。
- 課堂 MobLab 遊戲：規則、結果、講者詮釋：無。
- 經濟應用場景：顧問與決策者（總統與稅制、聯準會與利率、CEO與顧問）。大家都同意狀態往某方向時決策應跟著動，但在具體水準上有系統性分歧。
- 講者例子或直覺說明：鷹派與鴿派面對經濟狀況：大家都同意經濟差要降息，但鷹派永遠覺得利率該比鴿派高一點。
- 問答重點：為何無偏誤時訊息無成本卻能溝通？為何脫離路徑（off-path）信念在 cheap talk 中不如 signaling 重要（因為無成本，可以將所有 off-path 訊息視為某個 on-path 訊息，不會像 signaling 那樣有成本差異而產生偏離誘因）。
- 容易忽略的提醒：區間長度不是相等的。越右邊的區間越大，這是為了抵銷 Sender 想要誇大狀態的誘因。

## 解概念與均衡分析

若本講有具體解概念或均衡分析（如 dominance、rationalizability、Nash、SPNE、BNE、PBE），記錄：

- 解概念名稱：Perfect Bayesian Equilibrium (PBE)
- 形式化定義：Receiver 對收到的訊息利用貝氏定理更新對狀態的信念，並做出最適選擇；Sender 預期 Receiver 的反應後，給定真實狀態做出最適訊息選擇；脫離路徑的信念不受限，但可透過指定與某個均衡路徑訊息相同來阻止偏離。
- 求解程序或演算法：分區法。假設 K 個閾值，找出 Receiver 的最佳反應（各區間中點），然後利用 Sender 在閾值處的無異條件（indifference condition）建立相鄰區間長度的遞迴關係。
- 適用範圍與限制（本講講者實際說明者）：只適用於偏誤 beta 夠小的情況。
- 在解概念精煉鏈上的位置與前後關聯：建構在 PBE 之上，相較於前一講的 signaling games，cheap talk 這裡 off-path belief 的限制較少且較容易處理。

## 書稿章節草稿

已建立至 `docs/mit14-12-game-theory/24-cheap-talk.md`。

## 跨章連結

- 前置章節：Lecture 23 Signaling Games（對比 costly signaling 與 costless cheap talk）。
- 後續章節：無（最後第二講）。
- 需要回頭補充的術語或符號：無。
- 需要新增的圖表：K=2 的效用曲線與閾值圖，以及區間長度遞增的示意圖。

## 相關材料

- Slides / 板書：（待補，`data/mit14-12/` 只有逐字稿與字幕）
- Syllabus / reading：Crawford and Sobel (1982)
- 習題：（待補）

## 外部補充

> 外部搜尋僅在第 6 階段（全部逐字稿初稿完成後）進行。初稿階段本節留白。

| 來源 | URL | 存取日期 | 補充內容摘要 |
|---|---|---|---|
| 待補 | 待補 | 待補 | 待補 |

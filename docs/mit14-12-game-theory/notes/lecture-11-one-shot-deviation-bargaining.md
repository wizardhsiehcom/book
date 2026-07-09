# MIT 14.12 章節模板

每章都應從完整閱讀逐字稿後再填寫。本模板可複製到每一講的閱讀筆記或書稿初稿中。

## 基本資料

- 章節編號：11
- 章節標題：One-Shot Deviation Principle and Bargaining
- 對應逐字稿（`data/mit14-12/clean/`）：`11 - Lecture 11： One-Shot Deviation Principle and Bargaining.txt`
- 完整閱讀日期：2026-07-09
- 閱讀者：Agent
- 狀態：已成章

## 逐字稿完整閱讀紀錄

閱讀範圍確認（逐字稿為單行含標點純文字）：

- 檔案大小（bytes）：67049
- 是否從頭到尾完整閱讀：是
- 跳過段落：無。
- 是否回查 `raw/*.vtt`：否

## 本講主問題

本講旨在回答如何分析潛在無限期的多階段賽局（Multi-stage games），並引入單次偏離原則（One-Shot Deviation Principle, OSDP）作為檢驗子賽局完美納許均衡（SPNE）的核心工具。應用此工具，本講分析了無限期輪流提案的議價賽局（Infinite Horizon Alternating Offer Bargaining），探討在沒有人為設定的「最後一期」時，雙方如何因時間成本而達成協議。

## 核心概念

| 概念 | 說明 | 書稿處理方式 |
|---|---|---|
| 多階段賽局 (Multi-stage games) | 賽局分為多個階段，每階段可能有一部分玩家同時行動，且每階段開始前所有玩家都能觀察到過去的歷史。可為有限或無限期。 | 獨立小節定義 |
| 單次偏離原則 (One-Shot Deviation Principle) | 檢驗 SPNE 的定理：若在連續（continuous）的多階段賽局中，沒有任何玩家在任何單一歷史節點有單次偏離的誘因，則該策略組合即為 SPNE。 | 作為定理介紹，說明其直覺與檢驗步驟 |
| 無限期輪流提案議價 (Alternating offer bargaining) | 雙方輪流提出效用分配方案，拒絕則進入下一期換對方提案，延遲達成協議會有折現損失。 | 詳細推導，包含均衡策略與首動者優勢 |
| 單次偏離 (One-shot deviation) | 只在單一歷史節點偏離原定策略，之後仍遵循原定策略的偏離行為。 | 定義於 OSDP 之前 |
| 折現因子 (Discount factor, $\delta$) | 衡量耐心程度。$\delta \to 1$ 表示極有耐心，$\delta \to 0$ 表示極度不耐。影響議價能力。 | 參數說明與極端情況分析 |

## 重要細節

- 定義（解概念／賽局元素／經濟量）：多階段賽局中，歷史 (History) 決定了子賽局的起點，每段歷史對應一個子賽局。
- 定理敘述與證明思路：OSDP 指出不需要檢驗複雜的「多步偏離」，只要單步偏離不划算，那麼複雜偏離也不會划算。這依賴於賽局的連續性（Continuous，遙遠未來的決策對當前 payoffs 影響趨近於零，如透過折現）。
- 賽局實例（矩陣、賽局樹、payoff 設定；標明「依口語重建」或 `待補`）：Cournot entry game（口語提及作為多階段賽局的例子）、Boston Game（口語提及，用以說明上節課檢查 SPNE 時其實也隱含了 OSDP 的概念）。
- 課堂 MobLab 遊戲：無。
- 經濟應用場景：買賣雙方議價、國際談判。協議空間 $X$ 投影為雙方效用對，不協議點 (Disagreement point) 設為 $(0,0)$。
- 講者例子或直覺說明：透過極度沒耐心 ($\delta \to 0$) 和極度有耐心 ($\delta \to 1$) 說明首動者優勢的變化。
- 問答重點：學生提問如果一直達不成協議會如何？講者解釋可以看作每期獲得 0 的 flow utility，或者在無限遠的未來極限趨近於不協議點。
- 容易忽略的提醒：即使是循序賽局，只要歷史被完全觀察且當期只有一人行動，也可視為多階段賽局的一種特例（如議價賽局）。

## 解概念與均衡分析

- 解概念名稱：Subgame Perfect Nash Equilibrium (SPNE)
- 形式化定義：所有歷史子賽局的策略限制均構成該子賽局的 Nash Equilibrium。
- 求解程序或演算法：利用 OSDP，只需針對「提案者」與「回應者」分別檢查給定均衡策略下，是否有 profitable one-shot deviation。這避免了去枚舉那些無窮無盡的歷史路徑。
- 適用範圍與限制（本講講者實際說明者）：多階段賽局，且需要 Continuous 假設（例如 payoffs 為各期折現加總）。
- 在解概念精煉鏈上的位置與前後關聯：幫助在無限期或極大狀態空間賽局中確認 SPNE。

## 書稿章節草稿

(已寫入同目錄下的 11-one-shot-deviation-bargaining.md 檔案中)

## 跨章連結

- 前置章節：Cournot 賽局、子賽局完美納許均衡 (SPNE)（第 10 講）。
- 後續章節：重複賽局 (Repeated games)。
- 需要回頭補充的術語或符號：Boston Game。
- 需要新增的圖表：可行效用集合 (Feasible set X) 搭配不協議點 (Disagreement point) 與 Pareto frontier 的幾何圖形（待補）。

## 相關材料

- Slides / 板書：（待補，`data/mit14-12/` 只有逐字稿與字幕）
- Syllabus / reading：（待補）
- 習題：（待補）

## 外部補充

> 外部搜尋僅在第 6 階段（全部逐字稿初稿完成後）進行。初稿階段本節留白。

| 來源 | URL | 存取日期 | 補充內容摘要 |
|---|---|---|---|
| 待補 | 待補 | 待補 | 待補 |

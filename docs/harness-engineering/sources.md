# 來源與使用方式

本書以一篇指定版本的論文為主要來源。產品描述只代表研究快照；運費案例、練習與實驗是本書新增的教學材料。

## 主要來源

Paul Barbaste、Tristan Darrigol、Germain Vu、Tom Wiltberger，*Harness Engineering: Anatomy, Architecture, and Evolution of Coding Agents — A Source-Code Study of Eleven Systems*，arXiv:2609.00006v1，分類 cs.SE。作者與題名見[論文 HTML](https://arxiv.org/html/2609.00006v1)；論文入口見[arXiv 紀錄](https://arxiv.org/abs/2609.00006)。頁面標示 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 授權。

本書依這篇論文整理系統架構、作者觀察和設計建議。系統名稱、版本與特色可查[系統卡](system-cards.md)，逐項章節去向可查[論文對照索引](paper-map.md)。引用連結使用 HTML v1 的章節或表格錨點，便於核對原文。

## 本書如何改寫來源

本書以繁體中文重組和改寫論文說明，將論文的觀察、模式與建議連到不同教學章節。各章的運費案例、練習、流程圖和實驗步驟是本書新增的教學材料，不是論文實驗，也不代表作者結論。表格與系統卡以摘要方式整理，請回到論文原文查看完整條件。

論文頁面標示 CC BY 4.0。本書保留作者、題名、版本和來源連結，並標明新增的教學內容。重新使用或改編論文內容時，請依[授權條款](https://creativecommons.org/licenses/by/4.0/)標示出處、改動和授權。

## 證據範圍

論文是特定版本的原始碼研究，研究對象為 11 個系統，另把 Omnigent 當作上層協調系統的對照。研究並非本書作者重新稽核各專案，也不是使用同一模型、任務和設定進行的效能排名。作者指出，程式碼量與定性評分都受語言、統計方式和判斷影響；論文也刻意不提供行號，因為程式碼會持續變動。詳細限制見[§15.6](https://arxiv.org/html/2609.00006v1#S15.SS6)。

表 3 的版本是研究快照。Claude Code 使用 2026 年 3 月原始碼；表 4 和其他 2026 年 7 月表格所列的 Claude Code 二進位版本為 2.1.206，作者沒有核實兩者完全相同。OpenClaw 是多通道個人助理閘道，不是程式開發代理；作者將它納入樣本比較通用代理平台特徵，並建議程式開發執行系統的採用數字也看排除 OpenClaw 後的 10 個系統。Omnigent 不實作自己的編輯迴圈，因此只作上層對照，不算第 12 個同類樣本。詳見[§4.1 與表 3](https://arxiv.org/html/2609.00006v1#S4.SS1)。

## 日期記錄

論文標題頁將版本標成 2026 年 7 月，HTML 內的 arXiv 標頭寫作 `arXiv:2609.00006v1 [cs.SE] 15 Jul 2026`。識別碼中的 `2609` 與標頭日期看起來不一致；本書保留兩種原始記錄，不推測原因。來源資料於 2026-10-07 取得；檔案與雜湊記錄見 `data/harness-engineering/README.md`。

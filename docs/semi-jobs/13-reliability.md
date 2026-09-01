# 可靠度工程師

可靠度工程師用測試、失效物理與統計模型，評估產品在指定任務剖面（mission profile）下的失效風險。這不是保證「十年後一定正常」，而是把使用條件、加速應力、失效機制與統計信賴度連起來。

## 四個常見工作層次

| 層次 | 關注問題 | 常見合作對象 |
|---|---|---|
| Technology reliability | 電晶體、介電層與互連能否達到節點目標 | Device、PIE、製程、FA |
| Product reliability | 特定 IC 在操作條件下是否通過 qualification | IC Design、Product、Test、QA |
| Package reliability | bump、RDL、基板、材料與封裝結構是否可靠 | Package、材料、熱機模擬、FA |
| System／board reliability | 板級、冷卻、電源與 workload 是否造成額外風險 | 系統、韌體、資料中心／車用團隊 |

## 從任務剖面到結論

```mermaid
flowchart LR
    USE["使用條件與任務剖面"] --> MODE["辨識可能失效機制"]
    MODE --> PLAN["選擇應力與測試計畫"]
    PLAN --> TEST["加速測試與量測"]
    TEST --> MODEL["物理／統計模型"]
    MODEL --> RISK["壽命或失效率估計<br/>含信賴區間"]
    RISK --> IMPROVE["設計／製程／封裝改善"]
```

常見測試包括 HTOL、HAST／uHAST、temperature cycling、ELFR、ESD 與 latch-up，但不是每個產品全部照同一條件執行。測試條件應由產品、封裝、使用環境、客戶規範與預期失效機制決定。

## 失效物理與模型

| 區域 | 常見機制 | 常用思考方式 |
|---|---|---|
| 元件／閘極 | BTI、HCI、TDDB | 電場、溫度、時間與劣化量 |
| 互連 | electromigration、stress migration | 電流密度、溫度、材料與幾何 |
| 封裝 | 焊點疲勞、分層、翹曲、界面裂縫 | CTE 不匹配、熱循環、應力與材料 |
| 系統 | 熱點、供電變動、冷卻失效 | workload、功耗 map、散熱與保護策略 |

Weibull 是常見統計工具，但不是所有外推的唯一答案。依機制還可能使用 Arrhenius、Eyring、Black 或 Coffin–Manson 類模型；模型成立的前提比套公式更重要。

## 2026 年的新難題：2.5D／3D 與 HBM

AI 封裝把多顆邏輯晶粒、HBM、interposer／RDL、基板與冷卻系統疊在一起。可靠度已不能只測一顆封裝後元件：熱點位置、材料界面、功耗管理、工作負載與冷卻方案會互相影響，需要 package–system–technology co-optimization。

## 適合誰與工作型態

適合喜歡用物理機制解釋資料、對「測到了什麼」和「能外推到哪裡」很敏感的人。工作通常結合實驗室、資料分析與跨部門評審；量產或客訴支援可能需要緊急應變，但是否輪班依團隊而異。

## 核心技能

- 半導體元件、材料、封裝與熱機械基礎
- 實驗設計、分佈、censoring、信賴區間與加速模型
- JEDEC／AEC 規範閱讀與 qualification plan 撰寫
- 測試板、chamber、參數量測與資料品質管理
- 與 FA 一起建立可驗證的 failure mechanism

## 職涯與面試準備

可往 technology／product／package reliability 深化，也可轉 Quality、FA、Product Engineering 或 reliability program lead。面試常問加速測試如何對應使用條件、如何判斷不同 failure mode、樣本失效後下一步做什麼，以及為何不能只用單一 Weibull 線外推。

薪資比較見[薪資資料怎麼看](appendix-salary.md)；不同可靠度層次與產業的樣本不可直接混用。

## 資料來源

- [AEC：AEC-Q100 與附屬文件](https://www.aecouncil.com/AECDocuments.html)（查證：2026-08-31）
- [imec：3D HBM-on-GPU 熱瓶頸與 system-technology co-optimization](https://www.imec-int.com/en/press/imec-mitigates-thermal-bottleneck-3d-hbm-gpu-architectures-using-system-technology-co)（2025-12-08；查證：2026-08-31）

相關：[QA／品質工程師](12-qa.md)｜[失效分析工程師](14-failure-analysis.md)｜[封裝工程師](15-packaging.md)

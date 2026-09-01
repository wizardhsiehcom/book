# FAE 與設備商客戶支援職務

FAE（Field Application Engineer）常被泛稱為「技術與客戶的橋樑」，但半導體產品 FAE、設備 application engineer 與 field service engineer 的工作並不相同。求職時先看 ownership、支援對象與交付物，不要只看職稱。

## 三類角色

| 角色 | 支援對象 | 主要工作 | 常見現場 |
|---|---|---|---|
| 產品／系統 FAE | OEM、ODM、系統客戶 | bring-up、integration、validation、debug、spec/requirement、issue closure | 客戶實驗室、系統與開發板 |
| 設備 Application／Process Engineer | Fab 的 PE/PIE、製程開發 | process qualification、recipe/application、performance demo、技術升級 | 無塵室、process lab、客戶會議 |
| Field Service／Customer Support Engineer | Fab 的 EE、設備 owner | install、PM、repair、upgrade、diagnostics、uptime | 無塵室與設備現場 |

同一設備商可能讓 application 與 service 一起處理 escalation，但 application 通常對製程結果與應用能力更深，service 通常對 hardware availability、維修程序與 installed base 更深。

## 產品／系統 FAE

- 支援 customer platform bring-up、HW/FW/SDK integration 與 system validation。
- 重現問題，收集 log/register/telemetry/measurement，先做 root-cause isolation。
- 使用示波器、邏輯分析儀、protocol analyzer 等工具驗證介面與 margin。
- 把可重現步驟與證據交給 design/firmware/validation 團隊並追到 closure。
- 整理 application note、reference design、debug procedure、FAQ 與客戶 training。
- 在售前 evaluation 與售後量產間傳遞需求，但不等於業務。

## 設備 Application 與 Field Service

Application／Process Engineer 會參與新機或新 capability 的 process qualification、tool matching、recipe window 與客戶技術評估；Field Service／Customer Support 則負責 install、maintenance、repair、upgrade、parts 與 downtime recovery。

AI 已用於 predictive maintenance、reactive diagnostics、知識搜尋與 RCA 輔助，但複雜工具仍需工程師用物理與現場證據驗證輸出。客戶資料、recipe、log 與 export-control information 也有嚴格邊界。

## 適合誰／工作型態

適合技術基礎紮實、能在客戶壓力下保持結構化溝通，也願意對「問題是否真的關閉」負責的人。產品 FAE 的背景隨 SoC、RF、connectivity、power、automotive 或 software 而變；設備 application/service 則偏製程、材料、光機電、真空、電漿與設備診斷。

工作通常需要出差、客戶現場、跨時區會議或 on-call。產品 FAE 的節奏跟 customer milestone；設備 service 跟 tool uptime；application 跟 install/qualification 與技術導入。三者不能用同一套生活型態概括。

## 核心技能

- 對應產品、協定、製程或設備平台的實質深度。
- structured debug：reproduce、isolate、collect evidence、escalate、verify fix。
- 客戶溝通、英文文件、簡報、issue tracker 與 expectation management。
- 實驗室或無塵室工具操作，以及安全、保密與變更程序。
- 能分清 workaround、root cause、corrective action 與正式 release。

## 職涯與轉換

產品 FAE 可往 system/application architect、customer engineering、product management、technical marketing 或 business development；設備 application 可往 process/product specialist、technology program；field service 可往 technical support、install/upgrade、equipment management。跨線可行，但須補相應的製程、系統或硬體深度。

## 面試準備

準備一個客戶 issue 案例，說明如何取得可重現條件、縮小 HW/FW/SW 或 process/equipment 邊界、管理 escalation，並在資訊不完整時回報進度。避免只說「把問題丟回 RD」；FAE 的價值正是讓內外部團隊拿到可行動的證據。

薪資請見[薪資比較附錄](appendix-salary.md)。

## 資料來源

- [MediaTek System/Application Engineer](https://careers.mediatek.com/en/jobs/MUS120260408000)，2026（customer bring-up、validation、HW/FW/SDK debug 與 issue closure；查證：2026-09-01）
- [MediaTek Firmware FAE](https://careers.mediatek.com/en/jobs/MTK120260108004)，2026（客戶產品開發、現場協作與功能問題排查；查證：2026-09-01）
- [ASML 2025 Annual Report — Strategy & Stories](https://www.asml.com/en/investors/annual-report/2025/strategy-and-stories)，2026（installed-base diagnostics、predictive maintenance 與 human validation；查證：2026-08-31）
- [Advantest V93000 Product Support](https://www.advantest.com/cn/products/semiconductor-test-system/soc/v93000/v93000ps/)，現行產品頁（technical documentation、training、maintenance 與 customer support；查證：2026-08-31）

相關：[設備工程師](10-equipment.md)｜[測試工程師](16-test.md)

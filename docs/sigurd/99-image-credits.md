# 附錄 D　圖表來源

本書保留原有 Mermaid 流程圖，另補成本圖、介面示意與實物圖片；各圖用途與出處分列如下。

| 圖 | 位置 | 用途 | 限制 |
|---|---|---|---|
| 測試插入點與漏檢流向 | [01](01-test-in-the-flow.md) | 表示四個插入點的順序與攔截關係 | 不是任何公司的實際產線配置 |
| 測試成本的組成 | [02](02-test-cost-model.md) | 表示成本項目如何匯集到每顆成本 | 概念關係圖，不含實際金額 |
| 測試單元的訊號路徑 | [03](03-test-cell.md) | 表示訊號從測試機到晶片經過的實體介面 | 不對應特定設備商的架構 |
| 訊號路徑的頻寬串聯 | [04](04-high-speed-rf-test.md) | 表示整條路徑的有效頻寬由最窄段決定 | 教學示意，不含實際頻寬數值 |
| 浴缸曲線三階段 | [05](05-burn-in-and-screening.md) | 表示失效率隨時間的三個階段 | 形狀為概念示意，非實測曲線 |
| EIC 與 PIC 的量測資源分工 | [06](06-silicon-photonics-test.md) | 表示光電共測需要兩套資源 | 不對應特定產品的模組架構 |
| 全書概念依賴 | [00](00-map.md) | 表示章節先後依賴 | — |

07、08 兩章以可追溯的表格呈現證據，未另製裝飾圖片——證據的可核對性比視覺效果重要。

## 圖 02-1　測試成本情境對照 <span id="img-02-1"></span>

- 使用頁面：[02 測試成本](02-test-cost-model.md)。檔案：[test-cost-scenarios.png](images/test-cost-scenarios.png)。
- 製作者：本書編製過程由 Codex 以 Matplotlib 繪製，未使用第三方圖檔。
- 資料：直接重算本章 A–D 教學假設；每小時成本 NT$2,500、index 0.5 秒，成本為 2,500 ÷ UPH。
- 限制：不是矽格實績或報價；橫軸從零開始，20% 使用未四捨五入數值計算。
- 修改：首次製作；未另指定授權。重製程式保留於書籍工作計畫目錄，不隨網站出版。

## 圖 06-1　電接觸與光耦合 <span id="img-06-1"></span>

- 使用頁面：[06 光電共測](06-silicon-photonics-test.md)。檔案：[optical-electrical-contact.svg](images/optical-electrical-contact.svg)。
- 製作者：本書編製過程由 Codex 原創 SVG；未轉載或描摹第三方圖檔。
- 概念依據：Keysight，[Silicon Photonics: Tricks and Tweaks for Wafer and Chip-Level Optical Test](https://www.keysight.com/blogs/en/inds/2018/11/27/silicon-photonics-tricks-and-tweaks-for-wafer-and-chip-level-optical-test)，2018-11-27，表面光柵／邊緣耦合的文字說明；查閱日 2026-09-14。
- 限制：右側只畫表面光柵耦合；非按比例，角度與容差不代表產品規格，不對應矽格設備。
- 修改：首次製作；未另指定授權。


## 圖 03-1　CIS probe card <span id="img-03-1"></span>

- 使用頁面：[03 測試單元](03-test-cell.md)。本地圖片：[cis-probe-card.jpg](images/cis-probe-card.jpg)。
- 圖片名稱：CIS probe card.jpg。作者：Jasycheng；原始頁標示 Own work。
- 原始檔案頁：[Wikimedia Commons — CIS probe card](https://commons.wikimedia.org/wiki/File:CIS_probe_card.jpg)。
- 原圖：[下載網址](https://upload.wikimedia.org/wikipedia/commons/2/29/CIS_probe_card.jpg)，4,128 × 2,322 px。
- 授權：[Creative Commons 姓名標示－相同方式分享 4.0 國際（CC BY-SA 4.0）](https://creativecommons.org/licenses/by-sa/4.0/)。
- 修改：**本站版本已等比例縮小為 1,600 × 900 px 並重新壓縮**，以降低頁面載入量；未裁切、未調色、未加註記。原圖可由上列網址取得。查閱日：2026-09-14。
- 用途與限制：辨識探針卡的接觸區外觀，不代表矽格設備、產線或作者背書。

## 圖 03-2　M4050-Clamshell Socket <span id="img-03-2"></span>

- 使用頁面：[03 測試單元](03-test-cell.md)。本地圖片：[clamshell-test-socket.png](images/clamshell-test-socket.png)。
- 圖片名稱：M4050-Clamshell Socket.png。作者：DPJessie；原始頁標示 Own work。
- 原始檔案頁：[Wikimedia Commons — M4050-Clamshell Socket](https://commons.wikimedia.org/wiki/File:M4050-Clamshell_Socket.png)。
- 原圖：[下載網址](https://upload.wikimedia.org/wikipedia/commons/a/ac/M4050-Clamshell_Socket.png)，501 × 501 px。
- 授權：[Creative Commons 姓名標示－相同方式分享 4.0 國際（CC BY-SA 4.0）](https://creativecommons.org/licenses/by-sa/4.0/)。
- 修改：無；完整保存原圖，僅以網頁樣式縮放顯示。查閱日：2026-09-14。
- 用途與限制：辨識夾殼式模組測試 socket；原始頁的壽命測試用途不代表所有 FT 都採此型號，也不代表矽格設備或作者背書。

# 圖表來源與閱讀方式

本書保留原創 Mermaid 教學圖與表格，另以 Wikimedia Commons 照片補充實物觀察，並加入原創 SVG 剖面圖。外部照片不是昇陽現場或產品的證據。非比例圖不能用於讀尺寸；流程圖中的功能順序也不等於公司實際配方。

| ID | 使用頁面／插入位置 | 來源方式與閱讀重點 |
|---|---|---|
| 00-1 | [全書地圖](00-map.md)，章節導覽 | 原創閱讀依賴圖，不是產線流程 |
| 01-1 | [01](01-wafer-roles.md)，用途分類後 | 依 T1 整理用途與加工歷史；非所有組合皆可行 |
| 02-1 | [02](02-reclaim-loop.md)，操作段 | 依 SVM、Pure Wafer 與一般製程控制整理；有拒收、重工出口 |
| 03-1 | [03](03-quality-and-qualification.md)，風險與量測矩陣 | 依 T3 整理；方法不能當公司全批測試清單 |
| 04-1 | [04](04-reuse-economics.md)，厚度帳本 | 原創教學假設：100 μm 預算、24 μm／輪 |
| 04-2 | [04](04-reuse-economics.md)，事件流程 | 原創條件機率模型；費用在嘗試時產生 |
| 05-1 | [05](05-demand-and-new-test-wafers.md)，晶圓池 | 原創存量／流量示意；省略在途與待驗 |
| 05-2 | [05](05-demand-and-new-test-wafers.md)，需求因子 | 原創需求轉換模型；不代表已知公司係數 |
| 06-1 | [06](06-thinning-services.md)，工件結構 | 依 T4 與工件責任整理的非比例功能剖面 |
| 06-2 | [06](06-thinning-services.md)，操作段 | 一般薄化接口示意；不是固定必經配方 |
| 07-1 | [07](07-advanced-materials.md)，功能位置 | 原創示意；不是昇陽產品或某封裝平台剖面 |
| 08-1 | [08](08-capacity-and-cashflow.md)，擴產階段 | 原創擴產到收現邏輯圖；不含時程預測 |
| 08-2 | [08](08-capacity-and-cashflow.md)，月度敏感度 | 原創算例，基準 4,896 片／月已核算 |
| 09-1 | [09](09-psi-evidence-map.md)，服務證據矩陣 | 依公司來源分欄編寫；未知不以猜測補足 |
| 10-1 | [10](10-reading-news.md)，證據階梯 | 原創判讀框架；不暗示所有產品都已走到末階 |
| 11-1 | [11 案例一](11-disposition-cases.md#case-1)，履歷不明 | 原創合成案例決策圖；非昇陽收料 SOP |
| 11-2 | [11 案例二](11-disposition-cases.md#case-2)，加工後不合格 | 原創合成案例決策圖；重工需可恢復依據及授權 |
| 11-3 | [11 案例三](11-disposition-cases.md#case-3)，客戶退回 | 原創合成案例決策圖；非真實客訴或責任判定 |

2026-09-16 增修更新 00-1 的閱讀依賴、02-1 的重工條件，新增 11-1 至 11-3；各章新增處置表為原創教學整理，未重製外部圖像。新圖表不新增第三方圖片授權，既有照片與 SVG 來源保持原紀錄。

技術與公司來源連結見[來源索引](appendix-sources.md)。既有流程圖與表格為原創整理；本次補入照片及 SVG 的來源、授權與修改情況分列如下。圖表版本、正文 SHA-256 與實際渲染驗收結果保留於儲存庫 `plan/psi/`；它們是編輯紀錄，不是讀者理解正文的先備。

## 補充圖片與剖面圖

外部照片透過 Wikimedia 的圖片網址載入，點選原始檔案頁可查看原圖與授權；照片未用來推定公司設備、製程參數或客戶認證。

### photo-03：Silicon wafer with mirror finish.jpg { #photo-03 }

- 使用位置：[03 章](03-quality-and-qualification.md#photo-03)。
- 作者／來源方式：NASA Glenn Research Center。
- 原始檔案頁或原理來源：[Silicon wafer with mirror finish.jpg](https://commons.wikimedia.org/wiki/File:Silicon_wafer_with_mirror_finish.jpg)。
- 授權／圖像來源：[Public domain（美國，PD-USGov-NASA）](https://commons.wikimedia.org/wiki/Template:PD-USGov-NASA)。
- 修改情況：使用 Commons 現行版本（原站已裁去原圖說）；本書未再裁切或改色。

### svg-03：厚度差與整片彎曲 { #svg-03 }

- 使用位置：[03 章](03-quality-and-qualification.md#svg-03)。
- 作者／來源方式：本書編寫者。
- 原始檔案頁或原理來源：[厚度差與整片彎曲](https://www.kobelcokaken.co.jp/leo/en/item/sbw/)。
- 授權／圖像來源：原創教學 SVG，未重製來源圖像。
- 修改情況：依量測概念自行繪製。

### svg-06：一般薄化與 TAIKO 剖面比較 { #svg-06 }

- 使用位置：[06 章](06-thinning-services.md#svg-06)。
- 作者／來源方式：本書編寫者。
- 原始檔案頁或原理來源：[一般薄化與 TAIKO 剖面比較](https://www.disco.co.jp/eg/solution/library/grinder/taiko_process.html)。
- 授權／圖像來源：原創教學 SVG，未重製來源圖像。
- 修改情況：依文字所述幾何原理自行繪製。

### photo-01：Wafer with multiple Microprocessor dies on it.jpg { #photo-01 }

- 使用位置：[01 章](01-wafer-roles.md#photo-01)。
- 作者／來源方式：Dualmodem Bytton。
- 原始檔案頁或原理來源：[Wafer with multiple Microprocessor dies on it.jpg](https://commons.wikimedia.org/wiki/File:Wafer_with_multiple_Microprocessor_dies_on_it.jpg)。
- 授權／圖像來源：[CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)。
- 修改情況：使用 Commons 1280 px 縮圖；未裁切或改色。

### photo-02：Front opening shipping box (bottom side).jpg { #photo-02 }

- 使用位置：[02 章](02-reclaim-loop.md#photo-02)。
- 作者／來源方式：Cepheiden。
- 原始檔案頁或原理來源：[Front opening shipping box (bottom side).jpg](https://commons.wikimedia.org/wiki/File:Front_opening_shipping_box_(bottom_side).jpg)。
- 授權／圖像來源：[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)。
- 修改情況：使用 Commons 縮圖；未裁切或改色。

### photo-02-bench：WetEtchBench.jpg { #photo-02-bench }

- 使用位置：[02 章](02-reclaim-loop.md#photo-02-bench)。
- 作者／來源方式：Kristian Mølhave。
- 原始檔案頁或原理來源：[WetEtchBench.jpg](https://commons.wikimedia.org/wiki/File:WetEtchBench.jpg)。
- 授權／圖像來源：[CC BY 2.5](https://creativecommons.org/licenses/by/2.5/)。
- 修改情況：使用 Commons 縮圖；未裁切或改色。

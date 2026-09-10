# 圖表來源與使用說明

本書以自行繪製的教學示意、Mermaid 與表格為主，另以四張 Wikimedia Commons 開放授權／公有領域圖片補充實物及介面直覺。不重新發布公司投影片或專利原圖；外部圖片不是均華設計圖、設備照片或客戶實績，也不表示圖中的流程已由均華某機型採用。

## 外部圖片：遠端載入與逐圖出處

以下圖片直接由 Wikimedia 的 `upload.wikimedia.org` 圖片網址載入，不另存到本書；圖說附原始 File 頁與授權連結。採用固定檔名的 HTTPS 連結，沒有短效簽章或搜尋結果網址；但第三方服務仍可能限流、移動或更新檔案，不能保證永久可用。離線或圖片載入失敗時，可讀替代文字、圖說與原有自繪圖；追查版本及授權請開啟 File 頁的歷史紀錄。

查閱日期：**2026-09-10**。四圖均未裁切、翻譯圖內文字或加註；僅以網頁樣式等比例縮放，外加繁中圖說與白底留邊。圖 4-2 使用 Wikimedia 由原 SVG 產生的 960 px PNG 縮圖，圖 5-2 使用 960 px JPEG 縮圖，避開本次原圖端點載入失敗並減少傳輸量；其餘使用原始圖片端點。

| 圖片／使用位置 | 原始檔案頁與作者 | 授權 | 閱讀範圍與限制 |
|---|---|---|---|
| 圖 1-2／[第 1 章](01-die-handling.md)：藍色切割膠膜上的晶圓 | [A semiconductor wafer on a dicing (blue) tape…](https://commons.wikimedia.org/wiki/File:A_semiconductor_wafer_on_a_dicing_(blue)_tape._Few_chips_(dies)_from_the_wafer_have_already_been_picked_up_(removed)_for_further_manufacturing.png)；Khpsoi，自作 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | 晶粒格網與取料後空位；不推定薄度、膠膜規格或機構 |
| 圖 4-2／[第 4 章](04-alignment-error-budget.md)：準確度與精密度 | [Accuracy and Precision.svg](https://commons.wikimedia.org/wiki/File:Accuracy_and_Precision.svg)；Arbeck，自作 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | 定性比較散布與偏移；不是驗收數據或良率模型 |
| 圖 5-2／[第 5 章](05-bonder-process-boundaries.md)：功率電晶體內部 | [2N3055 - close up pic of wires bonding to the silicon package.jpg](https://commons.wikimedia.org/wiki/File:2N3055_-_close_up_pic_of_wires_bonding_to_the_silicon_package.jpg)；Mister rf，自作 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | 晶粒固定與打線的區別；不推定固定材料或先進封裝能力 |
| 圖 5-3／[第 5 章](05-bonder-process-boundaries.md)：覆晶安放 | [Flip chip mount 2.svg](https://commons.wikimedia.org/wiki/File:Flip_chip_mount_2.svg)；Twisp，自作 | [公有領域，作者釋出（PD-self）](https://commons.wikimedia.org/wiki/Template:PD-self) | 凸塊位於晶粒與接收面之間；不按比例，不代表混合鍵合 |

CC BY 圖片重用時需保留署名、授權連結並標示修改；CC BY-SA 圖片如另作改作，還須遵守相同方式分享條件。各圖權利依其原授權處理，不因收錄於本書而改變；公有領域圖仍保留作者及來源以便追溯。

## 本書自繪與整理的圖表

| 圖表 | 使用位置 | 來源方式與閱讀範圍 |
|---|---|---|
| 圖 0-1 六段推理鏈 | 導讀 | 本書自建分析框架 |
| 圖 M-1 依賴關係 | 全書地圖 | 依本書章節依賴自行編排 |
| 圖 1-1 支撐轉換 | 01，`images/die-pickup.svg` | 本書原創 SVG；力學教學示意，不按比例、不給實測力 |
| 圖 2-1 資料／實體流 | 02 | 本書提出的資料契約模型，不宣稱標準相容或均華架構 |
| 圖 3-1 交接時序 | 03 | 本書自建時序；P1 作機構閱讀背景，不重製其圖 |
| 圖 4-1 量測鏈與誤差表 | 04 | 本書自建；T1、T2 提供計量框架；數值為教學設定 |
| 圖 5-1 責任鏈與製程矩陣 | 05 | 本書跨製程整理，非特定產線或操作配方 |
| 表 6-1 時間表及 OEE 表 | 06 | 本書自建數字；T4 提供 OEE 定義 |
| 圖 7-1、產品證據矩陣 | 07 | 依 G1–G11、F1、F2、P1 自行摘要編排 |
| 三組案例與分析卡 | 08 | 作者依原始頁面及 PDF 逐段判讀，不重製原圖 |

出處代號與 URL 見[來源索引](appendix-sources.md)。原始文件著作權屬各權利人；本書的摘要、計算與自繪圖不改變原文件權利。

流程圖均有圖說或鄰接表格；不支援 Mermaid 的閱讀器仍可從正文理解。SVG 的標題與替代文字描述相對關係，不能拿圖上的長度或箭頭估設備尺寸與受力。

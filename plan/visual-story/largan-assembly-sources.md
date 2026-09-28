# 大立光 06 視覺解說：來源與假設

## 查證事實

| 用途 | 來源 | 備註 |
|---|---|---|
| 幾何離焦：焦深 t = 2Nc（小放大率） | [Wikipedia, Depth of focus](https://en.wikipedia.org/wiki/Depth_of_focus)，2026-09-28 查閱 | 單側離焦 Δz 對應 c = Δz/N；物在無窮遠、小離焦近似 |
| 三種誤差與徵狀對照 | 章節圖表 06-2；[Edmund Optics 製造公差說明](https://www.edmundoptics.com/knowledge-center/application-notes/optics/tips-for-designing-manufacturable-lenses-and-assemblies/) | 「對稱／非對稱」是章節標明的教學經驗法則 |
| 依組裝順序耦合 | [Ansys Optics 傾斜偏心公差](https://optics.ansys.com/hc/en-us/articles/43071118693139-How-to-tolerance-for-tilts-and-decenters-of-a-double-pass-system) | 只取建模原則 |
| 選擇性組裝提高組出率 | Levin & Kachurin, J. Opt. Technol. 88(4), 178 (2021) | 不外推效益數字 |
| 成本算例四列與第 2 題 | 章節 Python 重算 | 模型檢查再算一次 |
| 大立光研發費用、產品清單 | 章節引用 114 年報第 57–58 頁 | 故事只轉述章節已查的內容 |

## 教學假設（故事內都要標）

- 開場「零件合格率 ≥ 95%、成品掉一成」：章節的想像情境，非公司數據。
- f/2.0、像高 ±3 mm、像素 1 µm、規格「模糊圈 ≤ 2 µm」：自設，只為讓數字可讀。
- 像側焦點偏移直接當輸入；元件誤差到像面的敏感度未建模。
- 配對例：兩片位各 6 片，誤差以「對像側焦點的貢獻（µm）」表示、線性相加、敏感度相同；單片規格 |e| ≤ 6，系統規格 |a+b| ≤ 6。數字自設。
- 成本參數：章節教學假設（N 10,000、y₁ 0.94、y₂ 0.90、85／30／12 元、F 400,000）。

## 不宣稱

- 不畫模糊照片、不給 MTF 數值。
- 不估大立光良率、成本、配對策略或主動對準範圍；不指名客戶品牌。

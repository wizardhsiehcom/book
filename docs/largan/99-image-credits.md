# 圖表來源與閱讀限制

本書的流程圖、算例表與證據矩陣由本書作者依各章來源自行整理。圖中的箭頭表示教學上的關係或步驟，未經公司文件確認者，不代表大立光的實際產線、合約或供應關係。

## 原創圖表清單

| 所在章節 | 視覺內容 | 依據與限制 |
|---|---|---|
| [全書地圖](00-map.md) | 概念依賴圖 | 本書章節安排；不是加工順序 |
| [01](01-camera-value-chain.md) | 相機價值鏈與責任表 | C0–C3、A1；零件與角色示意不代表特定手機拆解 |
| [02](02-optical-tradeoffs.md) | 光學變數關係與取捨 | T1；尺寸與算例為教學假設 |
| [03](03-image-quality.md) | 成像鏈、MTF 與量測條件表 | T1–T2；教學曲線不是大立光的量測報告 |
| [04](04-lens-design-materials.md) | 鏡頭設計要素與材料比較 | T1、T3；表面、材料與片數是不同設計軸 |
| [05](05-molding-process.md) | 成形流程、缺陷與量測矩陣 | T3；公開通用工程整理，不是公司私有流程 |
| [06](06-assembly-yield-cost.md) | 公差示意、組裝與良率流量、成本情境 | T2–T3；數字均為本書自建假設，不是公司良率與成本 |
| [07](07-telephoto-actuation.md) | 折疊光路、致動責任與失效表 | T4；機制示意不指向某一實際出貨設計 |
| [08](08-qualification-competition.md) | 採用階段與競爭比較 | A1、P1、R1；階段之間需要新證據，不代表必然推進 |
| [09](09-business-economics.md) | 需求與報表因子、成本敏感度 | A1、F1；公司實際揭露與教學情境分開標示 |
| [10](10-new-applications.md) | 能力遷移與驗收缺口 | C2、G1–G2、T5；能力相似不等於新用途已驗證 |
| [11](11-largan-evidence-map.md) | 產品、主體與階段矩陣 | 公司來源索引；未揭露的欄位不能由其他列補推 |
| [12](12-reading-news.md) | 消息拆解與證據追蹤 | C2–C3；閱讀順序不表示消息屬於同一商業專案 |

## 使用與來源方式

另有兩張原創 SVG：[組裝公差示意](images/assembly-tolerances.svg)，放於第 06 章；[直立與折疊光路](images/folded-path.svg)，放於第 07 章。前者分開偏心、傾斜與間距，後者說明光路轉向與機身空間的關係。兩圖依 T1、T3、T4 的通用概念重畫，未描摹公司型錄或專利附圖；圖內尺寸及形狀不代表實際產品。

正文引用的外部文件用來支持文字與教學關係，未直接翻印公司型錄、財報截圖或論文圖片。本書沒有將公司商標或商品照片作為技術證據。原創圖表的來源代號可在[來源索引](appendix-sources.md)找到；公開內容不足的部分列在[待查問題](appendix-open-questions.md)。

光路與公差剖面均為**非特定公司產品、非按比例**的示意。若實際工程判斷依賴曲率、角度、厚度或光線位置，應以帶測試條件的設計與量測資料為準。

圖表應與其所在段落一起閱讀。寬表、寬流程圖與 SVG 在窄螢幕可左右捲動，保留文字可讀尺寸；流程圖只保留解釋該章問題需要的節點。Mermaid 圖由瀏覽器載入函式庫後渲染，首次閱讀需能連線取得該函式庫。

## Wikimedia 圖片與動畫

以下來源於 2026-09-15 查閱。圖片與動畫直接引用 Wikimedia 線上網址，不下載、不轉檔、不保存本地副本。GIF 載入後依原檔自動播放；點擊圖片可開啟線上原檔。閱讀時需連線。本書中文說明另行撰寫。

| 章節 | 作品／來源 | 作者 | 授權 | 線上連結與引用方式 |
|---|---|---|---|---|
| 02 | [Lens_and_wavefronts.gif](https://commons.wikimedia.org/wiki/File:Lens_and_wavefronts.gif) | Oleg Alexandrov | [公有領域](https://commons.wikimedia.org/wiki/File:Lens_and_wavefronts.gif) | [線上 GIF](https://upload.wikimedia.org/wikipedia/commons/c/c7/Lens_and_wavefronts.gif)；直接引用，未修改 |
| 02 | [Aperture-Lens.gif](https://commons.wikimedia.org/wiki/File:Aperture-Lens.gif) | GRPH3B18 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [線上 GIF](https://upload.wikimedia.org/wikipedia/commons/0/03/Aperture-Lens.gif)；直接引用，未修改 |
| 03 | [Focal_plane.gif](https://commons.wikimedia.org/wiki/File:Focal_plane.gif) | Fffred | [公有領域](https://commons.wikimedia.org/wiki/File:Focal_plane.gif) | [線上 GIF](https://upload.wikimedia.org/wikipedia/commons/0/02/Focal_plane.gif)；直接引用，未修改 |
| 07 | [Zoom_prinzip.gif](https://commons.wikimedia.org/wiki/File:Zoom_prinzip.gif) | Rainer Knäpper（Smial） | [Free Art License](https://artlibre.org/licence/lal/en/) | [線上 GIF](https://upload.wikimedia.org/wikipedia/commons/e/e3/Zoom_prinzip.gif)；直接引用，未修改 |
| 04 | [Lens-sphericalaberration.png](https://commons.wikimedia.org/wiki/File:Lens-sphericalaberration.png) | DrBob | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [PNG](https://upload.wikimedia.org/wikipedia/commons/6/6e/Lens-sphericalaberration.png)；未修改 |

光圈動畫是傳統相機鏡頭示範；其餘光學圖均是通用概念示意。以上作品均不是大立光產線、產品剖面或公司實測證據。圖說中的讀圖限制應隨圖片一併保留。

# 大立光書籍技術複核（02–07）

複核日：2026-09-15。範圍為六個章節及兩張教學 SVG；未改附錄及其他章。

## 主要修正

- 02：限定視角公式為無限遠、近似直線投影；澄清 TTL 與模組高度、有效焦距及光程的差別；刪除尚未核對的 TTL 小於 10 mm 定量敘述及過度概括的次微米感測器性能敘述。中焦例實際約 1.9 倍，修正表格名稱。補固定輸出尺寸、量子效率與 CRA 配對的條件。
- 03：修正 MTF 定義及歸一化，取消「各關都是獨立低通」「必定單調」「邊角一定差」「S/T 分離即像散大小」。300 cy/mm 之外沒有資料，刪除直接外推為零與瓶頸定論。補正色差與縮光圈的機制，艾里斑跨像素不等於更多取樣無用。將流程圖改為縱向。
- 04：8P 明確為八片塑膠；修正偶次非球面公式的頂點曲率慣例；增補玻璃精密模造，取消玻璃只能逐片加工、非球面可行性低的錯誤；材料色差抵消須配合正負光焦度。將流程圖改為縱向。
- 05：抽檢能偵測平均值偏移；低離散度不獨指模仁。成形設定及量測基準也可形成系統偏移。將雙折射與翹曲取捨限定為具體製程窗，取消永遠無法共同改善的定理式說法。修正中頻誤差必不改 PSF 主瓣、中心厚減邊厚等於楔形量、隨機獨立必抵消等敘述。
- 06：最重要的更正是條件機率：P(A且B)=P(A)P(B｜A) 不需要兩站獨立。區分 RTY 與未篩選單片邊際良率乘冪。模組 AA 不得算回前段鏡頭廠良率。毛利率下降不等於每套毛利金額下降。成本算例維持原值。
- 07：修正入瞳不能直接等於背面開口／厚度、焦距不唯一決定光程、稜鏡姿態影響不等同鏡片傾斜。移除欠缺逐產品依據的 SMA 線徑、壓電模組尺寸、OIS 正負一度等量化敘述，取消感測器必較輕。致動性能會影響動態像質，並非無關。

## 一手來源再核對

新增複核保留實際 2026-09-15 日期，不倒填前一日。下列均為廠商官方技術說明或 ISO 官方目錄，網頁未標發布日者不推定日期。

- [Edmund Optics：The Modulation Transfer Function](https://www.edmundoptics.com/knowledge-center/application-notes/imaging/modulation-transfer-function-mtf-and-mtf-curves/)：MTF 的頻率、場點、S/T 與裝配不對稱。
- [Edmund Optics：Airy Disk](https://www.edmundoptics.com/knowledge-center/application-notes/imaging/limitations-on-resolution-and-contrast-the-airy-disk/)：艾里斑直徑定義及公式。
- [Edmund Optics：Chromatic and Monochromatic Optical Aberrations](https://www.edmundoptics.com/knowledge-center/application-notes/optics/chromatic-and-monochromatic-optical-aberrations/)：色差與單色像差的區別。
- [Edmund Optics：All About Aspheric Lenses](https://www.edmundoptics.com/knowledge-center/application-notes/optics/all-about-aspheric-lenses/)：精密玻璃模造。
- [Minitab：Throughput yield / Rolled throughput yield](https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/six-sigma/supporting-topics/what-are-throughput-yield-ytp-and-rolled-throughput-yield-yrt/)：逐站乘積用語；條件機率澄清為本書數學推導。
- [ISO 10110-5:2026](https://www.iso.org/standard/86355.html)：2026 版及表面形狀公差適用主題；未宣稱已讀付費標準全文。

## 重算結果

使用 Python 標準庫重算，無新增相依。

| 算例 | 重算結果 | 結果 |
|---|---|---|
| 02 四個對角視角 | 110.98、84.33、51.06、20.25 度 | 與四捨五入表一致 |
| 02 四個等效焦距 | 14.87、23.89、45.29、121.15 mm | 一致 |
| 03 MTF50 線性內插 | 中心 166.67、邊緣 S 113.16、T 87.04 cy/mm | 一致 |
| 03 艾里斑 0.55 μm，F/1.6、2.2、2.8 | 2.1472、2.9524、3.7576 μm | 一致 |
| 06 基準 | 8,460 套；1,662,800 元；196.55 元／套 | 一致 |
| 06 情境 A | 8,730 套；1,666,400 元；190.88 元／套 | 一致 |
| 06 情境 B | 7,708 套；1,662,800 元；215.72 元／套 | 一致 |
| 06 情境 C | 8,460 套；1,812,800 元；214.28 元／套 | 一致 |
| 06 推理題 y₂=0.93 | 8,742 套；190.21 元／套 | 一致 |

跨章 09 使用的第 06 章成本數字未改。上述數字全是教學假設，非大立光實際數據。

## 圖清單與驗證

- `docs/largan/images/assembly-tolerances.svg`：替代 06 ASCII 圖，四列共用基準軸，分辨橫移、轉角及軸向間距。具 title、desc，圖內寫明非特定公司產品、非按比例。
- `docs/largan/images/folded-path.svg`：替代 07 Mermaid 概念圖，明示光線向下後轉向右方，表達厚度與平面佔用的交換；不呈現真實光學處方。
- 兩 SVG 已以 Python XML parser 驗證。完整桌機／手機渲染由主流程整合檢查。

## 留存限制

原研究素材仍有僅摘要可讀、ResearchGate 鏡錄與未取得全文的工程文獻；沒有把它們升級為完整原文複核。此輪優先修正明確錯誤、刪除不必要的產品定量概括，並保留公司內部公差、量測、材料牌號與良率的待查邊界。

整合補正：07 大陽科技英文名改為 Largan Digital；依主流程已核對年報第 49 頁同步 2025-12-31 直接持股 49.37%、綜合投資 55.35% 的口徑，待查改為控制判斷及產品收入。

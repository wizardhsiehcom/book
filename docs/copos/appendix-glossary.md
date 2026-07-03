# 術語表

全書名詞的中英對照與一句話定義，供隨查隨用。依主題分組，組內大致由基礎到進階排列。第一次在正文遇到某個名詞時，會附上英文原文；本表則把它們集中起來，方便回頭速查。

!!! note "怎麼用這張表"
    每一列給的是「夠用就好」的一句話定義，重在建立直覺；需要展開理解時，請點該列末尾的相關章節連結。

## 封裝核心架構

| 名詞 | 英文 | 一句話定義 |
|------|------|-----------|
| CoPoS | Chip-on-Panel-on-Substrate | 台積電的面板級封裝架構，用矩形面板取代圓形晶圓作為封裝載體，可用面積放大五倍以上（見 [05](05-copos-overview.md)）。 |
| CoWoS | Chip-on-Wafer-on-Substrate | 台積電現役主流的 2.5D 封裝，以矽中介板承載晶片與 HBM，受圓形晶圓幾何與尺寸極限限制（見 [03](03-cowos-recap.md)）。 |
| SoW-X | System-on-Wafer-X | 走「整片晶圓當一個封裝」的 wafer-scale 路線，追求逼近一整台伺服器的算力（見 [11](11-copos-vs-alternatives.md)）。 |
| FOPLP | Fan-Out Panel-Level Packaging | 扇出型面板級封裝，在矩形面板上做扇出重佈線，是 CoPoS 的技術血脈之一（見 [04](04-fan-out-and-foplp.md)）。 |
| InFO | Integrated Fan-Out | 台積電的整合扇出封裝技術，扇出型封裝的代表性實作。 |
| fan-in／fan-out | fan-in / fan-out | 扇入指 I/O 限縮在晶片面積內，扇出指把 I/O 重佈到晶片以外的更大面積上。 |

## 載體與基板

| 名詞 | 英文 | 一句話定義 |
|------|------|-----------|
| 面板 | panel | CoPoS 使用的矩形封裝載體，標準尺寸 310 × 310 mm，後續世代傳出 750 × 620 mm（見 [06](06-panel-geometry.md)）。 |
| 晶圓 | wafer | 圓形的半導體基材，CoWoS 以其作為封裝載體，也是「圓改方」要取代的對象。 |
| 載體 | carrier | 封裝製程中承載晶片與重佈線的基材，可以是晶圓或面板。 |
| 基板 | substrate | 封裝最下層的承載與對外連接結構，可為有機、矽或玻璃材質。 |
| 中介板 | interposer | 位於晶片與基板之間的中介層，提供高密度互連，常見為矽中介板。 |
| 矽中介板 | silicon interposer | 以矽製成的中介板，可做最細線寬 RDL，互連密度最高但面積受 reticle 限制。 |
| 有機基板 | organic substrate | 以有機樹脂材料製成的基板，成本低但剛性與尺寸穩定性不如玻璃，大面板易翹曲。 |
| 玻璃基板 | glass substrate / glass core | 以玻璃為核心的基板，剛性高、平坦、尺寸穩定，有助解決大面板翹曲並降低成本（見 [07](07-glass-substrate.md)）。 |
| 玻璃中介板 | glass interposer | 用玻璃取代部分矽中介板角色的中介層，搭配 TGV 做垂直互連（見 [12](12-future-outlook.md)）。 |

## 互連與結構元件

| 名詞 | 英文 | 一句話定義 |
|------|------|-----------|
| 晶片／裸晶 | die | 從晶圓切割下來、尚未封裝的單顆半導體晶粒。 |
| chiplet | chiplet | 把大晶片拆成的多顆小晶片，各自最佳化製程後再於封裝內整合。 |
| RDL | Redistribution Layer（重佈線層） | 在晶片或載體上重新佈線、把 I/O 扇出到更大面積的金屬層，線寬微縮是面板級良率關鍵（見 [02](02-packaging-basics.md)）。 |
| bump | bump | 晶片對外連接的凸塊接點。 |
| micro-bump | micro-bump | 更細間距的微凸塊，用於晶片與中介板之間的高密度連接。 |
| TSV | Through-Silicon Via（矽穿孔） | 貫穿矽材的垂直導孔，用於 3D 堆疊與中介板的上下互連。 |
| TGV | Through-Glass Via（玻璃穿孔） | 貫穿玻璃基板的垂直導孔，功能類比 TSV，是玻璃基板的關鍵製程（見 [07](07-glass-substrate.md)）。 |
| molding | molding | 用封裝膠體包覆晶片以保護與固定的製程步驟。 |
| hybrid bonding | hybrid bonding（混合鍵合） | 以銅對銅直接鍵合取代 micro-bump，把互連間距推向次微米級的高密度技術（見 [12](12-future-outlook.md)）。 |
| SoIC | System on Integrated Chips | 台積電的晶片堆疊整合技術，可做前段等級的 die 對 die 鍵合。 |

## 記憶體與封裝分類

| 名詞 | 英文 | 一句話定義 |
|------|------|-----------|
| HBM | High Bandwidth Memory（高頻寬記憶體） | 垂直堆疊的高頻寬記憶體，需緊貼運算晶片以縮短資料路徑，是先進封裝面積需求的主要來源。 |
| 記憶體牆 | memory wall | 運算速度成長快於記憶體頻寬，導致資料供給成為效能瓶頸的現象（見 [01](01-why-advanced-packaging.md)）。 |
| 2.5D 封裝 | 2.5D packaging | 多顆晶片並排於同一中介板上、透過中介板橫向高密度互連的封裝形態。 |
| 3D 封裝 | 3D packaging | 晶片垂直堆疊、以 TSV 等做上下互連的封裝形態。 |
| CPO | Co-Packaged Optics（共封裝光學） | 把光引擎搬進封裝內、緊貼運算晶片以突破晶片間傳輸瓶頸的技術（見 [12](12-future-outlook.md)）。 |

## 限制、現象與製程指標

| 名詞 | 英文 | 一句話定義 |
|------|------|-----------|
| 摩爾定律 | Moore's Law | 積體電路上電晶體密度約每兩年翻倍的經驗法則，近年成長放緩，促使封裝成為效能槓桿。 |
| 光罩極限 | reticle limit | 單次微影曝光可涵蓋的最大晶片面積上限（約 858 mm²），是 chiplet 拆分與封裝放大的根本驅動力（見 [01](01-why-advanced-packaging.md)）。 |
| 翹曲 | warpage | 大面板在製程熱應力下發生的彎曲變形，是面板級封裝量產的最大挑戰之一（見 [08](08-panel-process-challenges.md)）。 |
| 熱膨脹係數 | CTE（Coefficient of Thermal Expansion） | 材料受熱膨脹的比率，不同材料 CTE 失配會加劇翹曲與可靠度問題。 |
| 材料利用率 | utilization | 載體上可用於有效封裝的面積比例，圓形晶圓不到 70%，矩形面板可達 90% 以上（見 [06](06-panel-geometry.md)）。 |
| 良率學習曲線 | yield learning curve | 新製程隨經驗累積、良率逐步爬升的過程，是 CoPoS 量產時程的最大變數（見 [08](08-panel-process-challenges.md)）。 |

## 產業與時程用語

| 名詞 | 英文 | 一句話定義 |
|------|------|-----------|
| OSAT | Outsourced Semiconductor Assembly and Test | 專業封裝測試代工廠（如日月光、力成），在供應鏈中承接封測環節（見 [10](10-supply-chain-competition.md)）。 |
| 試產 | pilot production | 量產前的小規模試製階段，用來驗證製程與良率；CoPoS 規劃 2027 年試產。 |
| 量產 | mass production | 大規模穩定生產階段；CoPoS 規劃 2028 下半年起量產（見 [09](09-tsmc-roadmap.md)）。 |
| 試產線 | pilot line | 專供試產與製程驗證的產線，CoPoS 試產線已於 2026 年年中完成。 |

## 相關頁面

- 名詞背後的完整脈絡，見[全書計畫地圖](00-plan.md)
- 想追每個數字的原始出處：[學習資源](appendix-references.md)

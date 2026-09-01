# 術語表

全書名詞的中英對照與一句話定義，供隨查隨用。依主題分組，組內大致由基礎到進階排列。第一次在正文遇到某個名詞時，會附上英文原文；本表則把它們集中起來，方便回頭速查。

!!! note "怎麼用這張表"
    每一列給的是「夠用就好」的一句話定義，重在建立直覺；需要展開理解時，請點該列末尾的相關章節連結。

## 封裝核心架構

| 名詞 | 英文 | 一句話定義 |
|------|------|-----------|
| CoPoS | Chip-on-Panel-on-Substrate | 台積電的面板級封裝架構，用矩形面板取代圓形晶圓作為封裝載體。**定位是 CoWoS 的補充而非取代**（見 [05](05-copos-overview.md)）。 |
| CoWoS | Chip-on-Wafer-on-Substrate | 台積電現役主流的 2.5D 封裝，以矽中介板承載晶片與 HBM，受圓形晶圓幾何與尺寸極限限制（見 [03](03-cowos-recap.md)）。 |
| SoW-X | System-on-Wafer-X | 走「整片晶圓當一個封裝」的 wafer-scale 路線，追求逼近一整台伺服器的算力（見 [11](11-copos-vs-alternatives.md)）。 |
| FOPLP | Fan-Out Panel-Level Packaging | 扇出型面板級封裝，在矩形面板上做扇出重佈線，是 CoPoS 的技術血脈之一（見 [04](04-fan-out-and-foplp.md)）。 |
| InFO | Integrated Fan-Out | 台積電的整合扇出封裝技術，扇出型封裝的代表性實作。 |
| fan-in／fan-out | fan-in / fan-out | 扇入指 I/O 限縮在晶片面積內，扇出指把 I/O 重佈到晶片以外的更大面積上。 |

## 載體與基板

| 名詞 | 英文 | 一句話定義 |
|------|------|-----------|
| 面板 | panel | CoPoS 使用的矩形封裝載體，第一代標準尺寸 310 × 310 mm。注意 600×600、650×650、700×700 等格式是**其他業者**的選擇，不是台積電的路線圖（見 [06](06-panel-geometry.md)）。 |
| 晶圓 | wafer | 圓形的半導體基材，CoWoS 以其作為封裝載體，也是「圓改方」要取代的對象。 |
| 載體 | carrier | 封裝製程中承載晶片與重佈線的基材，可以是晶圓或面板。 |
| 基板 | substrate | 封裝最下層的承載與對外連接結構，可為有機、矽或玻璃材質。 |
| 中介板 | interposer | 位於晶片與基板之間的中介層，提供高密度互連，常見為矽中介板。 |
| 矽中介板 | silicon interposer | 以矽製成的中介板，可做最細線寬 RDL，互連密度最高但面積受 reticle 限制。 |
| 有機基板 | organic substrate | 以有機樹脂材料製成的基板，成本低但剛性與尺寸穩定性不如玻璃，大面板易翹曲。 |
| 玻璃基板 | glass substrate / glass core | 以玻璃為核心的基板，剛性高、平坦、CTE 可調、介電損耗低。**但導熱係數僅約 1 W/m·K，是真弱點**；且第一代 CoPoS 可能不使用玻璃（見 [07](07-glass-substrate.md)）。 |
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
| 材料利用率 | utilization | 載體上可用於有效封裝的面積比例。**大封裝**下圓形晶圓不到 70%、矩形面板理論可達 90% 以上；小封裝則差距不大（見 [06](06-panel-geometry.md)）。 |
| 良率學習曲線 | yield learning curve | 新製程隨經驗累積、良率逐步爬升的過程，是 CoPoS 量產時程的最大變數（見 [08](08-panel-process-challenges.md)）。 |

## 產業與時程用語

| 名詞 | 英文 | 一句話定義 |
|------|------|-----------|
| OSAT | Outsourced Semiconductor Assembly and Test | 專業封裝測試代工廠（如日月光、力成），在供應鏈中承接封測環節（見 [10](10-supply-chain-competition.md)）。 |
| 試產 | pilot production | 量產前的小規模試製階段，用來驗證製程與良率；CoPoS 規劃 2027 年試產。 |
| 量產 | mass production | 大規模穩定生產階段；CoPoS 的量產時程各家說法為 2028 下半年至 2030，**台積電官方僅說「還要幾年」**（見 [09](09-tsmc-roadmap.md)）。 |
| 試產線 | pilot line | 專供試產與製程驗證的產線，CoPoS 試產線已於 2026 年年中完成。 |

## 面板級製程流程與良率

| 名詞 | 英文 | 一句話定義 |
|------|------|-----------|
| chip-first | chip-first | 先把晶片放上載體、封膠固定成重構面板，再做 RDL；流程短成本低，但會遇到 die shift（見 [13](13-process-flow.md)）。 |
| chip-last／RDL-first | chip-last / RDL-first | 先做好並檢測 RDL，再把晶片接合上去；成本較高但可先剔除壞的 RDL，是高價封裝的目標路線（見 [13](13-process-flow.md)）。 |
| 晶片偏移 | die shift | 晶片在封膠與熱循環中偏離設計位置的現象，面板愈大位移量愈大，是面板級封裝的核心工程問題（見 [13](13-process-flow.md)）。 |
| 自適應圖案化 | Adaptive Patterning | Deca Technologies 的技術：光學量測晶片實際位置後，即時生成該片面板專屬的微影圖案來補償 die shift（見 [13](13-process-flow.md)）。 |
| 重構面板 | reconstituted panel | chip-first 流程中，把多顆晶片重新排列並封膠固定後形成的人造面板。 |
| 直接成像 | LDI / direct imaging | 無光罩的數位微影，每片圖案可不同，是 Adaptive Patterning 的必要條件（見 [13](13-process-flow.md)）。 |
| 步進曝光機 | stepper | 用實體光罩逐格曝光的微影設備，解析度高但需要拼接、且無法做客製化圖案。 |
| 曝光場拼接 | field stitching | 把多次曝光的區域接起來以覆蓋整片面板，接縫對位精度是關鍵挑戰（見 [08](08-panel-process-challenges.md)）。 |
| 疊對 | overlay | 層與層之間的對位精度；面板翹曲會讓全域疊對難以在大面積上維持。 |
| 線寬／線距 | line/space（L/S） | RDL 的線路寬度與間距規格；消費性約 10/10 μm，最先進 HPC 需 2/2 μm（見 [13](13-process-flow.md)）。 |
| 電鍍均勻性 | plating uniformity | 大面積矩形面板上鍍層厚度的一致性；因反應槽為圓形晶圓設計，是業界尚未解決的難題（見 [13](13-process-flow.md)）。 |
| 組裝設計套件 | ADK（Assembly Design Kit） | 封裝界的 PDK，提供設計與製程之間的標準化規則；業界討論十五年仍未成形（見 [13](13-process-flow.md)）。 |
| 缺陷密度 | defect density（D₀） | 單位面積的缺陷數量；面積放大時良率隨之指數下降，是面板級良率的核心參數。 |
| 斜邊 | bevel | 面板邊緣的隆起或污染區，會影響微影與接合並產生額外應力（見 [14](14-equipment-ecosystem.md)）。 |
| LIDE | Laser-Induced Deep Etching | 雷射誘導深蝕刻，TGV 成孔的主流商業技術（見 [07](07-glass-substrate.md)）。 |

## 相關頁面

- 全書結構與閱讀地圖：[全書地圖](00-map.md)
- 想追原始出處：[學習資源](appendix-references.md)
- 想追每個數字的原始出處：[學習資源](appendix-references.md)

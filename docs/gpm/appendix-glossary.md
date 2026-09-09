# 附錄 B：術語表

中英對照，附首次完整定義的位置。**術語首次在正文出現時都會附英文與物理解釋**；這一頁只做查閱用。

---

## 一、結構與分類

| 術語 | 英文 | 一句話定義 | 首次定義 |
|---|---|---|---|
| 晶粒／裸晶 | die | 從晶圓切下來、尚未封裝的單顆晶片 | [03](03-materials-interconnect.md) |
| 多晶片模組 | MCM, Multi-Chip Module | 多顆 die 並排在同一片載板上，走載板線路互連 | [02](02-packaging-taxonomy.md) |
| 2.5D | — | 多顆 die 並排在一層中介物上，中介物再放到載板 | [02](02-packaging-taxonomy.md) |
| 3D | — | 多顆 die 垂直堆疊，走穿過晶粒本體的垂直通道 | [02](02-packaging-taxonomy.md) |
| 2.3D | — | **非統一定義**。泛指比 2D 密、但未用矽中介層與 TSV 的方案 | [02](02-packaging-taxonomy.md) |
| 小晶片 | chiplet | 把大晶片拆成多個功能區塊分別製造，再封裝整合 | [01](01-why-advanced-packaging.md) |
| 異質整合 | heterogeneous integration | 把不同製程節點、不同材料的晶粒整合在同一封裝內 | [01](01-why-advanced-packaging.md) |

## 二、互連與材料

| 術語 | 英文 | 一句話定義 | 首次定義 |
|---|---|---|---|
| 接墊 | pad | 晶粒表面用來接出訊號的金屬區域 | [03](03-materials-interconnect.md) |
| 凸塊 | bump | 焊接在 pad 上、把訊號往下接出的金屬突起 | [03](03-materials-interconnect.md) |
| 微凸塊 | microbump | 間距遠小於一般凸塊的凸塊，用於 die 到中介層 | [03](03-materials-interconnect.md) |
| 重佈線層 | RDL, Redistribution Layer | 在晶粒或封膠表面長出的金屬佈線層，把接點重新分佈 | [03](03-materials-interconnect.md) |
| 矽穿孔 | TSV, Through-Silicon Via | 穿過矽本體的垂直導電通道 | [03](03-materials-interconnect.md) |
| 中介層 | interposer | 介於晶粒與載板之間、提供高密度走線的載體 | [02](02-packaging-taxonomy.md) |
| 載板 | substrate | 封裝體下方的有機基板，把訊號接到 PCB | [03](03-materials-interconnect.md) |
| 載具 | carrier | 製程中**暫時**支撐工件的板材，多半循環使用 | [04](04-workpiece-flow.md) |
| 底部填膠 | underfill | 填入晶粒與下方載體之間、緩解應力與保護接點的膠 | [03](03-materials-interconnect.md) |
| 封裝膠體 | molding compound | 包覆晶粒的封裝材料，提供機械保護 | [03](03-materials-interconnect.md) |
| 局部矽互連 | LSI, Local Silicon Interconnect | 只在需要高密度互連處嵌入的小塊矽 | [07](07-cowos-r-l-icube.md) |

## 三、製程平台與商標

| 術語 | 公司／性質 | 一句話定義 | 首次定義 |
|---|---|---|---|
| Fan-Out | 製程平台 | 晶粒重組後封膠，直接在封膠面上做 RDL 往外扇出互連 | [02](02-packaging-taxonomy.md)、[05](05-fan-out.md) |
| FOPLP | 製程平台 | 面板級（而非晶圓級）的 Fan-Out 封裝 | [05](05-fan-out.md) |
| chip-first／chip-last | 流程分支 | 先放晶粒再做 RDL，或先做 RDL 再放晶粒 | [05](05-fan-out.md) |
| 晶粒偏移 | die shift | 重組與封膠過程中晶粒位置偏離設計值 | [05](05-fan-out.md) |
| CoWoS | TSMC 商標 | Chip-on-Wafer-on-Substrate，**一個家族而非單一技術** | [02](02-packaging-taxonomy.md) |
| CoW / WoS | 製程段 | CoWoS 的兩段：晶粒接到中介層晶圓、再接到載板 | [06](06-cowos-s.md) |
| CoWoS-S / R / L | TSMC 商標 | 矽中介層／RDL 中介層（無 TSV）／局部矽橋接加 RDL | [02](02-packaging-taxonomy.md)、[06](06-cowos-s.md)、[07](07-cowos-r-l-icube.md) |
| InFO | TSMC 商標 | TSMC 的 Fan-Out 平台 | [02](02-packaging-taxonomy.md) |
| SoIC | TSMC 商標 | 用混合鍵合做的 3D 晶粒堆疊 | [02](02-packaging-taxonomy.md)、[09](09-soic-hybrid-bonding.md) |
| I-Cube | Samsung 商標 | Samsung 的 2.5D 矽中介層平台，**各版本須按來源分列** | [07](07-cowos-r-l-icube.md) |
| EMIB | Intel 商標 | 把小塊矽橋接嵌入載板的 2.5D 方案 | [10](10-emib-bridge.md) |
| EMIB-T | Intel 商標 | 橋接片內加 TSV，可縱向供電。與 EMIB **不是**同一版本 | [10](10-emib-bridge.md) |
| Foveros | Intel 商標 | Intel 的 3D 堆疊平台 | [02](02-packaging-taxonomy.md) |
| 混合鍵合 | hybrid bonding | 不用凸塊，介電層與銅同時直接接合 | [09](09-soic-hybrid-bonding.md) |
| SoIC-X / SoIC-P | TSMC 商標 | -X 為無凸塊混合鍵合；-P 仍用細間距凸塊。**不可混寫** | [09](09-soic-hybrid-bonding.md) |
| 碟陷 | dishing | CMP 後銅墊相對氧化物凹下去的量；混合鍵合的製程窗口 | [09](09-soic-hybrid-bonding.md) |
| D2W / W2W | die-to-wafer / wafer-to-wafer | 以裸晶對晶圓、或晶圓對晶圓的方式接合 | [09](09-soic-hybrid-bonding.md) |

## 四、記憶體

| 術語 | 英文 | 一句話定義 | 首次定義 |
|---|---|---|---|
| 高頻寬記憶體 | HBM, High Bandwidth Memory | 用 TSV 垂直堆疊多顆 DRAM 晶粒的記憶體 | [08](08-hbm.md) |
| MR-MUF | Mass Reflow Molded Underfill | 一種 HBM 堆疊接合與填膠方法（按廠商分列） | [08](08-hbm.md) |
| TC-NCF | Thermo-Compression Non-Conductive Film | 另一種 HBM 堆疊接合方法（按廠商分列） | [08](08-hbm.md) |

## 五、缺陷與量測

| 術語 | 英文 | 一句話定義 | 首次定義 |
|---|---|---|---|
| 自動光學檢測 | AOI, Automated Optical Inspection | 用影像自動找出表面缺陷 | [11](11-defect-aoi-metrology.md) |
| 白光干涉 | SWLI, Scanning White Light Interferometry | 用光的干涉量測表面高度與平坦度 | [11](11-defect-aoi-metrology.md) |
| 橫向取樣間距 vs 垂直解析度 | lateral sampling vs vertical resolution | **兩者不可混用**。均豪公開的「1 μm × 1 μm」未說明屬於何者，本書一律不代入（待查 P4） | [11](11-defect-aoi-metrology.md) |
| 翹曲 | warpage | 工件受熱或應力後整體彎曲變形 | [11](11-defect-aoi-metrology.md) |
| 空洞 | void | 材料內部或接合界面的孔隙 | [11](11-defect-aoi-metrology.md) |
| 超音波掃描 | SAT, Scanning Acoustic Tomography | 用超音波找出封裝內部的分層與空洞 | [11](11-defect-aoi-metrology.md) |
| 次表面損傷 | subsurface damage | 粗磨在表面底下留下的晶格破壞層；光學與表面量測都看不到 | [11](11-defect-aoi-metrology.md) |
| 已知良品晶粒 | KGD, Known Good Die | 已通過測試、確認良好的裸晶 | [01](01-why-advanced-packaging.md) |

## 六、研磨與濕製程

| 術語 | 英文 | 一句話定義 | 首次定義 |
|---|---|---|---|
| 背磨 | backgrinding | 從晶圓背面磨薄 | [12](12-grinding-thinning.md) |
| 化學機械研磨 | CMP, Chemical Mechanical Polishing | 化學腐蝕加機械研磨並用的平坦化方法 | [12](12-grinding-thinning.md) |
| 總厚度變異 | TTV, Total Thickness Variation | 同一片工件上最厚與最薄處的差 | [12](12-grinding-thinning.md) |
| 再生晶圓 | reclaim wafer | 回收、去膜、重新拋光後可再使用的測試用晶圓 | [12](12-grinding-thinning.md) |
| 選擇比 | selectivity | 蝕刻或清洗時，對目標材料與非目標材料的移除速率之比 | [13](13-wet-process.md) |
| 去膠 | stripping | 移除光阻或暫時性接著層 | [13](13-wet-process.md) |
| 解黏 | debonding | 把工件從暫時載具上分離 | [05](05-fan-out.md) |

## 七、產能與良率

| 術語 | 英文 | 一句話定義 | 首次定義 |
|---|---|---|---|
| 節拍時間 | tact time | 單一工件在某站點所需的加工時間 | [14](14-yield-capacity-capex.md) |
| 稼動率／可用率 | availability | 機器可運轉時間 ÷ 日曆時間。**只回答「有沒有在動」** | [14](14-yield-capacity-capex.md) |
| 設備綜合效率 | OEE, Overall Equipment Effectiveness | 可用率 × 性能率 × 良品率。不可與稼動率混用 | [14](14-yield-capacity-capex.md) |
| 累積良率 | cumulative yield | 各站良率相乘後的整體良率 | [14](14-yield-capacity-capex.md) |
| 重工 | rework | 不良品重新加工以挽救 | [14](14-yield-capacity-capex.md) |

## 八、公司與產業

| 術語 | 說明 | 首次定義 |
|---|---|---|
| 均豪精密（5443） | 本書主角。Wafer 級檢、量、磨、拋設備 | [README.md](README.md) |
| 均華精密（6640） | 均豪持股約 56.8% 的**子公司**，Die 級 Sorter／Bonder。併入合併報表 | [README.md](README.md) |
| 志聖工業（2467） | 與均豪**交叉持股**的聯盟成員，前段製程設備。營收不併入 | [README.md](README.md) |
| G2C+ | 志聖、均豪、均華組成的聯盟，2026 年東捷加入 | [00-map.md](00-map.md) |
| OSAT | Outsourced Semiconductor Assembly and Test，封裝測試服務業者 | [02](02-packaging-taxonomy.md) |
| PMIC | Power Management IC，電源管理晶片 | [01](01-why-advanced-packaging.md) |
| CPO | Co-Packaged Optics，光電共封裝 | [11](11-defect-aoi-metrology.md) |
| TGV | Through Glass Via，玻璃穿孔 | [11](11-defect-aoi-metrology.md) |
| 歸屬母公司 | 合併淨利扣除非控制權益後，屬於母公司股東的部分 | [README.md](README.md) |
| 個體／合併 | 個體＝均豪本身；合併＝均豪加子公司（含均華） | [README.md](README.md) |

---

## 容易混淆的詞組

| 常被混用的兩個詞 | 差在哪 |
|---|---|
| **中介層 vs 載板** | 中介層用晶圓製程做，線寬可到微米以下；載板用增層法做，線寬約十微米量級 |
| **載具 vs 載板** | 載具是製程中暫時支撐、之後移除的；載板留在成品裡 |
| **背磨 vs CMP** | 背磨是機械移除大量材料；CMP 是化學加機械的**平坦化**，移除量小、追求表面品質 |
| **清洗 vs 蝕刻** | 清洗要移除不該在的東西且不傷結構；蝕刻要有選擇性地移除**該移除的結構材料** |
| **認證 vs 量產** | 認證證明技術可行；量產才產生營收。兩者常隔一整個週期 |
| **產能 vs 設備需求** | 產能可透過稼動率、良率、重工減少提升，不必然等比例增加設備 |
| **稼動率 vs OEE** | 稼動率＝可運轉 ÷ 日曆（有沒有在動）；OEE 還要乘性能率與良品率 |
| **均豪 vs 均華** | 前者 Wafer 級、後者 Die 級。後者併入前者的合併報表，但不是前者的產品 |

---

> ← 上一頁：[附錄 A 來源索引](appendix-sources.md)　｜　下一頁：[附錄 C 待查事項總表](appendix-open-questions.md)

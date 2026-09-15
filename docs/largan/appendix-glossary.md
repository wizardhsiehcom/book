# 術語表

本表只寫「本書怎麼用這個詞」以及「最常見的誤用」。合約、標準或客戶規範若採不同定義，以該文件為準並記錄差異——**不要把本表當成業界統一規格**。

## 光學與成像

| 術語 | 本書定義與提醒 | 首次完整解釋 |
|---|---|---|
| 鏡片 lens element | 單一片透鏡。6P 的 P 指的就是塑膠鏡片的片數 | [01](01-camera-value-chain.md) |
| 鏡頭組 lens assembly | 多片鏡片加鏡筒、間隔環組成的光學單元；大立光交付的主要是這一層 | [01](01-camera-value-chain.md) |
| 相機模組 camera module | 鏡頭組＋致動器＋感測器＋基板的組裝成品；**與鏡頭組是不同交付物** | [01](01-camera-value-chain.md) |
| 焦距 focal length | 光學系統的實際焦距，單位 mm；與等效焦距不同 | [02](02-optical-tradeoffs.md) |
| 等效焦距 equivalent focal length | 換算到 35mm 片幅的視角比較值；**引用時必須註明感測器基準** | [02](02-optical-tradeoffs.md) |
| F 數 f-number | 焦距除以入瞳直徑；數字小代表相對孔徑大 | [02](02-optical-tradeoffs.md) |
| TTL total track length | 通常指第一光學表面到像面的光學系統長度；折疊光路可把部分長度安排在機身平面內，引用時須交代定義 | [02](02-optical-tradeoffs.md) |
| 主光線角 CRA | 某場點通過孔徑光闌中心的主光線，在像面相對法線的角度；須與感測器微透鏡的角度接受特性匹配 | [02](02-optical-tradeoffs.md) |
| 像差 aberration | 實際成像偏離理想點像的各種方式；球差、彗差、像散、場曲、畸變、色差各有不同徵狀 | [03](03-image-quality.md) |
| MTF | 對比隨空間頻率的變化；**沒有場點、頻率單位、波長權重與對焦位置就不可比較** | [03](03-image-quality.md) |
| 空間頻率 lp/mm、cy/px | 兩種常見單位，換算需要像素尺寸；混用會得到錯誤結論 | [03](03-image-quality.md) |
| sagittal／tangential | MTF 的兩個方向分量；單獨引用其一會高估或低估表現 | [03](03-image-quality.md) |
| 相對照度 relative illumination | 邊緣相對中心的亮度比；與鏡頭暗角、cos⁴ 定律相關 | [03](03-image-quality.md) |
| Nyquist 頻率 | 規則取樣的半取樣頻率；高於此頻率的訊號若未適當抑制，會混疊，這不是所有成像品質的單一上限 | [03](03-image-quality.md) |
| 繞射極限 diffraction limit | 孔徑造成的解析度物理上限；F 數愈大愈明顯 | [03](03-image-quality.md) |
| 非球面 aspheric | 偏離球面的表面形狀；模造可複製複雜面形，但仍須計入模具、製程與良率成本 | [04](04-lens-design-materials.md) |
| 阿貝數 Abbe number | 材料色散的度量；與折射率搭配用來平衡色差 | [04](04-lens-design-materials.md) |
| 玻塑混合 | 玻璃與塑膠鏡片混用的鏡頭；1G3P 這類寫法指各自片數 | [04](04-lens-design-materials.md) |

## 製造與品質

| 術語 | 本書定義與提醒 | 首次完整解釋 |
|---|---|---|
| 模仁 mold insert | 承載成形曲面的模具鑲件；其系統性誤差可能傳到鏡片，仍須考慮材料收縮、補償與其他製程因素 | [05](05-molding-process.md) |
| SPDT 單點鑽石車削 | 加工模仁形狀的方法；刀具路徑可能留下週期性的中頻紋路 | [05](05-molding-process.md) |
| 收縮 shrinkage／翹曲 warpage | 冷卻固化時的體積變化與不均勻變形；造成面形偏離設計 | [05](05-molding-process.md) |
| 殘留應力與雙折射 birefringence | 殘留應力或分子取向可能造成偏振相關折射率差；與翹曲的機理不同，製程最佳化須同時檢查兩者 | [05](05-molding-process.md) |
| 面形誤差 PV／RMS | 實際表面與設計表面的偏差；兩種統計方式不可互換引用 | [05](05-molding-process.md) |
| 中頻誤差 mid-spatial-frequency error | 介於面形與粗糙度之間的週期性誤差；常表現為雜散光與對比下降 | [05](05-molding-process.md) |
| 公差鏈 tolerance stack-up | 多層零件誤差的累積；片數愈多，鏈愈長 | [06](06-assembly-yield-cost.md) |
| 偏心 decenter／傾斜 tilt | 鏡片光軸的橫向偏移與角度偏差；常造成場點不對稱的 MTF 下降 | [06](06-assembly-yield-cost.md) |
| 主動對準 active alignment | 一邊量影像一邊調整位置再固定的組裝方式 | [06](06-assembly-yield-cost.md) |
| 站點良率 y | 本書模型中，某一站通過的比例；**第二階段的分母是第一階段已通過者** | [06](06-assembly-yield-cost.md) |
| 合格單位成本 | 全部投入成本（含報廢已耗用部分）除以合格交付量；不是單站成本相加 | [06](06-assembly-yield-cost.md) |
| 篩選配對 binning／pairing | 依量測結果分組搭配；**會打破「單片良率的片數次方」這種獨立假設** | [06](06-assembly-yield-cost.md) |
| 折疊光路 folded optics | 用稜鏡或反射鏡把光路轉向，把長度藏進手機的寬度方向 | [07](07-telephoto-actuation.md) |
| 光學變焦 vs 數位變焦 | 前者靠移動鏡片群改變焦距，後者是裁切；**「N 倍」必須註明基準** | [07](07-telephoto-actuation.md) |
| VCM 音圈馬達 | 常見的 AF／OIS 致動元件；由馬達廠交付，責任邊界與鏡頭廠不同 | [07](07-telephoto-actuation.md) |
| OIS 光學防手震 | 補償手震的機制；鏡頭位移、感測器位移、稜鏡傾斜是三種不同做法 | [07](07-telephoto-actuation.md) |

## 商業與證據

| 術語 | 本書定義與提醒 | 首次完整解釋 |
|---|---|---|
| 法定揭露 | 年報、法說會簡報、重大訊息等依法公告的內容；只支持其實際披露範圍 | [README](README.md) |
| 公司自述 | 官網、簡介、沿革中的公開陳述；不是獨立驗證 | [README](README.md) |
| 媒體轉述 | 報導轉述的內容，含法說會問答摘要；**不能當成公司書面揭露** | [11](11-largan-evidence-map.md) |
| 開發完成／落成 | 公司自陳的工程或建物里程碑；**不等於量產、客戶採用或收入** | [12](12-reading-news.md) |
| 送樣／驗證 | 客戶採用流程中的中間階段；各自需要各自的證據 | [08](08-qualification-competition.md) |
| 客戶集中度 | 年報依法揭露的前幾大客戶占比；本書所用來源**僅以數字代號列示，未具名** | [01](01-camera-value-chain.md) |
| 產品組合 mix | 不同畫素級別或規格產品的出貨比重；驅動平均單價 | [09](09-business-economics.md) |
| 合併 vs 個體 | 合併報表含子公司，個體只有母公司；**集團合併數字不等於母公司單體表現** | [09](09-business-economics.md) |
| 改判條件 | 要看到什麼新證據才會改變目前判斷；本書要求每個結論都附上它 | [12](12-reading-news.md) |
| AEC-Q100／IATF 16949 | 前者為積體電路的應力試驗資格規範，後者為汽車供應鏈品質管理系統標準；都不能直接當作被動鏡片的成像性能認證 | [10](10-new-applications.md) |
| CPO 共同封裝光學 | 把光引擎與電子晶片在封裝層級緊密整合的架構；光學接口須檢查耦合損耗、對準容差等，完整系統另有頻寬、功耗與可靠度要求 | [10](10-new-applications.md) |

本書全部算例中的良率、成本與價格參數都是**教學假設**，不是大立光的真實數據；公司未公開的項目登記在[待查問題](appendix-open-questions.md)。

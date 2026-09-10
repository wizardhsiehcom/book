# 附錄 B：術語表

下表是本書採用的工作定義，連結指向首次完整說明或最相關章節；不代替客戶規格及標準版本。

| 中英術語 | 本書意思 | 易混淆處／詳解 |
|---|---|---|
| 晶粒 Die | 晶圓分割後的電路工件 | 不是封裝成品；[01](01-die-handling.md) |
| 切割膠膜 Dicing tape | 切割與搬運時保持工件的膜材 | 不是可任意加熱或 UV 處理的通用材料；[01](01-die-handling.md) |
| 頂出機構 Ejector | 從下方協助晶粒分離的機構 | 不限定單針形式；[01](01-die-handling.md) |
| 吸嘴／取放頭 Collet／pick-up tool | 吸持及搬運晶粒的工具 | 真空讀值不是完整的吸持／無損證明；[01](01-die-handling.md) |
| 預剝離 Pre-peeling | 取料前先處理局部剝離的功能 | 具體機構與窗口需看型號；[01](01-die-handling.md) |
| 晶圓圖 Wafer map | 以座標對應分類與身分的資料 | 格式、方向、版本都重要；[02](02-sorter-traceability.md) |
| 分類 Bin | 依定義形成的分類代碼 | 不預設某數字就是良品；[02](02-sorter-traceability.md) |
| 分選機 Sorter | 依資料／檢查結果把晶粒送到目的位置的設備 | 不必然整合電測；[02](02-sorter-traceability.md) |
| 已知良品晶粒 KGD | 在指定測試範圍與條件下增加良品信心的晶粒 | 不是零風險；<a href="../../cowos/html/13-test-and-kgd.html">既有 KGD 章</a> |
| 自動光學檢查 AOI | 以光學影像觀察可檢缺陷或特徵 | 不等於電測、界面分析或對位精度；[02](02-sorter-traceability.md) |
| 輸出格位 Pocket | tray 等載具中承接單顆工件的位置 | 需與來源晶圓座標連結；[02](02-sorter-traceability.md) |
| SECS | 半導體設備通訊相關的標準／協定家族 | 通訊功能不等於特定 map 格式相容；[02](02-sorter-traceability.md) |
| 取放 Pick and place | 工件由一個支撐者轉交到另一位置 | 包括感測、互鎖與履歷；[03](03-pick-place-flip.md) |
| 翻面 Flip | 改變工作面朝向的三維動作 | 不等同平面旋轉；[03](03-pick-place-flip.md) |
| 定位標記 Fiducial | 提供工件位置與姿態的參考特徵 | 標記位置與觀看面須明定；[03](03-pick-place-flip.md) |
| 放置精度 Placement accuracy | 必須附加工對象、時點與量測定義的性能描述 | 不用解析度單獨代替；[04](04-alignment-error-budget.md) |
| 重複性 Repeatability | 相同條件下重做的散布 | 可以很集中但整體偏移；[04](04-alignment-error-budget.md) |
| 偏差 Bias | 相對可信基準的平均偏移 | 不藏入零均值隨機項；[04](04-alignment-error-budget.md) |
| 漂移 Drift | 基準或結果隨時間／狀態的改變 | 不先假定一定來自單一熱源；[04](04-alignment-error-budget.md) |
| 不確定度 Uncertainty | 對量測結果所剩不確定性的描述 | 不等於工件實際誤差；[04](04-alignment-error-budget.md) |
| 平方和平方根 RSS | 標準差／不確定度合成中的常見形式 | 相關項、敏感度與系統校正不可省略；[04](04-alignment-error-budget.md) |
| 黏晶機 Die bonder | 執行晶粒放置／黏著／接合相關步驟的設備類別 | 不指定唯一接合法；[05](05-bonder-process-boundaries.md) |
| 熱壓接合 TCB | 依材料以熱、力與時間控制接合的製程類別 | 不是看到加熱器就能認定；[05](05-bonder-process-boundaries.md) |
| 混合鍵合 Hybrid bonding | 涉及介電與金屬表面配對接合的工藝 | 不等於所有 3D IC 或 Bonder；[05](05-bonder-process-boundaries.md) |
| 節拍 Cycle time | 本書特指固定條件下的完成品間隔時會明說「穩態節拍」 | 與單顆總通過時間分開；[06](06-throughput-quality.md) |
| UPH | 每小時產出單位數 | 單位、時間基準與品質條件需一致；[06](06-throughput-quality.md) |
| 整體設備效率 OEE | 可用率 × 性能率 × 品質率 | 不再重複乘同一個品質率；[06](06-throughput-quality.md) |
| 設備前端模組 EFEM | 設備與晶圓搬送介面相關模組 | 官網列介面不代表已揭露完整製程；[07](07-gmm-product-evidence.md) |
| 6S／PoW／PoP／MCLP | 官網出現的標籤，本書保留原文字面 | 本次來源未完整定義，未自行延伸成性能或接合法；[來源索引](appendix-sources.md) |
| F／e | 預測／估計的常見圖表標記 | 保留原頁定義，不改寫為已實現；[08](08-reading-news.md) |

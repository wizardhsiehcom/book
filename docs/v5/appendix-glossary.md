# 附錄 B　術語表

本表提供本書採用的中文與工作定義；廠商相同名詞若有不同口徑，仍以具體輸入、輸出及條件核對。

| 術語 | 本書意思 | 回讀 |
|---|---|---|
| Wafer，晶圓 | 承載重複晶粒或相關製程結構的圓形工件 | [02](02-workpieces-and-stations.md) |
| Die，晶粒 | 個別晶片單位，需與全晶圓或局部視野區分 | [02](02-workpieces-and-stations.md) |
| Carrier／載具 | 承載、定位或保護工件的結構；不等於工件本體 | [02](02-workpieces-and-stations.md) |
| RDL，重佈線層 | 重新安排電氣連接位置的走線與絕緣結構 | [02](02-workpieces-and-stations.md) |
| Bump，凸塊 | 用於垂直互連的凸起結構；平面輪廓與高度分開看 | [02](02-workpieces-and-stations.md) |
| CD，關鍵尺寸 | 在指定方法和位置下定義的尺寸，不是單一固定幾何 | [07](07-metrology-and-3d.md) |
| Overlay，疊對 | 不同圖形層或結構的相對位置關係；需明確基準 | [07](07-metrology-and-3d.md) |
| EBR／WEE | 原廠在晶圓邊緣相關量測中使用的縮寫；常見脈絡為 edge bead removal／wafer edge exposure，實際被測邊界以 recipe 與原廠定義為準 | [14](14-v5-product-evidence.md) |
| AOI | 自動光學檢測；產品可整合更多量測或分類功能 | [06](06-aoi-and-recipes.md) |
| Detection，檢出 | 從訊號中找出候選，不等於確認全部真缺陷 | [03](03-detection-metrology-review.md) |
| Review，複判 | 對候選補充或重看證據，可能由人與工具共同完成 | [03](03-detection-metrology-review.md) |
| ADC | 自動缺陷分類；本書重點是 AOI 候選之後的分類層 | [08](08-adc-and-human-review.md) |
| Recipe，配方 | 讓特定工件可重複受檢的取像、區域、參考與判定設定 | [06](06-aoi-and-recipes.md) |
| BF／DF | 明場／暗場；照明與收光配置不同，不能只按名稱決定適用性 | [05](05-optics-and-imaging.md) |
| FOV，視野 | 一次取像所涵蓋的物體範圍 | [05](05-optics-and-imaging.md) |
| NA，數值孔徑 | 描述光學收光角度與介質相關能力的量，影響解析與成像 | [05](05-optics-and-imaging.md) |
| Pixel，像素 | 影像的取樣單位；物方尺寸需由成像配置與校正決定 | [05](05-optics-and-imaging.md) |
| Accuracy，準確性 | 接近真值的定性概念；型錄數字須另問定義 | [07](07-metrology-and-3d.md) |
| Repeatability，重複性 | 規定相近條件下重複結果的集中程度 | [07](07-metrology-and-3d.md) |
| Reproducibility，再現性 | 在指定改變條件下評估結果的一致性 | [07](07-metrology-and-3d.md) |
| Uncertainty，不確定度 | 依資訊描述可歸於被測量之值分散程度的非負參數 | [07](07-metrology-and-3d.md) |
| GR&R | 量具重複性與再現性研究，不能自動代表完整不確定度 | [07](07-metrology-and-3d.md) |
| Precision，分類精確率 | TP / (TP + FP)；勿與計量學的 precision 混用 | [04](04-defects-and-quality.md) |
| Recall，召回率 | TP / (TP + FN)，分母為參考集合中的真陽性單位 | [04](04-defects-and-quality.md) |
| False positive，假陽性 | 參考為良好卻被攔截／列候選；所處決策階段需明列 | [04](04-defects-and-quality.md) |
| False negative，假陰性 | 參考為缺陷卻未被保留或被放行 | [04](04-defects-and-quality.md) |
| Escape／overkill | 漏放／誤殺的常用語；各文件分母可能不同，需明寫 | [04](04-defects-and-quality.md) |
| Unknown／abstention | 未知或保留不自動判定；不能默認為良品 | [08](08-adc-and-human-review.md) |
| Drift，漂移 | 輸入、預測或品質相對基準的變化，需要調查與監測 | [08](08-adc-and-human-review.md) |
| OM Upgrade | 在指定既有光學顯微設備上進行自動化升級 | [10](10-om-upgrade.md) |
| Inline AOI | 本書指嵌入宿主製程設備的光學檢測 | [11](11-inline-aoi.md) |
| Wafer map | 將晶圓位置或晶粒與狀態連結的地圖表示 | [12](12-data-and-traceability.md) |
| KLARF／SINF | 公開列出的結果交換格式選項；本書未取得完整第一方 schema | [12](12-data-and-traceability.md) |
| SECS/GEM | 半導體設備與主機的通訊、資料及控制行為相關標準脈絡 | [12](12-data-and-traceability.md) |
| OHT | 工廠高架搬送系統的常用縮寫；實際接口與搬送範圍另驗 | [09](09-standalone-inspection.md) |
| WPH | 每小時晶圓數；需固定配置、覆蓋與計時範圍 | [13](13-throughput-and-acceptance.md) |
| OSAT | 提供外包半導體組裝與測試服務的公司類別 | [14](14-v5-product-evidence.md) |
| Qualification，資格驗證 | 對特定用途的資格進展；不自動代表所有型號與性能 | [16](16-reading-company-news.md) |
| Roadmap，發展規劃 | 未來方向或預定工作；與可採購、出貨及量產採用分列 | [16](16-reading-company-news.md) |

正式計量詞彙以[來源索引](appendix-sources.md)的 VIM／NIST 文件為依據。其餘為本書教學用語；任何採購規格仍需雙方對齊被測量、範圍與驗收定義。

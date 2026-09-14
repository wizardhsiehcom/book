# 附錄 B　術語表

| 術語 | 英文／縮寫 | 說明 | 主要出現章節 |
|---|---|---|---|
| 晶圓針測 | CP／Wafer Sort／Chip Probing | 晶圓尚未切割時，用探針接觸 pad 進行的測試 | [01](01-test-in-the-flow.md) |
| 成品測試 | FT／Final Test | 封裝完成後，透過 socket 接封裝腳位的測試 | [01](01-test-in-the-flow.md) |
| 系統級測試 | SLT／System Level Test | 在近似真實系統的環境下進行的測試，攔截 ATE 涵蓋不到的失效 | [01](01-test-in-the-flow.md) |
| 燒機 | burn-in | 加溫加壓使潛在缺陷提早失效的加速老化程序。**本身不產生判定**，必須搭配後測 | [05](05-burn-in-and-screening.md) |
| 已知良品 | KGD／Known Good Die | 在封裝前已確認為良品的裸晶 | [01](01-test-in-the-flow.md) |
| 測試機 | ATE／Automated Test Equipment | 產生激勵、量測回應、供電與對時的主機 | [03](03-test-cell.md) |
| 晶圓針測機 | prober | 把晶圓送到探針下方並完成對位的機構 | [03](03-test-cell.md) |
| 分選機 | handler | 把封裝成品送入 socket 並依判定結果分類的機構 | [03](03-test-cell.md) |
| 探針卡 | probe card | 晶圓階段的接觸介面，以探針接觸 pad | [03](03-test-cell.md) |
| 介面板 | load board／DUT board | 把測試機資源接到接觸介面的電路板 | [03](03-test-cell.md) |
| 下針量 | overdrive | 探針壓到 pad 上的行程量，影響接觸電阻與針痕深度 | [03](03-test-cell.md) |
| 針痕 | probe mark | 探針在 pad 上留下的壓痕 | [03](03-test-cell.md) |
| 多工測試 | multi-site | 同時測試多顆待測物以提高吞吐 | [02](02-test-cost-model.md) |
| 換料時間 | index time | handler 把上一顆移出、下一顆送入所需的時間 | [02](02-test-cost-model.md) |
| 每小時產出 | UPH／Units Per Hour | 測試單元每小時的產出顆數 | [02](02-test-cost-model.md) |
| 過殺 | overkill | 良品被誤判為不良而丟棄 | [01](01-test-in-the-flow.md)、[05](05-burn-in-and-screening.md) |
| 相關性研究 | correlation study | 證明兩種測法（或兩個插入點）判定一致的驗證工作 | [04](04-high-speed-rf-test.md) |
| 內建自我測試 | loopback／BIST | 讓晶片自行產生並接收訊號的測試方式，繞過治具頻寬限制 | [04](04-high-speed-rf-test.md) |
| 校正面 | reference plane | 量測數據所代表的實體位置。射頻規格必須連同校正面陳述 | [04](04-high-speed-rf-test.md) |
| 浴缸曲線 | bathtub curve | 失效率隨時間的典型形狀：早夭期、穩定期、磨耗期 | [05](05-burn-in-and-screening.md) |
| 早夭 | infant mortality | 使用初期因製造缺陷造成的高失效率 | [05](05-burn-in-and-screening.md) |
| 電子晶片 | EIC／Electronic IC | 矽光子模組中負責驅動、放大與序列化的電子晶片 | [06](06-silicon-photonics-test.md) |
| 光子晶片 | PIC／Photonic IC | 含波導、調變器與光偵測器的光子晶片 | [06](06-silicon-photonics-test.md) |
| 共同封裝光學 | CPO／Co-Packaged Optics | 把光學元件與運算晶片封裝在同一模組 | [06](06-silicon-photonics-test.md) |
| 插入損耗 | insertion loss | 光訊號通過待測物後的功率損失 | [06](06-silicon-photonics-test.md) |
| 主動對位 | active alignment | 邊送光邊搜尋最大耦合效率位置的對位方式 | [06](06-silicon-photonics-test.md) |
| 委外封測 | OSAT | 提供封裝與測試代工服務的廠商類型 | 全書 |

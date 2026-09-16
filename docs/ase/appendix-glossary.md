# 附錄 B　術語表

| 術語 | 英文／縮寫 | 說明 | 主要出現章節 |
|---|---|---|---|
| 裸晶 | die／bare die | 從晶圓切割下來、尚未封裝的晶片本體 | [01](01-osat-value-chain.md) |
| 封裝體 | package | 把裸晶加上基板、接線、模封後的可出貨形式 | [01](01-osat-value-chain.md) |
| 委外封裝測試服務商 | OSAT | 提供封裝與測試代工服務的廠商類型 | 全書 |
| 整包服務 | turnkey | 封測廠同時採購材料並承擔加工，材料風險在封測廠 | [01](01-osat-value-chain.md)、[07](07-test-and-quality.md) |
| 客供料 | consigned | 客戶供料、封測廠只收加工費，材料風險在客戶 | [01](01-osat-value-chain.md)、[07](07-test-and-quality.md) |
| 基板 | substrate | 承載裸晶並把訊號扇出到外部接點的載板 | [01](01-osat-value-chain.md)、[03](03-packaging-service-baseline.md) |
| 打線 | wire bond | 用金屬細線把晶粒接墊連到基板的接合方式 | [03](03-packaging-service-baseline.md) |
| 覆晶 | flip chip | 晶粒翻面、以凸塊直接接到基板的接合方式 | [03](03-packaging-service-baseline.md) |
| 凸塊 | bump／bumping | 在晶圓接墊上長出的金屬凸起，覆晶的接點 | [03](03-packaging-service-baseline.md) |
| 晶圓級封裝 | WLP／WLCSP | 在晶圓階段完成大部分封裝工序的作法 | [03](03-packaging-service-baseline.md) |
| 底填膠 | underfill | 填入晶粒與基板之間，分散凸塊熱應力的材料 | [03](03-packaging-service-baseline.md) |
| 金屬間化合物 | IMC | 接合界面生成的合金相，過厚會變脆 | [03](03-packaging-service-baseline.md) |
| 板階可靠度 | BLR／Board Level Reliability | 封裝體焊到系統板之後的可靠度表現 | [03](03-packaging-service-baseline.md) |
| 系統級封裝 | SiP／System in Package | 把異質元件整合進單一封裝模組 | [04](04-sip-system-integration.md) |
| 電子製造服務 | EMS | 板級組裝與系統製造服務；集團內由環旭電子承擔 | [04](04-sip-system-integration.md)、[09](09-capacity-and-economics.md) |
| 電磁屏蔽 | shielding | 在模組表面加導電層隔離電磁干擾 | [04](04-sip-system-integration.md) |
| 重佈線層 | RDL／Redistribution Layer | 在晶圓或模封面上加做的金屬佈線層，改變接點位置與密度 | [05](05-vipack-and-fanout.md)、[06](06-codesign-and-handoff.md) |
| 扇出封裝 | fan-out | 把接點佈到晶粒範圍之外，以取得更多 I/O 的封裝作法 | [05](05-vipack-and-fanout.md) |
| 矽穿孔 | TSV／Through Silicon Via | 貫穿矽基材的垂直導通孔，2.5D／3D 堆疊的基礎 | [05](05-vipack-and-fanout.md) |
| 矽橋 | silicon bridge | 嵌入封裝中、只在需要高密度處提供細線繞線的小片矽 | [05](05-vipack-and-fanout.md) |
| 線寬線距 | L/S／line and space | 佈線的寬度與間距，決定單位寬度能繞幾條線 | [05](05-vipack-and-fanout.md)、[06](06-codesign-and-handoff.md) |
| 晶粒 | chiplet | 把大晶片切成多顆、再於封裝中整合的設計方式 | [05](05-vipack-and-fanout.md)、[06](06-codesign-and-handoff.md) |
| 測試載具 | test vehicle | 為驗證封裝結構而製作的樣品，**不是量產產品** | [05](05-vipack-and-fanout.md)、[08](08-emerging-platforms.md)、[10](10-ase-service-evidence.md) |
| 訊號完整性 | SI／Signal Integrity | 訊號在通道上維持波形與時序的能力 | [06](06-codesign-and-handoff.md) |
| 電源完整性 | PI／Power Integrity | 供電網路在瞬態負載下維持電壓的能力 | [06](06-codesign-and-handoff.md) |
| 電源網路阻抗 | PDN impedance | 供電網路在各頻段的阻抗，決定 IR drop 與雜訊 | [06](06-codesign-and-handoff.md) |
| 熱膨脹係數 | CTE | 材料受熱膨脹的比例；不匹配是翹曲與接點失效的主因 | [06](06-codesign-and-handoff.md)、[08](08-emerging-platforms.md) |
| 翹曲 | warpage | 封裝體受熱或固化收縮而變形 | [06](06-codesign-and-handoff.md)、[08](08-emerging-platforms.md) |
| 環氧模封膠 | EMC | 包覆晶粒的模封材料；固化收縮是翹曲來源之一 | [08](08-emerging-platforms.md) |
| 可測試性設計 | DFT／Design for Test | 在設計階段就規劃好測試接取點與覆蓋範圍 | [06](06-codesign-and-handoff.md)、[07](07-test-and-quality.md) |
| 已知良品 | KGD／Known Good Die | 封裝前已確認為良品的裸晶 | [07](07-test-and-quality.md) |
| 晶圓針測 | CP／Wafer Sort | 晶圓尚未切割時，用探針接觸接墊的測試 | [07](07-test-and-quality.md) |
| 成品測試 | FT／Final Test | 封裝完成後透過 socket 接腳位的測試 | [07](07-test-and-quality.md) |
| 系統級測試 | SLT／System Level Test | 在近似真實系統的環境下進行的測試 | [07](07-test-and-quality.md) |
| 燒機 | burn-in | 加溫加壓讓潛在缺陷提早失效的加速老化程序 | [07](07-test-and-quality.md) |
| 失效分析 | FA／Failure Analysis | 找出失效根因並回饋到設計或製程的工作 | [07](07-test-and-quality.md) |
| 溫度循環測試 | JESD22-A104 | JEDEC 的可靠度溫度循環測試方法 | [07](07-test-and-quality.md) |
| 高加速應力測試 | HAST／JESD22-A110 | JEDEC 的偏壓濕熱加速測試方法 | [07](07-test-and-quality.md) |
| 光電共封裝 | CPO／Co-Packaged Optics | 把光引擎與運算晶片封裝在同一模組 | [08](08-emerging-platforms.md) |
| 面板級扇出封裝 | FOPLP | 在矩形面板而非圓形晶圓上做扇出封裝 | [08](08-emerging-platforms.md) |
| 對位誤差 | overlay／placement error | 重構或微影時晶粒與圖形的位置偏差 | [08](08-emerging-platforms.md) |
| 日月光投控 | ASEH／3711／ASX | 2018 年成立的控股公司，**合併財報的主體** | [02](02-group-and-business.md) |
| 日月光半導體 | ASE Inc. | 1984 年成立的封測公司，投控子公司 | [02](02-group-and-business.md) |
| 矽品精密 | SPIL | 投控 **100% 全資子公司**，2018 年下市 | [02](02-group-and-business.md) |
| 環旭電子 | USI | 上海證交所上市（601231），做 EMS；**集團持股不是單一比例** | [02](02-group-and-business.md) |
| 封裝測試分部 | ATM | 季報新聞稿的自我描述用語；**20-F 全文查無此縮寫** | [02](02-group-and-business.md)、[09](09-capacity-and-economics.md) |
| 先進封裝（公司用語） | LEAP／leading-edge advanced packaging | 法說會與媒體使用的簡稱；**20-F 用的是 "leading-edge advanced packages"，全文查無 LEAP** | [09](09-capacity-and-economics.md)、[10](10-ase-service-evidence.md) |
| 分部間沖銷 | inter-segment elimination | 分部營收相加超過合併營收的差額來源 | [09](09-capacity-and-economics.md) |
| 未經查核 | unaudited | 未經會計師查核簽證，季度財報新聞稿屬此類 | [09](09-capacity-and-economics.md)、[11](11-reading-news.md) |

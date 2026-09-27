# B02｜資料庫與資料正確性：從一筆紀錄到可靠恢復

- 日期：2026-09-26
- 狀態：B02 正文、SQL 教案與網站已建立；Docker 模擬環境的核心驗收完成，未驗範圍已明列。當前結果以 `docs/database-correctness/verification.md` 為準，C02 尚未建立。
- 書籍 slug：`database-correctness`
- 依據：Obsidian `temp/缺口書籍與課程建置計畫.md` 的 B02、P2 路線與既有教材盤點。
- 規劃階段交付：本計畫與 `data/database-correctness/` 的研究筆記。資料夾受 `.gitignore` 排除；重要決策與公開來源保留於本計畫，不依賴備料才能接手。

## 1. 這本書要解決什麼

讀者有 AI／機械與 AOI 開發背景，能借助 AI 做出功能，現在需要自行判斷「資料究竟有沒有寫對，失敗之後憑什麼繼續」。B01 已提供資料、資源、契約與測試的基礎；B02 從資料庫初學者可理解的模型開始，不預設已修過資料庫課。

書中反覆使用合成的 AOI 判定資料：一筆缺陷如何被辨識、哪些還沒判定、重判如何留歷史、兩個匯入者如何避免蓋掉彼此，以及沒有收到成功回應時如何查核。這是貼近既有工作教材的教學情境，不宣稱已核實公司的 schema 或產品需求。

完成後讀者應能：

1. 從業務句子畫出實體與關聯，說明自然鍵、代理鍵、唯一約束與外鍵。
2. 預測 JOIN、聚合、NULL 如何改變結果筆數，寫出可對帳的查詢。
3. 定義不可被破壞的資料規則，說明哪些由 DB 保護、哪些需要應用流程。
4. 用兩個 session 的時間線解釋衝突，選擇並驗證合適的交易範圍與隔離策略。
5. 根據索引與查詢計畫的證據改善查詢，不把「建索引」當通用答案。
6. 面對重送、重判、提交未知、schema 變更與恢復，提出可驗證的處理契約。

## 2. 邊界與先備

**B02 是原理書，C02 是逐版做出工具的課程。** 書用可獨立重跑的小實驗拆解概念；C02 未來以「離線判定結果寫回與對帳工具」串成由簡入深的應用。製作範圍為 B02 書籍；C02 另行製作，不發布空課程下載包。

先備只要求能讀短函式、理解輸入驗證與失敗路徑，能區分記憶體值與持久化資料。入門 SQL 由本書教。B01 第 06、07、09、10 章作為契約、錯誤、測試、除錯的回查入口；C00 的檔案與清單檢查是場景銜接，不是必須先跑完的資料庫先修課。

不納入完整 DBA 手冊、ORM 框架、分散式共識、分片、資料倉儲、全面調校或完整訊息平台。Outbox 必須講清用途與失敗窗口，但只做局部示範；不為本書搭建 broker 叢集。

## 3. 已有內容如何使用

| 既有資產 | 沿用方式 | B02 必須新增／不能借用的保證 |
|---|---|---|
| `docs/software-engineering-foundations/06-contracts.md`、`07-errors.md`、`09-tests.md` | 連回輸入契約與行為驗證，不重教 C++ 基礎 | DB 約束與跨交易狀態的原理 |
| `docs/cpp-sql-field-tricks/06-data-contract.md`、`08-bind.md`、`09-fixed-sql.md` | 作為資料映射、參數綁定的現場入口 | 從實體到 schema、NULL／JOIN 與正規化的連續教學 |
| 該書 `10-write-result.md`、`11-rollback.md` | 沿用影響列與回滾的反例 | 多表不變條件、交易生命週期與崩潰恢復 |
| 該書 `12-lock-wait.md` | 沿用兩 session 更新同列的閱讀案例 | RCSI／SNAPSHOT 差異、讀改寫覆蓋與並行去重 |
| 該書 `15-retry.md`、`examples/seed.sql` | 比較 job ID 與 operation ID，引用順序重入案例 | 並行同 ID、同 ID 不同意圖、重判後查舊操作、真實連線故障 |
| 該書 `appendix-validation.md` | 保留舊實測版本與已驗範圍 | SQL Server 2017 舊結果不能當本書新版本已驗；丟棄應用回應不能當網路斷線實測 |

逐頁盤點備料：`data/database-correctness/coverage.md`。既有正文的優點是症狀與原碼緊密對照；B02 補通則、反例與方案比較，不複製整段 ODBC 教學。

## 4. 引擎與執行環境決策

### 教學基線

- 主引擎選 **SQL Server 2022 Developer，compatibility level 160** 作為待驗基線；不為追新版本而偏離既有 SQL Server 工作脈絡，也不直接沿用舊 2017 映像。
- 第一次製作實驗時固定可取得的 CU／build／映像 digest、OS 與工具版本；目前不填未驗證的 digest。版本變更時重跑相關實驗並保留舊紀錄。
- 優先使用支援的 x64 Linux SQL Server 容器，或獨立 Windows x64 開發實例。Apple Silicon Mac 可作編輯與客戶端；不把 amd64 模擬執行當官方支援的 SQL Server 實驗平台。
- 目前未確認有可用 x64 實驗主機。使用者已授權用本機 Docker 建立實驗容器，因此嘗試 ARM 上的 amd64 模擬；結果獨立標示，不以 SQLite 或模擬結果填補受支援 x64 平台驗證。
- SQL 是正文主語言，以兩個 SQL session 即可開始。需要 driver 故障觀察時才加入最小 C++／ODBC harness；不為讀前半本要求先掌握完整 ODBC 程式。
- SQLite 僅可提供明示引擎的局部比較，不設為另一套完整課程，也不代替 SQL Server 的 NULL 唯一性、型別、隔離或鎖實驗。

### 每輪證據必記

記錄 `@@VERSION`、edition、compatibility、RCSI／ALLOW_SNAPSHOT_ISOLATION、session isolation、autocommit、XACT_ABORT、LOCK_TIMEOUT、delayed durability 與實際 client／driver 版本。列出所有實驗改動的選項，不默認「READ COMMITTED」在每個平台都同樣運作。

基準庫 RCSI 關閉；RCSI 與 SNAPSHOT 對照採各自的專用實驗庫或可驗證的設定步驟，避免前章殘留狀態改變後章答案。用同步點決定 A／B 先後，不靠固定 sleep 猜排程。SNAPSHOT 範例須分開標示 BEGIN TRANSACTION 與首次資料存取，實測快照建立時點，不能只靠 BEGIN 的時間替觀察下結論。

所有資料為合成資料，建立獨立 `B02Lab` 類型的實驗庫；拒絕覆蓋同名既有庫。一般案例使用受限帳號；建庫、設定與備份還原由獨立管理步驟執行。重置只處理具名實驗資源，不做全域清除。

## 5. 預定目錄與章節驗收

以下檔名是製作驗收清單，目前正文已建立。共 21 篇核心頁，每頁一個主要問題；整體依「表示 → 查詢 → 保護 → 競爭 → 恢復」前進。

| 頁面 | 核心問題／內容 | 讀者必須交出的證據 |
|---|---|---|
| `01-identity.md` | 同一缺陷如何辨識？實體、自然鍵、代理鍵與關聯 | 解釋跨批次相同編號是否碰撞，畫出鍵與基數 |
| `02-normalization.md` | 模型名稱改一次為何要改多列？函數相依、1–3NF 的實用直覺、反正規化成本 | 拆開重複欄位，指出消失的更新異常與新增的 JOIN |
| `03-query.md` | SELECT 到底選了哪些列？篩選、排序、重複與參數 | 在含重複值的資料上先預測結果；排序加入明確的平手規則 |
| `04-null.md` | 未判、沒有欄位、空字串與 NULL 是同一件事嗎？三值邏輯 | 預測 WHERE、NOT IN、IS NULL；寫出不漏未判項的查詢 |
| `05-joins.md` | 接了歷史表為何筆數膨脹？INNER／LEFT JOIN、ON／WHERE | 給定一對多與未匹配列，精確列出輸出與對帳方式 |
| `06-aggregation.md` | 判定數量為何多算？GROUP BY、COUNT、NULL 與粒度 | 分開缺陷數與判定事件數，不用 DISTINCT 掩蓋錯誤模型 |
| `07-constraints.md` | 先 SELECT 再 INSERT 為何不夠？PK／UNIQUE／FK／CHECK／NOT NULL | 直接繞過應用送非法資料，指出是哪個約束阻擋；辨認 CHECK 的 UNKNOWN |
| `08-transactions.md` | 結果與操作紀錄能否只成功一半？交易與不變條件 | 在兩次寫入之間失敗，證明全部提交或全部不生效 |
| `09-commit-durability.md` | commit 成功、程序退出與落盤是哪些不同承諾？log、恢復與設定 | 區分 client crash／server restart／儲存故障，標記實測所能支持的範圍 |
| `10-concurrent-updates.md` | 兩個人都讀到舊版，誰能更新？interleaving、遺失更新、條件更新 | 用 A／B 時間線重現覆蓋，再以 expected version 與影響列判斷衝突 |
| `11-isolation.md` | 同樣 READ COMMITTED，為何讀取行為不同？髒讀、不可重複讀、幻讀；RCSI、SNAPSHOT、SERIALIZABLE | 在固定設定下預測兩次讀取；說明 statement snapshot 與 transaction snapshot；以跨列不變條件解釋快照不等於可序列化 |
| `12-locks-deadlocks.md` | 等鎖、死鎖、查詢逾時能否同樣重試？ | 分辨鎖等待逾時與死鎖受害者，查交易狀態後決定重試單位 |
| `13-indexes.md` | 索引如何幫忙，又讓誰付代價？複合鍵與涵蓋索引 | 按實際查詢提出一個索引，說明鍵序、寫入與空間成本 |
| `14-query-plans.md` | 看見 scan 就是慢嗎？估計／實際計畫、統計與讀取量 | 比較同資料同條件的結果與 logical reads，不硬斷言一定 seek |
| `15-operation-identity.md` | 重送與重判是同一個操作嗎？穩定 ID、意圖、原子紀錄 | 同 ID 同內容回舊結果；同 ID 異內容拒絕；新判定保留舊操作證據 |
| `16-unknown-outcome.md` | 沒有收到成功，能否證明沒寫？未知狀態與重連查核 | 分開已回滾、已提交、仍未知；查不到紀錄時說明為何不能立即推論失敗 |
| `17-outbox.md` | DB 已提交，通知怎麼辦？本地交易與外部副作用 | 畫出發送前／後中斷窗口，說明重複投遞與接收端去重的責任 |
| `18-migrations.md` | 新舊程式如何在 schema 變更期間共存？expand／backfill／contract | 在含舊資料的庫上演練升版、失敗與再進入；區分程式回版與資料回復 |
| `19-restore.md` | 有備份檔就代表能恢復？備份、還原與恢復目標 | 還原至新庫並比對資料不變條件；量到的 RTO／可恢復範圍不泛化為 SLA |
| `20-provenance.md` | 現在這個判定從何而來？輸入、模型、操作者、操作與時間版本 | 從目前值追到產生它的不可變判定紀錄，區分 rowversion 與時間戳 |
| `21-retention.md` | 清掉舊操作紀錄後，舊請求再來會怎樣？ | 提出保留期、重送窗口與到期請求契約，驗證清理後不悄悄重複執行 |

支援頁：`README.md`（讀者入口）、`00-map.md`（概念依賴）、`labs.md`（環境／重置）、`exercises.md`、`answers.md`、`sources.md`、`verification.md`。SQL 與必要 runner 放 `examples/`，章節片段與可執行範例必須對得上。

## 6. 範例資料契約

資料模型逐章長出來，不在第一章一次塞入所有表。以下是製作時要維持的概念，不是現在已定案的 DDL：

- 缺陷：`batch_id + defect_no` 是候選業務身分，`defect_id` 可作代理鍵。若真實情境有機台範圍差異，需先修正契約。
- 判定事件：一個缺陷可以多次判定，每次保存模型版本、結果與來源；新判定不覆寫過去事件。
- 目前判定：由明確的目前指標或明確排序規則取得；若保存指標，須維持與事件所屬缺陷一致。
- 操作：operation ID 代表一次穩定的業務意圖，與缺陷 ID、判定 ID 分開。保存可比較的意圖及該次結果；不能只核對最新判定是否仍等於舊值。
- 併發版本：應用版本號與 SQL Server rowversion 選其一做主例，另一個作比較。版本號不充當日期、模型版本或全域業務順序。
- 外部事件：需要通知才加入 outbox。DB 提交與事件入表同交易；送出與接收確認不在這個本地交易的保證範圍。

合成資料必含：同編號不同批次、零／一／多次判定、未判、NULL、同 ID 異意圖、舊操作成功後又被合法重判、兩個匯入者，以及遷移前的舊列。每組小資料都能手算答案。

## 7. 實驗與故障驗收矩陣

| 實驗組 | 必做案例 | 判準與保證邊界 |
|---|---|---|
| L01 模型／查詢 | 約束違反、NULL、JOIN 膨脹、聚合 | 明確列集合與錯誤種類，不以執行成功取代答案 |
| L02 交易 | 正常提交、第二步失敗、回滾後新連線讀回 | 兩份相關資料同成敗；記錄交易清理狀態 |
| L03 併發 | 讀改寫衝突、RCSI 對照、SNAPSHOT 對照、死鎖 | 兩個獨立 session、同步點、有界等待與最終讀回 |
| L04 索引 | 建前／建後、不同選擇率 | 結果一致、計畫／logical reads／資料量可重查；不以一次耗時判勝負 |
| L05 操作 | 順序重送、並行同 ID、異意圖、後續合法重判 | 唯一約束與同交易生效；衝突後回滾、重新查核；回舊操作結果不受最新值漂移誤導 |
| L06 未知提交 | 應用成功回應被丟棄、真實連線中斷 | 兩種故障分開記錄。中斷後重連查證，涵蓋已提交與未提交；無法確定的仍標 unknown |
| L07 Outbox | 入表後未發送、發送後未記確認、重複接收 | 故障前後事件與接收紀錄可查；替身只能證明其實作的故障模型 |
| L08 升版／恢復 | 舊資料升版、backfill 中斷重入、新舊讀取、還原到新庫 | 保存資料且契約成立；未實測時間點還原就不能宣稱具備該能力 |
| L09 保留期 | 重送窗口內、過期 ID、清理後舊請求 | 明確拒絕／查核策略，不能因查不到就當新操作 |

L06 的真實故障注入在隔離環境使用最小可觀測的連線切斷方式，記錄 client／server 時序與診斷。不承諾每次中斷恰落在同一 commit 窗口，也不預寫必然出現的 SQLSTATE。若未能取得證據，只能交付「部分驗證」版，不能以應用層丟回應替代。

本書不必證明跨系統 exactly-once。要證明的是指定資料庫交易內的不變條件、哪些通知可能重複，以及不知道時如何保留狀態並恢復。

## 8. 寫作方式與能力驗收

每頁固定提供：具體問題 → 先預測 → 最小資料／時間線 → 原理解釋 → 比較與反例 → 操作觀察 → 無提示題 → 答案入口。術語在問題出現時才引入；不先列滿整頁名詞。

前段給完整 SQL 與手算表，中段只給需求和資料，後段只給不變條件、故障點與驗收條件。答案獨立放置，包含推理與不能下的結論。教學不能只讓讀者複製 PASS。

期末遷移題換成「設備校正紀錄匯入」：有多次校正、兩位操作者、相同操作重送、回應遺失、欄位升版與歷史保留。只給需求和資料，不提供完整 schema 或操作順序。交付 ER 圖／DDL、查詢、交易邊界、A／B 時間線與恢復報告。

通過標準：每項不變條件有反例測試；能用獨立連線證據分類提交狀態；正確處理舊操作與新版本；能指出外部效果的剩餘風險。單純建置通過或看完教材不計為讀者完成。

## 9. 與 C02 的配對

C02 未來位置為 `/Users/wizard/Desktop/MacCode/courses/data-correctness-course/`，依「除 Siguard 外共用 courses repo」的最新決策。不要沿用早期計畫的獨立 sibling repo 路徑。這裡只定義接口，逐階 A–F 課程卡留待 C02 製作。

| C02 需求階梯 | B02 原理入口 |
|---|---|
| G00 環境、G01 一筆寫回與對帳 | labs、01、03–07 |
| G02 重複／錯誤資料 | 01–02、07 |
| G03 多表中途失敗 | 08–09 |
| G04 回應遺失 | 15–16 |
| G05 第二個執行者 | 10–12、15 |
| G06 外部通知 | 17 |
| G07 schema 演進／恢復 | 18–21 |
| G08 獨立遷移 | exercises；索引 13–14 視資料量與查詢需求配對 |

B02 的局部 SQL 實驗不依賴 C02 已完成；C02 未建立前，不發布假的課程連結或下載包。

## 10. 製作批次與完成門檻

| 批次 | 產出 | 開始依賴／完成條件 |
|---|---|---|
| P0 環境與資料契約 | 版本紀錄、隔離測試庫、合成 seed、L01 smoke check | 確認可用 x64 主機；引擎／工具／設定可重現，schema 不變條件寫清楚 |
| P1 表示與查詢 | 01–07、對應題目與答案、L01 | 不要求 ORM／ODBC；所有列集合答案在 SQL Server 核對 |
| P2 交易與競爭 | 08–12、L02–L03 | 實際雙 session 時間線、錯誤分類與清理驗證 |
| P3 讀取成本 | 13–14、L04 | 可重建資料量與統計，結果相同；只報量得的效果 |
| P4 重送與外部效果 | 15–17、L05–L07 | 並行去重、同 ID 衝突、舊操作查核與故障證據分開通過 |
| P5 演進與恢復 | 18–21、L08–L09、遷移題 | 升版中斷／還原／保留期契約均有反例；完成讀者判準 |
| P6 出版 | 入口、地圖、sources、verification、config、書庫卡片 | 正文與範例完成後才登錄；出版檢查通過 |

先做 P0＋P1 第一個「資料身分 → 約束 → 查詢」可讀樣章包，核對讀者能否從小表理解粒度，再展開後半部。這是分批驗收，不是刪減既定範圍。

實驗證據寫入 `verification.md`：案例、版本、指令、預測、實際、診斷、清理結果、限制。出版驗證包含 MkDocs strict build、正文相對連結與附件、Mermaid 渲染、桌面／窄螢幕閱讀；404 部署根路徑另外驗，不與一般頁面的檔案連結混算。

最終增加 `docs/database-correctness/`、`configs/database-correctness.yml` 與 `js/books-data.js` 的卡片，依 CLAUDE.md 同步共用資產。`book/database-correctness/html/` 只放生成結果。

## 11. 研究資料與尚待落實

本輪研究筆記與來源索引在 `data/database-correctness/`；本計畫後段保存精簡公開來源，正文製作時再逐項對照。

製作已固定 SQL Server 2022 CU27／16.0.4295.3 與映像 digest，使用容器 sqlcmd／ODBC 18，完成 DDL 與本機 TCP 故障重現器。仍待補受支援 x64 平台、完整 Outbox 整合、新 writer／contract、保留期服務等；精確通過範圍與原始證據入口見 `docs/database-correctness/verification.md`。


### 公開來源索引（製作時需再與版本核對）

查閱日期：2026-09-26。以下支撐設計與預期，不代表本書實驗已跑過。來源摘要與適用邊界詳見研究筆記。

| 對應 | 官方來源 | 用法與界線 |
|---|---|---|
| 環境 | [SQL Server 容器需求](https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-ver16) | x86-64 支援與模擬限制；不以 Mac 可連線推論可受支援地執行引擎 |
| 08–12 | [交易鎖定與資料列版本指南](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide?view=sql-server-ver16) | 交易、鎖與版本控制；範例必須附實際設定 |
| 11 | [SET TRANSACTION ISOLATION LEVEL](https://learn.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql?view=sql-server-ver16) | RCSI 與 SNAPSHOT 的範圍，不混淆預設值與實際庫設定 |
| 11 | [ALTER DATABASE SET options](https://learn.microsoft.com/en-us/sql/t-sql/statements/alter-database-transact-sql-set-options?view=sql-server-ver16) | 設定切換與現存連線／交易的影響 |
| 15–16 | [EF Core connection resiliency](https://learn.microsoft.com/en-us/ef/core/miscellaneous/connection-resiliency#transaction-commit-failure-and-the-idempotency-issue) | 提交未知與狀態查核的官方問題模型；不要求引入 EF Core，也不等於 ODBC 實測 |
| 引擎比較 | [SQLite isolation](https://www.sqlite.org/isolation.html)、[SQLite transaction](https://www.sqlite.org/lang_transaction.html) | 單 writer 與 SQLITE_BUSY 的語意不可類推為 SQL Server |
| 04、07 | [UNIQUE 與 CHECK](https://learn.microsoft.com/en-us/sql/relational-databases/tables/unique-constraints-and-check-constraints?view=sql-server-ver17)、[NULL 與 UNKNOWN](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/null-and-unknown-transact-sql?view=sql-server-ver17) | 單欄 nullable UNIQUE 與 CHECK 接受 UNKNOWN 的 SQL Server 語意 |
| 05–06 | [SELECT 邏輯順序](https://learn.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql?view=sql-server-ver17)、[COUNT](https://learn.microsoft.com/en-us/sql/t-sql/functions/count-transact-sql?view=sql-server-ver17) | 外連接後篩選、結果列與業務粒度；邏輯順序不等於實體計畫 |
| 13–14 | [索引設計指南](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide?view=sql-server-ver17)、[執行計畫](https://learn.microsoft.com/en-us/sql/relational-databases/performance/display-and-save-execution-plans?view=sql-server-ver17) | 估計與實際數據、維護成本；不保證指定計畫形狀 |
| 18–19 | [ALTER TABLE 約束](https://learn.microsoft.com/en-us/sql/t-sql/statements/alter-table-column-constraint-transact-sql?view=sql-server-ver17)、[備份還原](https://learn.microsoft.com/en-us/sql/relational-databases/backup-restore/back-up-and-restore-of-sql-server-databases?view=sql-server-ver17)、[VERIFYONLY](https://learn.microsoft.com/en-us/sql/t-sql/statements/restore-statements-verifyonly-transact-sql?view=sql-server-ver17) | 舊資料驗證、真實還原與媒體檢查的區別 |
| 17 | [Transactional Outbox 架構案例](https://learn.microsoft.com/en-us/azure/architecture/databases/guide/transactional-out-box-cosmos) | 案例使用 Cosmos DB；只借原子入表與 relay 思路，不能當 SQL Server 實測 |

部分查閱頁使用 `view=sql-server-ver17` 的官方現行文件。正文製作須切回／核對 SQL Server 2022 適用範圍；不可把較新版本功能默認納入 2022 基線。研究筆記中 SQL Database Projects、Azure 微服務與 Cosmos DB 是比較資料，不是新增依賴或本書必修工具。

# 實驗：先說出預期，再留下證據

本書的 SQL 檔不會刪庫、覆蓋資料或自動重置。先使用獨立的開發實例，記錄環境，再逐組實驗。管理員負責建庫與還原；一般寫回使用受限帳號。不要把既有業務庫改名當教材庫。

## 環境與第一次執行

教學基線為 SQL Server 2022 Developer、compatibility 160、RCSI OFF、SNAPSHOT OFF、delayed durability DISABLED。官方支援的是 x64 主機；Apple Silicon 上的 amd64 Docker 模擬結果只能列為該次環境的觀察。參見 [容器需求](https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-ver16)。實際 build、digest 與已驗範圍見 [驗證紀錄](verification.md)。

使用支援 T-SQL 的客戶端，開啟兩個真正獨立的連線。命令列可用 `sqlcmd`；`GO` 是它的批次分隔符，不是引擎 SQL。下例省略認證參數，請使用自己的安全登入方式，不把密碼貼進教材或 shell history：

```sh
sqlcmd -S localhost,14332 -b -i examples/00-create.sql
sqlcmd -S localhost,14332 -b -i examples/01-schema.sql
sqlcmd -S localhost,14332 -b -i examples/02-environment.sql
sqlcmd -S localhost,14332 -b -i examples/03-query-checks.sql
```

指令從下載解壓後、包含 `examples/` 的目錄執行。`-b` 要求出錯即停止；不要在忽略錯誤、跨 `GO` 繼續執行的工具模式貼整份建庫檔。若 `B02Lab` 已存在，建庫檔會拒絕，不應刪掉保護再試。初始建立時只需一個連線。

[下載整組 SQL 與實驗說明](downloads/b02-sql-labs.zip)。下表也可單獨下載：

| 檔案 | 用途 | 前提 |
|---|---|---|
| [00-create.sql](examples/00-create.sql) | 新建專用庫與設定 | 管理員；沒有同名庫 |
| [01-schema.sql](examples/01-schema.sql) | 表、約束、合成資料 | 剛建立的空庫 |
| [02-environment.sql](examples/02-environment.sql) | 記錄版本與 session 狀態 | 每個獨立連線都執行 |
| [03-query-checks.sql](examples/03-query-checks.sql) | L01 列集合斷言 | 尚未修改的 seed |
| [04-atomicity.sql](examples/04-atomicity.sql) | L02 故意違反約束並回滾 | seed；沒有既有交易 |
| [05-apply.sql](examples/05-apply.sql) | 安裝操作程序與受限 role | 管理員；schema 已有 |
| [06-operation-checks.sql](examples/06-operation-checks.sql) | L05 順序重送、異意圖、重判 | 缺陷 2 尚未被其他案例修改 |
| [07-outbox.sql](examples/07-outbox.sql) | L07 接收端替身 | 僅一次；尚未建立替身表 |
| [08-index.sql](examples/08-index.sql) | L04 萬筆探針與索引比較 | 全新連線，使用局部暫存表 |
| [09-constraints.sql](examples/09-constraints.sql) | L01 非法鍵、NULL 與跨缺陷指標 | schema 已建立 |

每個測試 session 先明確設定：

```sql
USE B02Lab;
SET IMPLICIT_TRANSACTIONS OFF;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET XACT_ABORT ON;
SET LOCK_TIMEOUT 5000;
SELECT @@SPID AS session_id, @@TRANCOUNT AS open_transactions;
```

`IMPLICIT_TRANSACTIONS OFF` 不代表 driver 沒有自行開始交易；用該客戶端的 autocommit 設定與 `@@TRANCOUNT` 一起確認。鎖等待上限與客戶端 query timeout 也不同；本書鎖例子使用 5 秒，死鎖觀察可暫用 15 秒並在結束後恢復。不要依賴固定 sleep 決定誰先誰後。

管理員先建立自己的測試登入／資料庫使用者，再加入 `B02Writer`，例如 `ALTER ROLE B02Writer ADD MEMBER [你的測試使用者];`。該 role 能讀取結果、執行 ApplyJudgment，不能直接更新歷史。前半章故意違反約束的練習需要另設開發權限；不要把那些權限也給正式匯入器。以管理員跑過不算完成受限角色驗收。

## Docker 自動驗收（全新的空容器）

若希望重跑本書同一套驗收，可用 [verify_docker.py](examples/verify_docker.py)。它只依賴 Python 3、Docker CLI 與映像內的 sqlcmd，檢查容器名稱為 `b02-sql2022` 且有 `book=b02` label，再建立 B02Lab、B02Concurrent、B02Restored。三個名字只要有一個已存在就拒絕；不刪資料替自己取得通過結果。

先把以下環境設定存成專案之外、只有自己可讀的檔案，填入自己的開發密碼；不要將檔案加入版本控制：

```text
ACCEPT_EULA=Y
MSSQL_PID=Developer
MSSQL_SA_PASSWORD=<你設定的開發密碼>
```

在 x64 Linux 主機可原生執行；Apple Silicon 需要 amd64 模擬。下列映像標籤會移動，重現本次結果請改用 [驗證頁](verification.md) 記錄的完整 digest：

```sh
docker run -d --name b02-sql2022 --label book=b02 \
  --platform linux/amd64 --memory 4g \
  -p 127.0.0.1:14332:1433 \
  --env-file /替換為/私人設定檔 \
  mcr.microsoft.com/mssql/server:2022-latest
```

等 SQL Server 日誌顯示可接受連線，且一次連線查詢成功後，再在含 `examples/` 的解壓目錄執行：

```sh
python3 examples/verify_docker.py
```

runner 在暫存目錄保存每個案例的原始輸出，開始時會印出位置。它先跑 00–09 SQL，再以真正雙連線做等待、死鎖、隔離與並行去重，最後做受限角色、部分升版與新庫還原。雙連線透過回覆標記及實際鎖等待狀態同步；短輪詢只觀察狀態，不以固定秒數猜執行順序。

此管理用 runner 從容器內的環境讀取開發密碼，不把密碼印出或放在命令列參數。`-C` 僅用於此本機隔離容器的自簽憑證。受限帳號測試以資料庫使用者模擬權限，沒有另外建立 SQL 登入。輸出的 PASS 仍只支持列出的案例；未驗項目請看驗證頁。

若只想使用已建立的容器閱讀資料，可直接開啟映像內的客戶端，不需要先在 Mac 安裝 sqlcmd：

```sh
docker exec -it b02-sql2022 bash -lc \
  'export SQLCMDPASSWORD="$MSSQL_SA_PASSWORD"; exec /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C'
```

登入後先查 `SELECT name FROM sys.databases;`，再選定自己的實驗庫；以 `GO` 送出批次，`QUIT` 離開。這條指令在容器內讀取開發密碼，不會把密碼印出。

完成後可用 `docker stop b02-sql2022` 釋放執行資源，日後 `docker start b02-sql2022` 再讀資料。停止不會清除容器資料。若要從頭重跑，可先停止舊容器、用 `docker rename` 改成尚未使用的證據容器名稱，再建立新的 b02-sql2022；先確認舊名稱、連線埠與資料確實屬於自己。本書不自動刪容器或清除 volumes。

## 合成資料與重置

| 缺陷 | 批次／批次內編號 | 歷史分數 | 目前指標 | 編修基線 |
|---|---|---|---|---|
| 1 | A／1 | 80、90 | 102 | 0 |
| 2 | A／2 | 無 | NULL | 0 |
| 3 | B／1 | 70 | 103 | 0 |

`version_no=0` 是載入這份歷史後的編修基線，不是歷史事件計數。schema 一次提供完整表，前七章只用需要的欄位；目前指標由複合外鍵保證與缺陷相符。歷史判定的時間與人工 ID 僅是 seed，不可推廣成生產 ID 分配規則。

不同實驗可能改變版本或新增歷史。先保存本輪輸出，再在另一個**新、明確命名**的實驗庫重做。若改庫名，必須同步檔案內所有 `USE`、`ALTER DATABASE` 與驗收查詢；不要只改連線字串。本書不提供一鍵刪庫重置，以免把尚未解釋的現場清掉。

## L01｜模型、查詢與約束 {#l01}

先手算 LEFT JOIN 的四列：`(1,101)、(1,102)、(2,NULL)、(3,103)`。事件數為 2／0／1；缺陷總數為 3。執行 query checks，再按 [約束章](07-constraints.md) 個別送出重複自然鍵、無主批次、分數 101、NULL 分數。每次失敗要確認是哪個約束，不把所有錯誤都叫輸入錯誤。

非法寫入使用明確交易，CATCH 記錯誤號後回滾。另試把缺陷 1 的目前指標改成 103：複合 FK 應拒絕跨缺陷指向。記錄實際錯誤與最終列數。

## L02｜中途失敗與持久化 {#l02}

執行 atomicity 檔。它先改版本，再讓分數約束失敗；捕捉 547、清理交易並驗版本還原。新開一個 session 讀同一缺陷，與失敗前對照。再做一次合法提交，在新的連線讀回。

結束客戶端後讀回、重啟伺服器後讀回、模擬儲存故障是不同測試。只做前者時，不能宣稱後兩者通過。也不可把 sequence 號碼有缺口當成回滾失敗。

## L03｜兩個執行者 {#l03}

依 [並行更新](10-concurrent-updates.md)、[隔離](11-isolation.md)、[死鎖](12-locks-deadlocks.md) 的時間線逐步選取 SQL 執行。每一步等客戶端顯示該步完成，才操作下一步；遇到鎖等待時，使用另一 session 完成解鎖步驟，不讓自動 runner 卡住。

最少保存以下四組：

1. A/B 都讀版本 0，A 條件更新成功後，B 影響列為 0。
2. A 修改但不提交；RCSI OFF 的 B 讀取等待，ON 的 B 讀到舊已提交值。兩輪使用明確核對設定的獨立實驗庫。
3. A 在 SNAPSHOT 交易中第一次讀；B 提交修改；A 第二次讀仍保持同一快照。另記錄 BEGIN 與首次資料存取的時間點。
4. A 先鎖缺陷 1、B 先鎖缺陷 3，再交叉要求另一列，觀察死鎖受害者；誰被選中不寫死。若只看到鎖逾時，該輪只能算逾時，不能標記已重現死鎖。

切換 RCSI／SNAPSHOT 需管理員確認沒有其他連線與活躍交易，並在新連線核對設定；不使用 `WITH ROLLBACK IMMEDIATE` 踢掉未知的其他工作。

## L04｜索引與計畫 {#l04}

按 [查詢計畫章](14-query-plans.md) 與 [萬筆探針](examples/08-index.sql) 在獨立測試資料上比較索引前後。保存資料量、查詢條件、相同結果的對帳、`SET STATISTICS IO ON` 訊息與實際計畫。至少比較稀少值與大量命中值，不能只挑有利條件。

估計列數、實際列數與 logical reads 各回答不同問題。耗時受快取與同機負載影響，若只量一次，不做速度倍數結論。

## L05｜並行相同操作與重判 {#l05}

先跑順序 operation checks，再在新 seed 以兩個 session 測並行。程序拒絕既有交易，因此不要用外層 BEGIN 包住 `EXEC ApplyJudgment` 假裝測延遲提交。

為建立可見同步點，A 手動執行程序首次分支的交易本體（保留相同 operation ID 的 UPDLOCK/HOLDLOCK 查詢、條件更新、判定與 Operations INSERT），停在 COMMIT 前。B 用同 ID、同意圖呼叫完整程序。B 應等待；在 5 秒上限內讓 A 提交，或故意讓 B 超時以觀察另一條路徑。再以新連線按原 ID 查核；一次只改一個故障點。

若不想手動複製程序，另一種可行測試是兩個客戶端同時起跑，但它只能證明該輪結果，不能保證真的有重疊。紀錄有無等待或同步證據，不能把快速先後執行當並行。

驗收：一個操作、一筆新判定、同一結果；同 ID 異意圖拒絕且不產生其他判定。再新 ID 合法重判，最後重送舊 ID，舊結果應保持不變。受害者、逾時或唯一約束衝突都需先清理交易，再查核，不能直接當成功。

## L06｜成功回覆丟棄與真實斷線 {#l06}

| 案例 | 做法 | 必留證據 |
|---|---|---|
| 應用層忽略成功結果 | 執行成功程序，但模擬客戶端未保存成功；原 ID 重入 | 第一次伺服器已成功、第二次無重複 |
| 提交前連線終止 | 隔離主機中斷測試連線，重連查核 | 原 session 結束／回滾證據、無結果列 |
| 提交窗口實際失聯 | 可觀察的網路代理切斷回覆路徑 | client 診斷、切斷時間、伺服器新連線查核 |

本版的 [verify_network.py](examples/verify_network.py) 在 Docker Desktop 透過 `host.docker.internal:14339` 連到只監聽本機的 TCP 代理，再轉往 14332。先跑完 verify_docker.py，再執行 `python3 examples/verify_network.py`；它要求尚未做過同一個故障案例，不覆蓋舊紀錄。需要 Python 標準庫與 Docker Desktop 的主機轉接能力，其他 Docker 網路拓樸未驗證。

第一個案例攔截真正的伺服器回覆並關閉 TCP；新連線查到已提交操作，原 ID 重送不新增歷史。第二個案例在明確交易已暫存資料、尚未送 COMMIT 時關閉 TCP，依 connection ID 與 transaction ID 確認原工作結束，再驗回滾。SPID 會重用，不以它單獨判定身分。沒有預設必然 SQLSTATE，也沒有宣稱涵蓋每個提交內部窗口；重連失敗時仍保留 unknown。

## L07｜通知與接收端替身 {#l07}

`07-outbox.sql` 只驗「接收成功但發送端沒記確認，重送後接收端不重複生效」。兩張表位於同一引擎，但提交分開，沒有真的呼叫遠端服務。

進階作業：把 Outbox INSERT 加到 ApplyJudgment 首次分支 COMMIT 前，分別在事件寫入前後製造失敗；判定、操作、事件必須一起回滾。完成之前，不把局部替身測試寫成「端到端 Outbox 已驗證」。

## L08｜升版與還原 {#l08}

依 [升版](18-migrations.md) 加可空來源欄、分批補資料、中途停止再進入，保存舊查詢與新查詢結果。先驗證舊寫入者是否仍能 INSERT，再決定何時收緊 NOT NULL；資料填滿不代表舊程式已退出。

依 [還原](19-restore.md) 備份並還原到新庫。實體檔名必須來自 FILELISTONLY，路徑是資料庫伺服器上的路徑；不能拿 Mac 的本機路徑代替容器內路徑。核對列集合、目前指標與操作對帳，另記備份時點、可恢復資料範圍與實際耗時。VERIFYONLY 不算實際還原。

## L09｜保留期與到期契約 {#l09}

先維持不清理的基線。再為獨立實驗設計可驗證的 request epoch／到期機制，測窗口內原 ID 重入、窗口外查詢、清理後舊請求。到期 ID 應進入拒絕或人工查核，不能因操作表查不到就當新操作。讀者需實作此擴展；本版 ApplyJudgment 沒有期限欄位，因此不允許搭配自動清理。

## 每次填寫的紀錄

```text
案例／日期：
引擎版本、映像digest、OS/CPU、client/driver：
資料庫／compatibility／RCSI／SNAPSHOT／delayed durability：
session isolation／autocommit／XACT_ABORT／LOCK_TIMEOUT：
初始資料與預測：
A/B同步點、實際SQL與診斷：
新連線讀回結果：
XACT_STATE／@@TRANCOUNT與清理：
通過、失敗或仍未知：
本輪沒有測到什麼：
```

[回到全書地圖](00-map.md) · [目前驗證紀錄](verification.md)

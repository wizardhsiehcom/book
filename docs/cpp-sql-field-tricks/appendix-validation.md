# 本版實測與出版驗證

日期：2026-09-22。這是一輪合成教學實驗，不是效能 benchmark、正式專案驗收或完整 driver matrix。全部程式都只在本書專用容器／本地輸出目錄操作。

## 實際版本

| 項目 | 本次使用 |
|---|---|
| 主機編譯 | Windows x64；VS 2022 Professional；MSVC 19.44.35227.0，C++17 |
| ODBC | Windows ODBC Driver 17 for SQL Server 17.10.6.1 |
| Docker | Desktop 4.73.1；Engine 29.4.3；Linux amd64 |
| SQL Server | 2017 RTM-CU31-GDR，14.0.3550.4，Developer；Ubuntu 18.04.6 |
| DB 條件 | FieldTricksLab；compatibility 140；READ_COMMITTED_SNAPSHOT=0 |
| 映像 digest | `sha256:fbf79e0fea596dec4d91962654cbc217ce17b2c6c206130d57b6685a6a43e992` |
| 容器 | book-cpp-sql-lab；127.0.0.1:15439；無 host mount；3 GB／2 CPU |
| Python／uv | 專案 Python 3.14.5；uv 0.11.23 |

此處記的是可重查的環境，不建議新專案因本書而採用舊引擎。不同版本重跑要記自己的數據；不要覆寫原觀察。

## 已執行

下表為初版 SQL 實驗與重播工具的紀錄；本次可讀性回修沒有改動 `sql_lab.cpp`，也沒有重跑或擴充 Docker 故障模型。新增的小程式與文字回修驗證另列於下方。

| 實驗 | 觀察／支持範圍 |
|---|---|
| C++ build | 兩個 target，`/W4 /WX` 編譯通過 |
| fixed／cli／fixture | 同值同核心結果；value=9 時 score=18、accepted=false |
| field_lab 回歸 | 7 個 unittest：三入口、門檻、非法輸入、拒寫庫、保留既有輸出、snapshot、格式契約 |
| source 開關與產物 | false 重建後 fixed 拒絕、CLI banner off；保留的舊 on 產物仍接受 fixed；最後恢復 true 並重建 |
| diff | 9 個 unittest：重排、NULL／缺欄／空字串、重複 key、重複 JSON 欄位、型別、增刪、無效輸入；另明示空集合與非業務 schema 比較邊界 |
| 真 DB mapping | NULL note 的合成列進同一核心，score=20 |
| 診斷 | 不存在欄位：42S22／207；連線資訊可有兩筆 |
| 欄位 | NULL indicator=-1、空字串=0；長字串截斷 01004，buffer 只得 abcd；64-bit／單一中文字元通過 |
| batch | 先 columns=0/count=1，再 columns=1/count=-1，fetch 得 7 |
| bind | 活 buffer 在 bind 後 10→20，execute 得 20 |
| rows | 斷言 count 1／0／1；零列回 SQL_NO_DATA；回滾後以獨立連線核對原始值 |
| rollback | autocommit 後 rollback 仍是 5；manual 寫 6 回滾得 5，再恢復 NULL |
| lock | 約 1002 ms，1222；斷言 native code 與 800–6000 ms 界線，不把其他 SQL_ERROR 算通過；A 釋放後 B 成功，再恢復 NULL |
| timing | 最後一輪 baseline／注入／baseline 的 core_ms 為 0／127.875／0（微秒解析度再轉毫秒）；不是計算速度或保證值 |
| retry | 獨立 job_id 15、chapter-15 操作；首次同交易提交後新連線查核，第二次核對意圖與目前值後 skip；不受其他案例的 job_id 1 清理影響 |

初版 rows 實驗失敗，原因是通用 checker 把零列 `SQL_NO_DATA` 誤判成 execute 失敗；已查官方契約、局部修正與重跑。這段保留在第 10 章，不把修正前的程式藏成「第一次就懂」。

收尾查核：job_id 1 的 score 為 NULL，job_id 15 的 score 為 20，chapter-15 操作紀錄存在，`CppSqlFieldLab` 未結交易數為 0。專用容器已停止但未刪除；其他既有容器未改動。初版重試留下的舊示範紀錄保留作實驗歷史，不拿重複執行的 skip 冒充全新首次提交。

## 未完成的外推，不混成成果

沒有重現來源作者的私有事故、MARS 遠端倍率、ADO.NET 池清理、SQLite 負載；沒有以真網路切斷重現 commit outcome unknown；沒有正式通知服務、跨系統 exactly-once、並行 operation-ID 去重驗證。

第 09 章的固定映射是設計練習，未加入獨立 CLI 測試；第 14 章是對照流程，不是已量到的一組效能修復。第 17 章只驗本書產物的開關，不代表正式服務可交付。完整 Unicode、任意長字串 reader、DECIMAL／時區、rowset 和非同步 ODBC 都不在本版驗證範圍。

## 出版驗證

初版 MkDocs strict build 通過，當時共有 23 個一般閱讀頁（另有 404）、17 個折疊判斷題、9 張 Mermaid。一般頁面的本地連結、引用資源、下載檔與所有頁面的回書庫連結另行檢查；工作筆記不在網站或搜尋索引，沒有出版 exe／PDB。

Chrome 153 headless 實際載入全部 9 張圖，確認有渲染 SVG 且沒有錯誤圖；示範章另看截圖。初版的 pre/code 容器會把 code 標籤交給共用初始化器，已只在新書改為 div formatter；未修改其他書籍的配置。圖加白底以免深色閱讀模式看不清連線。

Mermaid 仍由外部 CDN 載入，因此離線不保證有圖。404 的一般資源使用伺服器根路徑，本輪沒有驗任意深層錯誤網址的路由；正常 file 閱讀頁與回書庫連結不受此項影響。未做所有螢幕尺寸與瀏覽器矩陣。

## 可讀性回修：從手動入口開始

同日依讀者回饋改寫教學順序，新增「接手這支程式」開場與 `first_job.cpp`，保留原先的 `field_lab`、`sql_lab` 能力界線。首讀路線不再跳章，前四章先不建資料庫。

| 新增／重驗項目 | 實際結果 |
|---|---|
| 公開建置腳本 | 完整模式建立三個 exe；`build.cmd first` 單獨建置小程式，均以 `/W4 /WX` 通過 |
| 正文修改片段 | 8 個測試從第 02–03 章取出實際片段，編譯互動、固定 10／9、開關 on／off 版本 |
| 改碼但未建置 | 測試先編譯 on，改 source 為 off 而不建置，舊 exe 仍走 fixed；重建後改走鍵盤 |
| 門檻與錯誤 | 10→20／true，9→18／false；無法解析整數與超範圍輸入被拒絕 |
| 既有回歸 | field_lab 的 7 個測試與 diff 的 9 個測試重新通過，合計 24 個 |
| 出版結構 | 新增一頁與一圖；24 個一般閱讀頁、17 個判斷題、10 張 Mermaid |

新小程式只有終端輸出，沒有資料庫連線，不代表已完成原服務的安全隔離。`std::cin` 練習只示範簡單整數讀取，不把它當完整請求格式驗證器；例如它不要求整行只能有一個整數。SQL 匯出、真實斷線與並行去重仍沿用前面的未驗界線。

### 交接後的 SQL 章節續修

同日續修第 05–10、14–17 章，把命令前的預測、原碼小片段與輸出逐段接起來；第 12–13 章另拆解等待／計時順序。沒有改動 `sql_lab.cpp` 或 SQL 案例行為，也沒有再次啟動 Docker 跑資料庫實驗。

依原碼校正三個容易過度解讀的地方：`diag` 的 PASS 只要求收到 SQL_ERROR，SQLSTATE／native code 仍需比對；`lock` 的清理 UPDATE 後沒有另做 NULL 讀回；`timing` 沒有 score 或時間門檻斷言，PASS 不是數值驗收。第 09 章仍為未實作的設計練習，第 15 章仍不是網路斷線或並行去重實驗。

續修後重新完成公開腳本的三個 C++ target 建置、全部 24 個測試與 MkDocs strict build。出版檢查為 25 個 HTML（含 404）、24 個一般閱讀頁、17 個折疊判斷題、10 張 Mermaid，本地連結／資源檢查 `errors=[]`；Chrome headless 的全部 10 圖均為 `rendered=1 error=0`。這輪沒有增加頁數或圖數，404 路由、跨瀏覽器與離線 CDN 限制仍如上所述。

編譯、連結與渲染檢查可以確認範例可操作，不能直接證明目標讀者已理解。是否能把招式搬回自己的專案，仍需實際閱讀與章末判斷題的回饋。

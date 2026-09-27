# 驗證紀錄

日期：2026-09-26。**21 章正文與網站完成；下列 SQL／故障案例已實測，整本書仍有明列的未驗範圍。** 教材推導、網站檢查與資料庫實驗是不同證據。

[下載原始驗證輸出](downloads/b02-verification.zip) · [下載 SQL 與驗收器](downloads/b02-sql-labs.zip)

## 實際環境

| 項目 | 本次值 |
|---|---|
| 引擎 | SQL Server 2022 RTM-CU27，16.0.4295.3，KB5104824 |
| Edition／OS | Developer Edition，Ubuntu 22.04.5 LTS，映像內 x64 |
| 實際主機 | Apple Silicon ARM Mac；Docker Desktop amd64 模擬 |
| Docker Engine | 29.2.0，VM 架構 aarch64 |
| 容器 | b02-sql2022，記憶體上限 4 GiB；127.0.0.1:14332 → 1433 |
| sqlcmd | 18.6.0002.1 Linux；mssql-tools18 套件 18.6.2.1-1 |
| ODBC driver | msodbcsql18 18.6.2.1-1 |
| Compatibility | 160 |
| 基線庫 | RCSI OFF、ALLOW_SNAPSHOT_ISOLATION OFF、delayed durability DISABLED、FULL recovery |
| 並行對照庫 | 先 RCSI OFF；明確關閉測試連線後改 RCSI ON、ALLOW_SNAPSHOT_ISOLATION ON |
| Session | 並行測試明列 READ COMMITTED、IMPLICIT_TRANSACTIONS OFF、XACT_ABORT ON；SNAPSHOT 對照另設定 |
| 等待 | 一般雙連線 10 秒、逾時反例 500 ms、死鎖 15 秒；操作程序內 5 秒 |

完整映像識別：

```text
mcr.microsoft.com/mssql/server@sha256:4402d880dd4c34bfa7d8705e56a86cd6c88da80a1f6bbbe741f999e76264a090
```

`02-environment.sql` 保存的是新連線原始選項，其 LOCK_TIMEOUT 可為 -1；各故障測試再明確設定上表值，不把原始預設當成案例中的設定。sqlcmd 沒有持續包住全部腳本的外層交易；只有腳本明列的 BEGIN／COMMIT 建立交易。

SQL Server 官方容器支援 x86-64 主機，本次 ARM 模擬結果不等於受支援 x64 平台或正式儲存的驗證，參見 [官方需求](https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-ver16)。

## 已跑過的資料庫案例

| 組別 | 實際觀察 | 能支持的結論 |
|---|---|---|
| L01 查詢 | 3 個缺陷、3 個事件、LEFT JOIN 4 列；每缺陷事件數 2／0／1；NOT IN 含 NULL 不留候選列 | 指定 seed 與查詢斷言成立 |
| L01 約束 | 重複自然鍵 2627；無主批次 547；NULL 分數 515；跨缺陷目前指標 547；第二個 UNIQUE NULL 2627；nullable CHECK 接受 NULL | 指定約束拒絕／接受符合預期 |
| L02 回滾 | 非法分數觸發 547、清理前 XACT_STATE=-1；缺陷 2 版本仍 0、判定 900 不存在；後續新連線從版本 0 成功提交 | 中途失敗沒有留下半套版本／判定 |
| L03 條件更新 | A 以舊版本更新 1 列；B 以同舊版本更新 0 列 | 單列過期寫入可被偵測 |
| L03 等待／死鎖 | 分別取得 1222 與 1205；活躍交易均清理 | 兩種故障被分開分類，沒有把逾時算死鎖 |
| L03 RCSI | A 未提交時讀到 0；A 提交後下一語句讀到 1 | READ COMMITTED＋RCSI 的語句範圍版本觀察 |
| L03 SNAPSHOT | BEGIN 之後、首次資料讀取前的更新可見，首次讀 2；另一次更新後仍讀 2 | 指定雙連線時間線的交易快照成立 |
| L04 索引 | 萬筆探針，命中 100 列：logical reads 36 → 2；95% 命中的聚合：無索引 36、有索引 42 | 同結果下的讀取量差異；不推論生產加速倍數 |
| L05 重入 | 順序重送、NULL 輸入、同 ID 異意圖／尾端空白、版本衝突、合法重判後查舊操作均通過 | 舊結果保持 80，目前值為 90，沒有重複判定 |
| L05 並行 | DMV 捕捉 LCK_M_U 等待後才讓 A 提交；B 取得同一操作結果，只新增一次 | 有真正重疊的同 ID 去重，不是先後跑兩次 |
| L05 權限 | B02Writer 可執行程序；直接改歷史表得到 229 | 資料庫 role 的指定寫入邊界成立 |
| L06 提交後回覆遺失 | TCP 代理丟棄真正伺服器回覆並關閉通道；客戶端得到 TCP Provider 0x2746／Communication link failure；新連線查到已提交，原 ID 重入不重複 | 真實傳輸中斷下的已提交案例；不是應用層忽略成功結果 |
| L06 提交前斷線 | 暫存版本、判定、指標、操作後，尚未送 COMMIT 就關閉 TCP；原 connection／transaction ID 消失，資料恢復 | 真實斷線下的未提交案例 |
| L07 局部替身 | 接收效果已寫、發送確認未寫，再投遞後效果仍一列 | 只支持同庫接收替身的去重；不是端到端 Outbox |
| L08 升版部分 | 加可空來源欄、分批 backfill、再入影響零列；舊程序仍可新增 NULL | expand／backfill 與指定舊 writer 相容；尚未驗新版 writer＋contract |
| L08 還原 | COPY_ONLY 完整備份、VERIFYONLY、FILELISTONLY、還原新庫、CHECKDB；Defects／Judgments／Operations 全欄雙向 EXCEPT 無差異 | 小型合成庫的實際還原與三表對帳通過 |

最終版自動驗收從新的 `B02FinalLab`／`B02FinalConcurrent`／`B02FinalRestored` 名稱完整跑過；僅替換庫名、備份檔名與證據輸出位置，SQL 與驗收邏輯和隨書版本相同。先前的 B02Lab、B02Check 系列保留在同一容器，沒有為了重跑而刪除現場。

最終還原加 CHECKDB、三表比對與客戶端啟動約 **0.57 秒**。資料很小，且這不是完整服務恢復流程，所以不能作為實際系統 RTO 或 SLA。原始 XML 計畫、錯誤訊息與每組結果都在證據包；不以一次牆鐘時間推論索引性能。

## 驗證時修正的問題

1. **新增欄位的編譯批次**：ADD 與 UPDATE 新欄位放同一批次得到 207。分成兩個 batch 後通過；正文加入 GO／driver 分次送出的區別。
2. **驗收標記的通道**：RAISERROR 訊息可先於 sqlcmd 輸出的結果列到達。改為結果列標記並以 line buffering 輸出，才把它當成結果已讀完的屏障。
3. **SPID 重用**：第一次以 session_id 判斷舊工作消失，誤把新查核連線當舊連線。實測曾是 72→72；最終輪也觀察到 58→58。改比 connection ID 與 transaction ID，才正確確認舊工作結束。

## 出版檢查

| 檢查 | 結果與範圍 |
|---|---|
| MkDocs strict build | 28 頁：21 核心章＋7 支援頁 |
| 本機相對連結／錨點 | 作者頁面、附件與來源索引均檢查；外部網站不當成本機檔案 |
| 瀏覽器 | 28 頁載入無 JavaScript page error；10 張 Mermaid 產生 SVG |
| 閱讀 | Chromium 入口頁及第 11 章桌面視覺檢查、第 15／16 章手機視覺檢查；390px 窄版無整頁溢出 |
| 下載 | SQL、兩支驗收器與實驗說明打包；ZIP CRC 與附件存在性檢查 |

這些是本機出版檢查；外部來源網站沒有逐一做可用性監控，404 的實際部署根路徑另待部署環境驗證。

## 沒有完成、不能延伸宣稱的部分

- 官方支援的 x64 主機、實際產品負載、伺服器崩潰／斷電／儲存故障與時間點還原。
- SNAPSHOT 跨列 write skew 的實作驗收、所有隔離異常與所有 driver timeout 分支。
- 每個 COMMIT 內部窗口、無限網路分割或副本延遲；本次只驗兩個受控 TCP 窗口。
- 完整 relay、外部服務接收、Outbox 入表與寫回程序的整合故障驗收。
- 新版來源 writer、contract、部署回版與真實 backfill 程序崩潰。
- L09 期限憑證／epoch 服務與清理。現有 ApplyJudgment 不提供清理後的去重保證，因此不能搭配自動刪除 Operations。

後續讀者可以按 [實驗矩陣](labs.md) 補證據；未測的欄位保持未測，不用章節已寫完來代替。

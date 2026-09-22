# 05｜先別只回 false，把那幾筆診斷印出來

上層收到 `false`，你不知道連線失敗、SQL 欄位錯了，還是取值被截斷。這時先不用換 logging 框架：把失敗發生在哪個 API，以及那個物件上的診斷保存下來。

## 從檔案重播，走到 SQL 的第一個失敗點

[上一章](04-snapshot.md)已把核心輸入存成檔案。接上 DB 以後，在 `JobRow` 出現以前，還多了一段「連線 → 送出 SQL → 讀取欄位」。如果這段只回傳 `false`，你連要停在哪裡都不知道。

先完成[準備頁第二層](appendix-lab.md#sql-lab)的建置、隔離庫與 `mapping` 對照。以下只讀現成的 `sql_lab.cpp` 並執行 `diag`，**不必先修改或重建程式**；日後把診斷搬回自己的原始碼時，才要重建自己的 exe。

打開 `sql_lab.cpp`，先認出三個物件，不用背完 ODBC：

| 原碼位置 | 本章用途 | handle 是什麼 |
|---|---|---|
| `Connection::env` | environment：設定這個 ODBC 使用環境，例如 API 版本 | `SQLHENV` 是交給 API 辨識環境的代號 |
| `Connection::dbc` | connection：連到一個資料庫工作階段 | `SQLHDBC` 辨識這條連線 |
| `Statement::h` | statement：在連線上執行 SQL、保存讀取結果的位置 | `SQLHSTMT` 辨識這次敘述的物件 |

這些 handle 不是 SQL 文字，也不是查出的 row。你可以先把它們想成需要正確型別與生命週期的資源代號；失敗訊息也附在對應資源上，不是一份全域 `last_error`。

## 只把查詢換成一個必定錯的欄位

在 `main` 的 `diag` 分支，現成程式已做了以下四件事。這是將原碼同一行拆開排版的實際片段，不是要另貼進 `main` 的新功能：

```cpp
Statement s(c);
const auto rc = s.exec_raw("SELECT no_such_column FROM dbo.Jobs");
diagnostics(SQL_HANDLE_STMT, s.h);
expect(rc == SQL_ERROR, "expected missing-column failure");
```

第一行在已連線的 `c` 上建立 statement。第二行的 `SELECT` 要求讀取 `Jobs` 的 `no_such_column` 欄位；這個合成表刻意沒有它。`exec_raw` 呼叫 `SQLExecDirectA`，把 SQL 送出執行（execute），但不先把錯誤轉成 exception，因此呼叫端還能檢查原始回傳碼 `rc`。

第三行立刻讀 **statement** 的診斷，因為失敗的是這份 SQL，不是建立連線。第四行則反過來要求「這次必須失敗」：如果查詢意外成功，實驗才算失敗。這裡不會取得 row，也不會呼叫核心或寫回 score。

執行前先預測：連線應成功；查詢應因不存在的欄位失敗；最後應是案例 `PASS`，而不是「查詢成功」。從存有範例檔案與 `build` 的 PowerShell 工作目錄執行；若你用的是別處，請替換第一行：

```powershell
Set-Location D:\scratch\cpp-sql-lab
.\run-sql-case.ps1 diag
```

腳本會核對專用容器與連接埠，再啟動 `sql_lab.exe diag`；不是逐行暫停的 debugger。以下按程式先後拆解整次輸出。

## 先分清連線資訊，再讀查詢錯誤

| 輸出線索 | 哪裡印的 | 看到它代表什麼 |
|---|---|---|
| `stage=connect rc=1` 與隨後診斷（本版曾出現） | `Connection` 裡的 `check()` | 連線成功但附帶資訊；不是查詢失敗 |
| `target=localhost:15439/FieldTricksLab user=book_lab case=diag` | `main` | 已連上指定合成庫，即將跑 diag |
| `diag=1 state=42S22 native=207 ...` | `diag` 分支的 `diagnostics()` | 本版 driver／SQL Server 回報欄位不存在 |
| `PASS` | `main` 結尾 | 收到預期的 `SQL_ERROR`，不是證明 SQL 可用 |

`SQLSTATE` 是五字元分類碼；`native` 是資料庫或 driver 的原生代碼；`text` 是人讀的說明。同一個分類不代表所有環境的文字都相同。程式目前只斷言 `SQL_ERROR`，**沒有**把 `42S22`／`207` 寫成自動驗收條件；讀者仍要核對診斷是不是預期的欄位錯誤。

若沒看到 target，先查連線或腳本檢查；若 target 不符，就停止。不要看到「欄位不存在」便立即修改 schema，因為連錯資料庫也可能有同樣症狀。

## 為什麼必須立刻讀，而且要讀多筆？

`diagnostics()` 裡真正取出一筆紀錄的是這個原碼片段；`type`、`handle` 來自呼叫端，`index` 從 1 開始：

```cpp
SQLRETURN rc = SQLGetDiagRecW(type, handle, index, state, &native,
    message.data(), static_cast<SQLSMALLINT>(message.size()), &length);
if (rc == SQL_NO_DATA) break;
```

這裡的 `SQL_NO_DATA` 表示「沒有下一筆診斷」，不是「查詢沒有資料」。外層迴圈逐筆增加 `index`，所以不只讀第一筆。範例用寬字 API 取得訊息，再轉 UTF-8；訊息 buffer 不夠且長度在可處理範圍內時，擴大後重讀同筆。極長訊息仍有上限，不是通用無損日誌框架。

`diag_rc` 是**讀取診斷這個動作**的回傳碼，不是原本執行 SQL 的 `rc`。後續會操作同一 handle 的其他 ODBC API 可能換掉診斷，因此保留順序必須是：存原始 `rc` → 讀對應 handle 訊息 → 再清理或前進。

本版連線成功時曾附資料庫 context 與語言設定兩筆資訊。這就是 `SQL_SUCCESS_WITH_INFO`（數值 1）：不是一律失敗，也不能一律忽略。[下一章](06-data-contract.md)會看到它也可能表示字串沒讀完整。不要用「非零就是失敗」取代各 API 的契約；execute 與 fetch 的 `SQL_NO_DATA` 也有不同意思，第 10 章再接上。

## 有訊息之後，下一步更小

若是 connect，核對端點、driver 與帳號範圍；若是 execute，先留 SQL 形狀與必要參數型別；若是 get-data，再比欄位與 indicator。診斷不能單憑一個 state 就授權重試：提交結果也可能未知。

正式 log 不應照抄本實驗所有文字。資料庫錯誤可能包含值或物件名稱；保留階段與遮罩後摘要，詳細輸出受控開啟。逐列列印也會改變效能，調查完再決定留下多少。

## 換個情境想一次

原本 execute 失敗，最後只看到 cleanup 的錯誤。你要先加 retry，還是改觀測位置？

<details><summary>核對判準</summary>

先在 execute 後立刻複製診斷；cleanup 另列狀態，不能覆蓋根因。原始與清理失敗都要保留，但不要把最後一筆當成全部。

</details>

來源：[SQLGetDiagRec](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlgetdiagrec-function)。範例不是通用錯誤框架，極長診斷保留截斷狀態；[驗證紀錄](appendix-validation.md)。

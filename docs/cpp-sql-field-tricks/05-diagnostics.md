# 05｜先別只回 false，把那幾筆診斷印出來

上層收到 `false`，你不知道連線失敗、SQL 欄位錯了，還是取值被截斷。這時先不用換 logging 框架：把失敗發生在哪個 API，以及那個物件上的診斷保存下來。

## 為什麼要緊貼呼叫？

ODBC 的 environment 管理環境，connection 管理連線，statement 執行 SQL 與讀取結果。各有自己的 handle，也各有診斷。它不是一個永久保留的全域 `last_error`；後續使用同一 handle 的 API 可能覆蓋上一批訊息。

因此順序是：保存原始回傳碼 → 讀對應 handle 的診斷 → 再前進或清理。這就像 debugger 停住後先看還在作用域內的變數，別等堆疊都離開才問當時是多少。

## 先故意查一個不存在的欄位

依[準備頁](appendix-lab.md)啟動專用庫並編譯；此章是新增觀測程式，需要重建。

```powershell
.\run-sql-case.ps1 diag
```

本版對 `SELECT no_such_column FROM dbo.Jobs` 得到 SQLSTATE `42S22`、native code `207`。這些是指定組合的實測，不保證所有語言設定會有同一段文字。先核對 target 與 case，再看錯誤；不要把連錯 DB 的「欄位不存在」當成 schema 應該立刻修改的證據。

## 不只一筆，也不只失敗才有

注意連線成功時，本版仍有 `rc=1`，並附兩筆資訊：資料庫 context 與語言已設定。`SQL_SUCCESS_WITH_INFO` 不是一律失敗，也不是一律可忽略。到了[下一章](06-data-contract.md)，同樣的成功帶資訊可能表示值被截斷。

`diagnostics()` 從 record 1 讀到 `SQL_NO_DATA`，保留 state、native、text；文字 buffer 不夠就擴大重讀同筆。範例用寬字 API 再轉 UTF-8，避免本機語系訊息在 log 變亂碼。你真正需要的不是更多行，而是還原失敗的階段。

```cpp
const auto rc = SQLExecDirectA(stmt, sql, SQL_NTS);
// 在其他會碰 stmt 的 ODBC API 之前：
if (rc == SQL_ERROR || rc == SQL_SUCCESS_WITH_INFO)
    diagnostics(SQL_HANDLE_STMT, stmt);
```

這是位置示意，不是完整回傳碼處理。execute 的 `SQL_NO_DATA`、fetch 的 `SQL_NO_DATA` 有不同意思，第 10 章會用實際踩坑接上；不要把所有 API 套同一張「非零就是失敗」表。

## 有訊息之後，下一步更小

若是 connect，核對端點、driver 與帳號範圍；若是 execute，先留 SQL 形狀與必要參數型別；若是 get-data，再比欄位與 indicator。診斷不能單憑一個 state 就授權重試：提交結果也可能未知。

正式 log 不應照抄本實驗所有文字。資料庫錯誤可能包含值或物件名稱；保留階段與遮罩後摘要，詳細輸出受控開啟。逐列列印也會改變效能，調查完再決定留下多少。

## 換個情境想一次

原本 execute 失敗，最後只看到 cleanup 的錯誤。你要先加 retry，還是改觀測位置？

<details><summary>核對判準</summary>

先在 execute 後立刻複製診斷；cleanup 另列狀態，不能覆蓋根因。原始與清理失敗都要保留，但不要把最後一筆當成全部。

</details>

來源：[SQLGetDiagRec](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlgetdiagrec-function)。範例不是通用錯誤框架，極長診斷保留截斷狀態；[驗證紀錄](appendix-validation.md)。

# C++＋SQL 現場招式：ODBC 第一手來源審計

查核日期：2026-09-22（Asia/Taipei）  
用途：供第 05–10 章寫作與實驗設計使用；本檔是來源審計，不是章節正文。  
查核範圍：Microsoft Learn 的 ODBC API／開發文件，以及 SQL Server 的 `COUNT` 文件。  
本輪沒有編譯 C++、執行 SQL、安裝 driver、建立資料庫或跑 driver matrix；「確定」指官方文件直接支持，「工程判斷」指從契約推出的安全寫法，「未確定」指必須在目標 driver／DB 組合實測。

## 先收斂的結論

| 邊界 | 官方文件能確定的機制 | 最容易寫錯的地方 |
|---|---|---|
| `SQLGetDiagRec` | 診斷附著在 handle；`RecNumber` 從 1 起讀 status record；下一個會使用同一 handle 的 ODBC 呼叫可能覆蓋舊診斷。 | 只在 `SQL_ERROR` 時讀、只讀第一筆、或先呼叫別的同 handle API 才讀，會丟失證據。`SQLGetDiagRec` 自己回 `SQL_SUCCESS_WITH_INFO` 時，通常是訊息 buffer 太小，不是原始 API 的新錯誤。 |
| `SQLGetData` | 先定位到 row，再依 C target 取值；`StrLen_or_IndPtr` 可回長度、`SQL_NULL_DATA` 或 `SQL_NO_TOTAL`；可變長資料可分段讀。 | 把 `NULL` 當空字串／零、把 `SQL_SUCCESS_WITH_INFO` 當失敗、忘記字串終止字元、或把固定長度資料當成可分段資料。 |
| `SQLBindParameter` | `ParameterValuePtr` 與 length/indicator 都是 deferred pointer；driver 在 `SQLExecute`／`SQLExecDirect` 時才取資料。 | bind 呼叫成功就以為資料已複製；暫時物件、離開作用域、搬動／重配 storage 或 indicator 後才 execute。 |
| Multiple Results | result 有 result set 與 row count 兩類；`SQLMoreResults` 會丟掉目前 result 並移到下一個，沒有下一個時回 `SQL_NO_DATA`。 | 只處理第一個 SELECT、未 fetch 完就呼叫 `SQLMoreResults`、或把每個 DML count 都當成一定可得且一定逐句回傳。 |
| `SQLRowCount` | 主要用於 `UPDATE`／`INSERT`／`DELETE` 與特定 positioned／bulk 操作；affected row count 不可得時可為 `-1`。 | 用它取得 `SELECT` 的列數；它對 SELECT 是 driver-defined，不能取代 `SELECT COUNT(*)`。 |
| `SELECT COUNT` | 在 ODBC 端是要 fetch 的 result set；SQL Server 的 `COUNT(*)` 計 row，`COUNT(expression)` 不計 NULL expression，`COUNT_BIG` 回 `bigint`。 | 把 `SQLRowCount` 當 count query、把 `COUNT(column)` 當 `COUNT(*)`、或以 C++ `int` 無條件承接可能溢位的 SQL Server `COUNT`。 |

## 1. `SQLGetDiagRec`：診斷有觀測窗口，不是全域錯誤字串

### 官方確定

依 [SQLGetDiagRec Function](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlgetdiagrec-function?view=sql-server-ver17) 與 [Using SQLGetDiagRec and SQLGetDiagField](https://learn.microsoft.com/en-us/sql/odbc/reference/develop-app/using-sqlgetdiagrec-and-sqlgetdiagfield?view=sql-server-ver17)：

- 診斷資訊附著在 environment、connection、statement 或 descriptor handle；`SQLGetDiagRec` 讀的是該 handle 最近一次相關 ODBC 呼叫的診斷。
- status record 從 `RecNumber = 1` 開始；header record 是 record 0，不能用 `SQLGetDiagRec` 讀，需用 `SQLGetDiagField`。若要先知道筆數，可從 header 的 `SQL_DIAG_NUMBER` 取得。
- 一個 ODBC 呼叫可以產生零或多筆診斷。通常在前一個呼叫回 `SQL_ERROR` 或 `SQL_SUCCESS_WITH_INFO` 後立即讀取，但文件也說任何 ODBC 呼叫後都可能查診斷。
- 同一 handle 上再呼叫另一個 ODBC API（`SQLGetDiagRec`、`SQLGetDiagField`、`SQLError` 除外）會使前一批診斷遺失。因此診斷擷取要緊貼原始呼叫，並把原始 `SQLRETURN` 一起保存。
- `SQLState` 要容納五個字元加結尾 `NULL`；`TextLengthPtr` 回報可用訊息長度，不含結尾字元。
- `MessageText == NULL` 時，文件仍允許透過 `TextLengthPtr` 取得可用訊息長度；這可用於設計兩階段讀取，但實際 buffer 配置仍是呼叫端責任。
- `SQLGetDiagRec` 自己的回傳碼有 `SQL_SUCCESS`、`SQL_SUCCESS_WITH_INFO`、`SQL_ERROR`、`SQL_NO_DATA`、`SQL_INVALID_HANDLE`：
  - `SQL_SUCCESS`：本筆診斷已取回。
  - `SQL_SUCCESS_WITH_INFO`：`MessageText` buffer 太小，訊息被截斷；這個函式本身不會新增診斷 record。應比較 `BufferLength` 與 `TextLengthPtr`，不要把它當成「原始 SQL 呼叫又失敗」。
  - `SQL_NO_DATA`：指定的正 `RecNumber` 超過現有診斷筆數，或該 handle 沒有診斷。
  - `RecNumber <= 0`、負的 `BufferLength` 等是 `SQL_ERROR` 條件。

### 最容易寫錯的邊界

| 錯誤寫法 | 文件支持的修正方向 |
|---|---|
| `if (rc != SQL_SUCCESS) return false;` | 對原始 API，至少把 `SQL_SUCCESS` 與 `SQL_SUCCESS_WITH_INFO` 分成「可繼續但要保留警告／資訊」；對 `SQL_ERROR` 再讀診斷。不要丟掉 info。 |
| 先呼叫 `SQLNumResultCols`、`SQLMoreResults` 或清理 API，再讀原始 handle 診斷 | 先複製／記錄原始 `SQLRETURN` 與全部診斷，再做下一個同 handle 呼叫。 |
| 只呼叫一次 `SQLGetDiagRec(..., 1, ...)` | 用 `SQL_DIAG_NUMBER` 或遞增 `RecNumber` 讀所有 status records；每筆都保存 SQLSTATE、native code、message。 |
| 訊息 buffer 固定很小，看到 `SQL_SUCCESS_WITH_INFO` 就當原始 SQL 成功且訊息完整 | 把 `SQLGetDiagRec` 自身的 `SQL_SUCCESS_WITH_INFO` 視為「診斷訊息截斷」；保留 `TextLengthPtr`，必要時擴大 buffer。 |

### 工程判斷與未確定

- **工程判斷：** 輸出結構宜把 `api_return_code`、診斷 records 與「是否允許繼續」分開，因為同一個 `SQL_SUCCESS_WITH_INFO` 在 `SQLGetData`、`SQLMoreResults`、`SQLGetDiagRec` 的含義不同。
- **工程判斷：** 若用回傳碼迴圈讀診斷，當前 record 的 `SQL_SUCCESS_WITH_INFO` 不應讓已取回的 record 消失；可把本筆訊息標為 truncated 後繼續讀下一筆，或先用 `SQL_DIAG_NUMBER` 控制迴圈。這是依「info 表示訊息截斷、`SQL_NO_DATA` 表示無下一筆」推出的實作策略，文件的簡短掃描示例只示範以 `SQL_SUCCESS` 讀取。
- **未確定：** 特定 driver 會產生哪些 SQLSTATE、幾筆 records、訊息是否含參數值，不能由這些 API reference 推出。正文應使用「常見」而不是保證固定錯誤字串，敏感訊息遮罩也屬本書 logging 設計。

## 2. `SQLGetData`：indicator 才是 NULL／長度／分段的契約

### 官方確定

依 [SQLGetData Function](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlgetdata-function?view=sql-server-ver17) 與 [Getting Long Data](https://learn.microsoft.com/en-us/sql/odbc/reference/develop-app/getting-long-data?view=sql-server-ver17)：

- `SQLGetData` 通常要在 `SQLFetch`、`SQLFetchScroll` 或 `SQLExtendedFetch` 將 cursor 定位到 row 後呼叫；它取指定欄位並依 `TargetType` 轉換到 C buffer。
- `TargetValuePtr` 不可為 `NULL`。`StrLen_or_IndPtr` 若為 `NULL`，表示不要求長度／indicator；但若資料庫欄位實際是 `NULL`，文件定義為 `SQLSTATE 22002`（indicator variable required but not supplied）的錯誤。
- `StrLen_or_IndPtr` 可得到：轉換後資料長度、`SQL_NO_TOTAL` 或 `SQL_NULL_DATA`。資料是 SQL `NULL` 時，driver 應寫入 `SQL_NULL_DATA`；此時不應讀 buffer 內容來猜值。
- 可變長 character／binary 資料可對同一欄連續呼叫多次：每次拿下一段；中間段或資料被 buffer 截斷時通常回 `SQL_SUCCESS_WITH_INFO` 與 `01004`，最後一段回 `SQL_SUCCESS`，再呼叫則回 `SQL_NO_DATA`。
- 字串資料的 `BufferLength` 包含結尾 `NULL` 所需空間；若不夠，最多放 `BufferLength - 1` 的資料並結尾，binary 則最多放 `BufferLength` bytes。`StrLen_or_IndPtr` 對 character／binary 回的是轉換後、尚未因本次 buffer 截斷的長度；driver 無法知道時可回 `SQL_NO_TOTAL`。
- 連接多段 character data 時，要移除中間段各自附帶的結尾 `NULL`；不能把每段的 terminator 都當成內容拼進結果。
- `SQLGetData` 不能把 fixed-length data 當成串流分段讀；對 fixed-length C target，driver 會假設 buffer 已足夠，`BufferLength` 可能被忽略。配置太小是 C++ buffer 越界風險，不是可靠的「自動截斷」。
- `SQL_SUCCESS_WITH_INFO` 不只代表字串截斷：`01004` 是 right truncation，`01S07` 是 fractional truncation；數值整數／整體範圍不容納時可變成 `SQL_ERROR` 與 `22003`。因此不能用單一 `info == harmless` 規則吞掉所有轉換問題。
- 若 `SQLGetData` 沒有回 `SQL_SUCCESS` 或 `SQL_SUCCESS_WITH_INFO`，文件說 data buffer 與 length/indicator buffer 的內容是 undefined；錯誤路徑不能繼續解析半成品。

### 讀取順序與 driver extension

沒有 extension 時，文件要求：

- `SQLGetData` 的欄位必須是未 bind 的欄位，且欄號高於最後一個 bound column。
- 同一 row 內，欄號通常只能遞增；例如先讀欄 5 再讀欄 4 是錯誤。
- `SQLFetch`／`SQLFetchScroll` 若一次取超過一列，通常不能用 `SQLGetData`；driver 可透過 `SQL_GETDATA_EXTENSIONS` 放寬某些限制。
- `SQL_GD_ANY_COLUMN`、`SQL_GD_ANY_ORDER`、`SQL_GD_BOUND`、`SQL_GD_BLOCK` 等能力要用 `SQLGetInfo` 查，不應只因某一個 driver 接受非標準順序就寫成 ODBC 通用規則。

### 最容易寫錯的邊界

| 資料情形 | 應觀察 | 不可做的推論 |
|---|---|---|
| SQL `NULL` | `rc`、`StrLen_or_IndPtr == SQL_NULL_DATA`、目標欄位的 nullable policy | 不可看 `TargetValuePtr[0] == '\0'` 就判定 NULL；也不可把 NULL 默默轉成 0 或空字串。 |
| 空字串 | 正常成功路徑的長度／內容與欄位型別 | 不可用「buffer 是空的」取代 indicator 判斷；NULL 與空字串要有兩個不同測試 case。 |
| 可變長資料超過 buffer | `SQL_SUCCESS_WITH_INFO`、`01004`、回傳長度或 `SQL_NO_TOTAL`，以及目前 buffer 中確實可用的 bytes | 不可只看 `rc != SQL_ERROR` 就宣稱完整取回；也不可用 `strlen` 取代 ODBC length。 |
| fixed-length 數字／日期 | C target 的實際大小與轉換狀態 | 不可假定 `BufferLength` 會保護錯誤大小的 fixed buffer。 |
| fractional truncation | `01S07` 與轉換後值 | 不可把所有「截斷」都當同一種字串分段；精度損失可能是成功帶資訊。 |

### 工程判斷與未確定

- **工程判斷：** `NULL`、空字串、截斷、轉換失敗應在中間表示中分開；若直接全部轉成 `std::string`／`0`，後續無法知道是資料真的空、SQL NULL，還是 buffer 太小。
- **工程判斷：** 對長資料，只有在 `SQL_SUCCESS` 或 `SQL_SUCCESS_WITH_INFO` 時才 append 本次有效內容；以 `SQL_NULL_DATA` 走 NULL 分支，以 `SQL_NO_TOTAL` 表示尚不知道完整長度。這是依官方 indicator／return contract 設計的讀取策略，尚未對目標 driver 實跑。
- **未確定：** `SQL_ATTR_MAX_LENGTH` 若非零，文件說它可能在資料源端先截短，且 driver／data source 不被要求支援；某些情況不會用 `01004` 告訴你。不能靠它當完整資料的驗證或跨 driver 截斷方案。
- **未確定：** 寬字元、driver-specific type、編碼轉換、rowset size 與 `SQL_GETDATA_EXTENSIONS` 的實際組合必須對目標 driver 查 `SQLGetInfo` 並測試。

## 3. `SQLBindParameter`：bind 是借用地址，不是值複製

### 官方確定

依 [SQLBindParameter Function](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlbindparameter-function?view=sql-server-ver17)、[Deferred Buffers](https://learn.microsoft.com/en-us/sql/odbc/reference/develop-app/deferred-buffers?view=sql-server-ver17) 與 [Setting Parameter Values](https://learn.microsoft.com/en-us/sql/odbc/reference/develop-app/setting-parameter-values?view=sql-server-ver17)：

- `ParameterValuePtr` 是 deferred input；driver 保存 buffer 的地址、長度與型別，直到 `SQLExecute`／`SQLExecDirect` 才取內容。官方明確把「bind 後才使用」稱為 deferred buffer，並指出在 driver 仍期待它存在時釋放是 application programming error。
- `StrLen_or_IndPtr` 也是 deferred input。一般參數要在 execute 前把 value 與 length／indicator 寫好；prepared statement 重複執行時可在每次 execute 前改值。
- binding 本身會持續生效，直到再次 `SQLBindParameter`、`SQLFreeStmt(SQL_RESET_PARAMS)`，或把 APD 的 `SQL_DESC_COUNT` 設為 0。這個 binding 狀態的存活，不等於被指向的 C++ storage 可以提早消失。
- `StrLen_or_IndPtr` 的常見值：
  - character／binary C data 的實際 byte length；
  - `SQL_NTS`，表示 null-terminated string；
  - `SQL_NULL_DATA`，表示 SQL `NULL`，driver 忽略 bound value；
  - `SQL_DATA_AT_EXEC` 或 `SQL_LEN_DATA_AT_EXEC(length)`，改走 `SQLParamData`／`SQLPutData`。
- 若 `StrLen_or_IndPtr` 是 `SQL_DATA_AT_EXEC` 類型，`ParameterValuePtr` 可作為回傳給 `SQLParamData` 的 application-defined token；這時它不一定是直接資料 buffer，但 token 所指的生命週期仍由應用程式負責。
- `ParameterValuePtr == NULL` 只在特定 input／input-output 情況可搭配 `SQL_NULL_DATA` 或 data-at-execution；input-output 參數仍需要可存放 output 的 buffer。不能把 `nullptr` 當成通用 NULL 表示法。
- 若 `StrLen_or_IndPtr == NULL`，driver 假設 input 參數都非 NULL，且 character／binary 是 null-terminated；官方特別不鼓勵 binary data 省略 indicator pointer，以免 driver 意外截斷。
- character／binary C data 的 `BufferLength` 是 buffer 或 array element 的 bytes；output／input-output 的 character data 若空間不足，會截到 `BufferLength - 1` 並補 terminator，binary 則截到 `BufferLength`。其他 fixed C type 的 buffer 長度可被忽略，driver 假設型別大小足夠。
- `ValueType` 到 `ParameterType` 的轉換錯誤可能在 `SQLExecDirect`、`SQLExecute` 或 `SQLPutData` 時才回報，不保證在 `SQLBindParameter` 當下發現。
- 若 procedure 產生 result sets，output／input-output parameter 的 buffer 與 indicator 不保證在所有 result sets／row counts 處理前已填好；某些 driver 要等 `SQLMoreResults` 回 `SQL_NO_DATA` 才能讀 output。

### C++ storage 邊界

| 時間點 | 要成立的條件 |
|---|---|
| `SQLBindParameter` 返回後 | `ParameterValuePtr` 與 `StrLen_or_IndPtr` 指向的物件仍存在；bind 成功不代表 value 已複製。 |
| `SQLExecute`／`SQLExecDirect` 前 | value 與 indicator 已被設定到本次執行的狀態；若要送 NULL，indicator 是 `SQL_NULL_DATA`，不是只把 pointer 設成 `nullptr`。 |
| `SQL_NEED_DATA` 流程中 | data-at-execution 的 token、來源資料與每次 `SQLPutData` 使用的 storage 仍有效，直到 `SQLParamData` 完成整個流程。 |
| output／input-output 完成後 | 先依 result sequence 消費完必要結果，再讀 output；若 buffer 太小，也要處理長度／截斷。 |

「`std::string` 被修改、`std::vector` reallocate、區域變數離開作用域、暫時物件在 execute 前消失」是上述 pointer 契約在 C++ 中的典型風險；這是 C++ storage 的工程推論，不是 Microsoft 文件對某個容器實作的保證。教案不需要藉由解參考懸空指標來製造未定義行為；應以存活的 buffer、execute 前改值、以及穩定的 indicator 做安全對照。

## 4. Multiple Results 與 `SQLMoreResults`：結果是一串狀態，不是一次 execute 的單一值

### 官方確定

依 [Multiple Results](https://learn.microsoft.com/en-us/sql/odbc/reference/develop-app/multiple-results?view=sql-server-ver17) 與 [SQLMoreResults Function](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlmoreresults-function?view=sql-server-ver17)：

- ODBC 定義兩類 result：result set，以及 `UPDATE`／`DELETE`／`INSERT` 產生的 row count。batch、procedure 與 parameter arrays 可能產生多個 result sets 或 row counts。
- execute batch 後，statement 通常位於第一個 result。處理完目前 result 後呼叫 `SQLMoreResults`，若有下一個 result 或 count 就初始化它；全部處理完回 `SQL_NO_DATA`。
- 若目前 result set 還有未 fetch 的 rows，`SQLMoreResults` 會丟棄該 result set、關閉 cursor，再讓下一個 result 可用。這不是只「查看下一筆 metadata」的無害呼叫。
- `SELECT`、`UPDATE`、`INSERT`、`DELETE` 混在 batch 時，row counts 不一定逐句可得：可能完全沒有、每句一個，或連續 counts 被 roll up 成一個總數。`SQL_BATCH_ROW_COUNTS` 與 `SQLGetInfo` 用來描述這類能力；`SQL_MULT_RESULT_SETS` 只提供一般性資訊，不能取代完整 result sequence。
- 某些 driver 只有在所有 result sets 與 row counts 都處理完、`SQLMoreResults` 回 `SQL_NO_DATA` 後，才讓 output parameters／return values 可用。
- 前一個 result 的 column bindings 仍會留著；若下一個 result 的 column structure 不同，沿用舊 binding 可能造成錯誤或截斷，應重新 `SQLBindCol` 或解除 binding。
- `SQLMoreResults` 的回傳碼可包含 `SQL_SUCCESS_WITH_INFO`、`SQL_ERROR`、`SQL_NO_DATA`、`SQL_STILL_EXECUTING`、`SQL_PARAM_DATA_AVAILABLE` 等；`SQL_ERROR`／`SQL_SUCCESS_WITH_INFO` 時要對 statement handle 讀診斷。
- 在 batch 某個 statement 失敗時，若 batch 被 abort 或失敗的是最後一個 statement，文件描述為 `SQL_ERROR`；若 batch 沒被 abort 且後面仍有 statement，可能回 `SQL_SUCCESS_WITH_INFO`，表示至少已有 result set 或 count 且 batch 沒有中止。這種 info 不是「整批無條件成功」。
- 呼叫 `SQLCloseCursor` 或 `SQLFreeStmt(SQL_CLOSE)` 會丟掉 batch 尚未處理的 result sets 與 row counts。

### 最容易寫錯的 result sequence

```text
execute
  → 目前 result：可能是 result set，也可能是 count
  → 完整 fetch／取值，或明確決定丟棄
  → SQLMoreResults
  → 下一個 result／count
  → 重複直到 SQL_NO_DATA
```

這個序列只描述 ODBC 狀態機；每個 result 的欄位形狀、row count 是否存在、是否 rolled up，仍由 driver／data source 契約決定。

### 工程判斷與未確定

- **工程判斷：** 第 07 章若要診斷「工具有兩列、程式零列」，log 應記錄 result ordinal、目前 result 是 result set 還是 count、每次 `SQLMoreResults` 的 `SQLRETURN`、診斷與最後的 `SQL_NO_DATA`；只記最後一個 `SQLRowCount` 不夠。
- **工程判斷：** 若程式只需要第一個 SELECT，也要明確記錄其餘結果是「已消費」或「有意丟棄」，不可因 `SQLMoreResults` 會前進就隱式吞掉未 fetch rows。
- **未確定：** 目標 SQL Server driver 是否把某批次的 row counts 個別回傳、roll up 或受 `SET NOCOUNT` 影響，必須在確定的 driver／版本／procedure 或 batch 下測；ODBC reference 本身只列出可能性。
- **未確定：** output parameter 何時可讀、是否需要到 `SQL_NO_DATA`，文件用「some drivers」描述，不能寫成所有 driver 的固定時點。

## 5. `SQLRowCount`：DML affected rows，不是任意 SELECT 的 cardinality API

### 官方確定

依 [SQLRowCount Function](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlrowcount-function?view=sql-server-ver17) 與 [Determining the Number of Affected Rows](https://learn.microsoft.com/en-us/sql/odbc/reference/develop-app/determining-the-number-of-affected-rows?view=sql-server-ver17)：

- `SQLRowCount` 的主要契約是 `UPDATE`、`INSERT`、`DELETE`，以及 `SQLBulkOperations`／`SQLSetPos` 的特定更新操作。
- 對這些操作，`RowCountPtr` 是 affected rows，或在數量不可得時為 `-1`；先不要把 `-1` 當成零。
- `SQLExecute`、`SQLExecDirect`、`SQLBulkOperations`、`SQLSetPos` 或 `SQLMoreResults` 設定／更新 row count 狀態；`SQLRowCount` 讀 cached row count。該值在 statement 回到 prepared／allocated、重新 execute 或 `SQLCloseCursor` 前有其有效範圍。
- diagnostic header 的 `SQL_DIAG_ROW_COUNT` 會在同一 statement handle 的後續 function call 後被 reset；這和 `SQLRowCount` 的 cached value 不是同一個讀取時機。不要先讀別的 API 再把 header 當成原始 count。
- 對其他 statement／function，包括 `SELECT`，driver 可以自行定義 `RowCountPtr`；有些 data source 可能回 SELECT rows，但很多 data source 在 fetch 前根本不知道結果集有幾列。官方明確要求為最大互通性不要依賴這種行為。
- batch 中的 count 仍受到 Multiple Results 的可得性與 roll-up 規則影響；要先透過 `SQLMoreResults` 到正確的 count result，再呼叫 `SQLRowCount`。
- `SQLRowCount` 自己也可能回 `SQL_SUCCESS_WITH_INFO`、`SQL_ERROR` 或 `SQL_INVALID_HANDLE`；info／error 的 diagnostics 仍在 statement handle 上。

### 零列與 `-1` 不要混為一談

- 「沒有符合 row」是資料／statement 結果；「driver 無法提供 count」是 `-1` 的 API 狀態，二者不是同一件事。
- 在直接透過 `SQLExecDirect`、`SQLExecute` 或 `SQLParamData` 執行的 searched `UPDATE`／`INSERT`／`DELETE` 沒有命中時，`SQLMoreResults` 文件指出可回 `SQL_NO_DATA`；但同一類 statement 若在 batch 中，`SQLMoreResults` 對無 affected rows 的結果可回 `SQL_SUCCESS`，之後呼叫 `SQLRowCount` 可能回 `SQL_NO_DATA`。這個差異是 result sequence 的一部分，不能只靠 `rc == SQL_SUCCESS` 判定改了幾列。
- 是否「命中但新舊值相同」仍算 affected rows、trigger／`NOCOUNT` 如何影響外露 count、以及某 driver 的 `-1` 情況，不能只由這幾頁 ODBC reference 推出；第 10 章應把它們列為 target DB／driver 實測題。

## 6. `SELECT COUNT`：先分清 ODBC result set 與 SQL Server aggregate

### ODBC 層的確定結論

`SELECT COUNT(*) ...` 是一個 `SELECT` statement，回傳的是 result set；不是 `SQLRowCount` 的 DML affected-row cache。正確的觀測邊界是：

1. execute。
2. 讓 cursor 位於 result row（例如 `SQLFetch`）。
3. 用 `SQLBindCol` 或 `SQLGetData` 讀 count 欄位。
4. 同時檢查 `SQLRETURN` 與 length/indicator；不要只把 C buffer 裡的位元組直接 cast 成業務數字。

這個分法由 [SQLGetData Function](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlgetdata-function?view=sql-server-ver17) 的「先 fetch 再取欄」契約，以及 [SQLRowCount Function](https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlrowcount-function?view=sql-server-ver17) 對 SELECT 的 driver-defined 限制共同支持。

### SQL Server 限定的 `COUNT` 邊界

依 [COUNT (Transact-SQL)](https://learn.microsoft.com/en-us/sql/t-sql/functions/count-transact-sql?view=sql-server-ver17)：

| 寫法 | SQL Server 文件定義 | 寫作時的限制 |
|---|---|---|
| `COUNT(*)` | 計 result set 中每一 row，包含欄位是 NULL 的 row，也保留 duplicate rows。 | 若要算「符合 WHERE 的 row 數」，這通常才是語義上對的欄位形式；不要改成任意 nullable column。 |
| `COUNT(expression)` | 計 expression 的 non-NULL 值。 | `COUNT(column)` 不等於 `COUNT(*)`；nullable column 會少算。 |
| `COUNT(DISTINCT expression)` | 計 unique、non-NULL 值。 | 它不是 row count，也不是 affected rows。 |
| `COUNT` vs `COUNT_BIG` | `COUNT` 回 `int`；`COUNT_BIG` 回 `bigint`。 | 大資料量或 C++ 64-bit 對照要按 SQL 型別與 driver conversion 設計，不要無條件假設 `int`。 |

SQL Server 文件另說：`COUNT` 超過 `int` 最大值時會 overflow；若 `ARITHABORT` 與 `ANSI_WARNINGS` 都是 `OFF`，可能回 `NULL`，否則 query abort 並報 arithmetic overflow。這使「COUNT 一定非 NULL、直接塞入 int」成為不安全的泛化。`COUNT_BIG` 是 SQL Server 對大結果的對應選擇。

### 工程判斷與未確定

- **工程判斷：** 第 10 章要查「有幾列符合條件」時，固定寫清楚是 `SELECT COUNT(*)` 的查詢結果，還是 DML 後的 affected rows；兩者要用不同觀測欄位與不同驗收語句。
- **工程判斷：** SQL Server `COUNT` 的 nullable metadata、overflow 設定與 ODBC C target conversion 應在測試中保留 indicator 與 `SQLSTATE`，避免以「通常不會 NULL」省略 NULL 分支。
- **未確定：** 上表的 aggregate 語義是 SQL Server 文件範圍，不應直接宣稱所有 SQL engine、compatibility level 或 driver 都完全同樣；跨 DB 章節需另查目標引擎。
- **未確定：** `COUNT(*)` 在目標 engine／driver 的實際 ODBC SQL type、metadata nullable 標記與 C++ target conversion，要由 `SQLDescribeCol`／driver 文件／實測確認；本輪沒有連線驗證。

## 7. 跨 API 的 `SQL_SUCCESS_WITH_INFO` 判讀表

`SQL_SUCCESS_WITH_INFO` 不是單一語義。至少要把它和「哪個 API 回的」綁在一起：

| 回傳 API | 文件中的典型含義 | 下一步 |
|---|---|---|
| 原始 execute／fetch／取值 API | 呼叫大致完成，但帶有 warning、轉換資訊或資料截斷；資料是否可用要看該 API 的契約。 | 保存 diagnostics；只有在文件保證 output 有效時才消費 output；對 `SQLGetData` 需依 indicator／剩餘資料繼續。 |
| `SQLGetData` | 常見是 `01004` 分段／right truncation，或 `01S07` fractional truncation；目前成功帶回的部分可用，但不代表完整值已到齊。 | append 有效資料、處理 indicator；最後一段才以 `SQL_SUCCESS` 結束，之後 `SQL_NO_DATA`。 |
| `SQLGetDiagRec` | 診斷訊息 buffer 太小，訊息本身被截斷。 | 保留本筆 record 與 `TextLengthPtr`；調整 message buffer，不把它誤當成原始 SQL function 的結果。 |
| `SQLMoreResults` | 可能是 driver warning，也可能是 batch 中一個 statement 失敗但 batch 未中止，後面仍有 result。 | 讀 diagnostics，記錄 result sequence；不要因 info 直接回報整批成功或整批失敗。 |
| `SQLRowCount`／`SQLBindParameter` | driver／data source 的 warning 或參數／descriptor 層資訊。 | 讀 diagnostics；不要把 warning 當成沒有 affected rows，也不要以 bind 成功代替 execute 成功。 |

## 8. 確定、工程判斷、未確定

### 確定（可直接依官方文件寫入來源筆記）

- 診斷要綁定 handle 與時機；同 handle 的下一個一般 ODBC 呼叫可能覆蓋舊診斷。
- `SQLGetDiagRec` 的 status records 從 1 起；訊息 buffer 截斷會是該函式的 `SQL_SUCCESS_WITH_INFO`；沒有下一筆是 `SQL_NO_DATA`。
- `SQLGetData` 的 NULL 判斷依 `SQL_NULL_DATA`；缺 indicator 而實際取到 NULL 是 `22002`；variable-length data 可分段；buffer 不足可回 `01004`／`SQL_SUCCESS_WITH_INFO`。
- `SQLGetData` 對欄位順序、bound column、rowset size 有預設限制，driver 可用 `SQLGetInfo` 回報 extension。
- `SQLBindParameter` 的資料與 indicator 是 deferred buffer；execute 時才取，且 storage 必須活著；`SQL_NULL_DATA`、`SQL_NTS`、data-at-execution 有不同語義。
- Multiple Results 同時包含 result set 與 row count；`SQLMoreResults` 前進且可能丟掉未 fetch 的目前 result；結束是 `SQL_NO_DATA`。
- batch row count 可能不可得、逐句回傳或 roll up；不能假定固定 result sequence。
- `SQLRowCount` 主要是 DML affected rows；SELECT row count 是 driver-defined，不能拿來作可攜的結果集 cardinality。
- `SELECT COUNT(*)` 要當 result set fetch；SQL Server `COUNT(*)`、`COUNT(expression)`、`COUNT(DISTINCT expression)` 與 `COUNT_BIG` 的語義／型別不同。

### 工程判斷（正文可採用，但要標成實作策略）

- API wrapper 應回傳「原始 return code、diagnostics、資料是否完整、是否可繼續」四個分量，而不是只回 `bool`。
- 中間資料型別保留 value／NULL／truncated／conversion-error 的差異；不要把所有非錯誤結果壓成 string 或 zero。
- bind 的 value buffer 與 indicator 由同一個明確 owner 持有到 execute／stream 完成；任何會搬動或釋放 storage 的動作都要避開或重新 bind。
- 每個 result 都要有可觀測的 ordinal／形狀／狀態；對 batch 明確消費或丟棄結果，不讓 `SQLMoreResults` 隱式改變資料契約。
- `SQLRowCount` 只回答 API／driver 可提供的 affected-row 證據；是否符合業務意圖仍要以 key、版本或讀回驗證設計。

### 未確定（不可寫成跨 driver 保證）

- 特定 driver 的 diagnostics 筆數、native code、warning wording 與 `SQL_SUCCESS_WITH_INFO` 出現點。
- `SQLGetData` 的 extension、寬字元／編碼轉換、rowset／block cursor 支援。
- 某 batch／procedure 的 row count 是否存在、是否 roll up、`NOCOUNT` 或其他 session／driver 設定的實際影響。
- output parameter 何時可讀、是否一定要等 `SQLMoreResults == SQL_NO_DATA`。
- DML affected rows 是否代表 matched rows、實際值改變 rows，及 trigger／stored procedure 如何改變可見 count。
- SQL Server 文件以外的 engine 對 `COUNT` 的型別、overflow、NULL metadata 與 ODBC conversion 行為。
- 本輪沒有證明任何範例程式可在特定 driver 上編譯或跑出指定輸出。

## 9. 給第 05–10 章的最小查核矩陣

這是待實作的測試設計，不是本輪已執行的結果。

| 章 | 最小 fixture／操作 | 必留觀測 | 不可先下的結論 |
|---|---|---|---|
| 05 診斷 | 不存在欄位；另造一個回 `SQL_SUCCESS_WITH_INFO` 的 warning／截斷案例。 | 原始 API、statement handle、完整 diagnostics records、讀取前後的 return code。 | 不能因只看到第一筆或 `false` 就說 driver 沒有更多資訊。 |
| 06 讀值 | 同一 SELECT 逐欄替換 SQL NULL、空字串、超長字串、binary、fractional／整數邊界；改變 projection 順序。 | `SQLRETURN`、SQLSTATE、indicator、回報長度、C target type、實際完整性、讀取順序。 | buffer 加大一次成功，不足以證明 NULL、截斷、型別轉換和順序限制都已處理。 |
| 07 多結果 | `SELECT`；`SELECT`＋`UPDATE`；多個 DML；DML 失敗後仍有後續 statement 的 batch。 | 每個 result ordinal、result set／row count 類型、fetch 狀態、`SQLMoreResults` 回傳碼、診斷、終止 `SQL_NO_DATA`。 | 不可假設第一個 result 就是想要的資料，也不可假設每個 count 都逐句出現。 |
| 08 bind | 穩定 scalar／indicator；bind 後、execute 前改 value；重配／離開作用域的程式碼只做靜態審查或安全替代。 | bind／execute 時間點、buffer owner、indicator owner、實際送出的值、data-at-exec 狀態。 | bind 當下 debugger 看到正確，不等於 execute 時 driver 讀到同一值。 |
| 09 動態 SQL | 本次 ODBC 審計不新增 identifier quoting 來源；沿用 `primary-source-checks.md` 的 P06，另按目標 DB 核對。 | 明確區分 value parameter 與 identifier；記錄本檔未覆蓋此主題。 | 不可把本檔 ODBC pointer／result 證據誤當成表名 quoting 證據。 |
| 10 寫入／count | 正確 key、無命中 key、相同新舊值；另用 `SELECT COUNT(*)` 與 `COUNT(nullable_column)` 對照。 | DML `SQLRowCount`、是否 `-1`／`SQL_NO_DATA`、`SQLMoreResults` sequence、完整 key 讀回、COUNT 的 indicator／C type。 | affected rows、SELECT cardinality、實際值改變與業務成功不是同一個欄位。 |

## 10. 來源清單、讀取範圍與日期

以下均於 2026-09-22 讀取官方頁面正文。Microsoft Learn 頁面在部分頁面顯示登入／授權提示，但本輪仍能讀取下列正文；沒有把該提示誤記為全文不可讀。頁面更新日以頁尾可見日期記錄。

| 來源 | URL | 讀取範圍 | 頁面更新日 |
|---|---|---|---|
| SQLGetDiagRec Function | https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlgetdiagrec-function?view=sql-server-ver17 | Summary、Arguments（`RecNumber`、`MessageText`、`BufferLength`、`TextLengthPtr`）、Returns、Diagnostics、Comments、HandleType | 2026-05-27 |
| Using SQLGetDiagRec and SQLGetDiagField | https://learn.microsoft.com/en-us/sql/odbc/reference/develop-app/using-sqlgetdiagrec-and-sqlgetdiagfield?view=sql-server-ver17 | handle 診斷生命週期、`SQL_DIAG_NUMBER`、`SQL_SUCCESS_WITH_INFO`／`SQL_ERROR` 示例 | 2026-05-27 |
| Diagnostic Records | https://learn.microsoft.com/en-us/sql/odbc/reference/develop-app/diagnostic-records?view=sql-server-ver17 | header／status records、handle 關聯、driver-specific storage 說明 | 2026-05-27 |
| SQLGetData Function | https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlgetdata-function?view=sql-server-ver17 | Summary、Arguments、Returns、完整常見 Diagnostics、Comments、Using SQLGetData、分段取回、Retrieving Data with SQLGetData | 2026-05-27 |
| Getting Long Data | https://learn.microsoft.com/en-us/sql/odbc/reference/develop-app/getting-long-data?view=sql-server-ver17 | 取 row 後再 `SQLGetData`、分段 return code、欄位順序／bound column／rowset restrictions、`SQLGetInfo` extension | 2026-05-27 |
| SQLBindParameter Function | https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlbindparameter-function?view=sql-server-ver17 | Summary、Arguments、Returns／Diagnostics、Comments、`ParameterValuePtr`、`BufferLength`、`StrLen_or_IndPtr`、Passing Parameter Values、output parameter 與 result sets | 2026-05-27 |
| Deferred Buffers | https://learn.microsoft.com/en-us/sql/odbc/reference/develop-app/deferred-buffers?view=sql-server-ver17 | 全文主文與 deferred input／output 對照表 | 2026-05-27 |
| Setting Parameter Values | https://learn.microsoft.com/en-us/sql/odbc/reference/develop-app/setting-parameter-values?view=sql-server-ver17 | 設值時機、length／indicator 特殊值、NULL、data-at-execution、範例表與轉換說明 | 2026-05-27 |
| SQLMoreResults Function | https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlmoreresults-function?view=sql-server-ver17 | Summary、Returns／Diagnostics、Comments、result disposal、output parameters、row count availability | 2026-05-27 |
| Multiple Results | https://learn.microsoft.com/en-us/sql/odbc/reference/develop-app/multiple-results?view=sql-server-ver17 | result set／row count 定義、`SQLGetInfo` options、`SQLMoreResults` 範例、batch failure 與 `SQL_SUCCESS_WITH_INFO` | 2026-05-27 |
| SQLRowCount Function | https://learn.microsoft.com/en-us/sql/odbc/reference/syntax/sqlrowcount-function?view=sql-server-ver17 | Summary、Arguments、cached row count、SELECT driver-defined 限制、Returns／Diagnostics、Comments | 2026-05-27 |
| Determining the Number of Affected Rows | https://learn.microsoft.com/en-us/sql/odbc/reference/develop-app/determining-the-number-of-affected-rows?view=sql-server-ver17 | DML affected rows、batch count、`SQL_DIAG_ROW_COUNT` reset 與 `SQLRowCount` cache 差異 | 2026-05-27 |
| COUNT (Transact-SQL) | https://learn.microsoft.com/en-us/sql/t-sql/functions/count-transact-sql?view=sql-server-ver17 | Syntax、`*`／expression／DISTINCT、return types、NULL／duplicate semantics、overflow、`COUNT_BIG` 對照 | 2026-09-21 |

## 本輪限制

- 本檔不引用論壇、部落格、教科書鏡像或私有專案來支持上述 ODBC API 機制。
- 本檔的 ODBC reference 是官方 API 契約；它不替特定 driver、DB engine、ODBC version、session option 或 wrapper 的實際行為背書。
- `COUNT` 的 overflow／`ANSI_WARNINGS`／`ARITHABORT` 段落是 SQL Server／Transact-SQL 限定，不應寫成跨資料庫規則。
- 沒有把待測實驗寫成已發生的輸出；主 agent 寫第 05–10 章時，應保留「文件確定」與「目標組合實測」兩種證據層級。

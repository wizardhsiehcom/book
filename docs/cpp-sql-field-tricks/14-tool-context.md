# 14｜把 SQL 貼到工具很快，為什麼程式還在等？

你從 C++ 複製一段 SELECT，貼到 SQL 工具，結果很快就出現了。回到程式卻還在等，於是很想換 driver。先停在這個差異：工具出現第一頁，和程式完成整筆工作，可能根本不是同一個終點。

本章先用第 13 章已驗過的路徑說明怎麼比，再把方法帶回你的專案。**這是查核流程，不是已實測的 SQL 效能修復**；本版沒有重現 MARS、連線池或執行計畫調校案例。

## 先找出你究竟複製了哪一段

打開 [sql_lab.cpp](examples/sql_lab.cpp)，定位 `timing(Connection& c, bool delay)`。以下是實際函式中的查詢，不需要修改原碼：

```cpp
s.exec("SELECT job_id,input_value FROM dbo.Jobs WHERE job_id=1");
```

這行之後還有 `s.fetch()`、兩次 `s.integer()`、組成 `JobRow`，最後才呼叫 `process_job(row)`。如果 mode 是 `timing`，核心前還會多等 120 ms。查詢只取 `job_id` 和 `input_value`；終端看到的 `score=20` 是 C++ 後來算的，不是這段 SELECT 從 `Jobs.score` 讀出的值。

SQL 工具若只執行這個 SELECT，就沒有替你執行 C++ 的轉換、等待與計算。`execute_ms` 也只量 `s.exec` 返回前的時間，不是 connect 到整個程式結束。先把兩邊的起訖說清楚，才有資格問「一樣的工作，為什麼一邊慢」。

## 用已知的等待，先驗證比較方式

本輪不改 SQL、不改索引，只切換既有 `timing-base`／`timing` 案例。**執行前先預測**：兩次都讀同一列，計算結果都應是 20；只有第二次在取完資料後多等約 120 ms，所以增加的應主要是 `core_ms`。SQL 工具只跑 SELECT，不應被拿來對比這段額外等待。

若要重看第 13 章的對照，先完成[SQL 實驗準備](appendix-lab.md#sql-lab)，並從**存放 `run-sql-case.ps1` 的範例目錄**執行。三條命令依序完成，不同時跑其他案例：

```powershell
.\run-sql-case.ps1 timing-base
.\run-sql-case.ps1 timing
.\run-sql-case.ps1 timing-base
```

初版最後一輪的實際觀察如下；這裡摘出既有輸出的兩個欄位，不是假造三份完整 log：

| 執行順序 | `injected_delay` | `core_ms` |
|---|---:|---:|
| baseline | 0 | 0 |
| 注入等待 | 1 | 127.875 |
| 再一次 baseline | 0 | 0 |

這支持「已知等待落在取列後的區段」，不支持「ODBC 需要 127.875 ms」，更沒有測出 SQL 工具快了幾倍。0 也不是核心沒有執行，而是這次計時沒有顯示出非零耗時。你的數字不必相同；若差異反而在 execute，先查量測位置、目標和等待條件，不把本書這組數字當修復目標。

還要分開看最後的 `PASS`：`timing()` 沒有對 score 或時間範圍呼叫 `expect`。`main` 只要在案例返回後沒有收到例外，就印 `PASS`；它不會自動判斷 score 是否為 20、延遲是否落在預期區段。因此仍要親自核對輸出的 `score`、`injected_delay` 和各段耗時，不能拿一行 `PASS` 代替這張對照表。

## 回到慢呼叫：先把兩邊排在同一張紙上

現在才處理真專案的工具快、程式慢。先不要清 cache，也不要改全域 SET options；後者是 SQL session 的行為設定，隨意一起改會讓你不知道哪個條件影響結果。一次 connection 所維持的資料庫對話可先理解為一個 session；工具視窗與 C++ connection 不會因為貼了同一段文字，就自動共用它的狀態。

從一次慢呼叫保留以下**非機密**資訊；不要直接抄含密碼的連線字串：

| 條件 | C++ 路徑 | 工具路徑 |
|---|---|---|
| 實際 server、database、schema | 實際連線目標 | 工具目前連線 |
| 值、SQL 型別、長度 | bind 的實際設定 | 直接寫在 SQL 裡的值，或宣告參數 |
| session／交易 | autocommit、隔離、SET options | 是否另開交易 |
| 取列範圍 | 完整 fetch 幾列 | 首頁還是完整結果 |
| 量測起訖 | connect 到 notify？ | 執行到首列或顯示？ |
| 重用狀態 | 新程序、池、MARS 是否存在 | 新 session 或既有視窗 |

連線池是重用既有連線的機制；MARS 是 SQL Server 在同一連線容許多個作用中結果集的功能。表格列它們是提醒你**先查有沒有**，不是宣稱所有 C++ 專案都有。空格先寫未知，不要用印象中的預設值填滿。這和核對 C++ build flags 有點像：文字一樣不保證條件相同；但資料庫執行計畫不是 C++ 編譯結果，類比到這裡就停。

## 一輪只對齊一個差異

假設你查到工具只取第一頁，而程式完整讀了一萬列。下面是**帶回專案的操作設計，未在本書做過這組一萬列實驗**，也沒有對應的新 CLI 選項：

1. **改動位置**：先改工具的結果消耗方式，讓它與程式都完整讀完同一個有限結果；不要先改 C++ 核心或資料庫設定。若要增加觀測，就放在原有 fetch 迴圈的首列與結束位置。
2. **執行前預測**：如果差距主要來自只讀首頁，改成完整消耗後，兩邊「讀完」的時間落差應改變。各自另外記「第一列到了」，不要混在同一欄。
3. **執行後觀察**：保存實際列數、結果與起訖。沒有量到的數字寫未量測；本書沒有可替你填上的工具耗時。
4. **解釋與下一步**：若落差縮小，消耗範圍值得繼續查；若沒有縮小，就不再用首頁差異解釋這一輪。下一輪才對齊參數型別／長度，仍保留相同工作量。

不能同時關池、改隔離、改索引，最後只知道「其中某件事有用」。把程式也改成只讀首頁可能比較快，卻不等於完成原本的一萬列工作。若更動過 session 設定，結束時恢復並記錄，避免下一次基準已不是同一條件。

## 第一手案例提醒的是調查方向，不是配方

京東雲的 MySQL 案例，從獨立 SQL 與程序內的計畫差異，追到參數／欄位字元集轉換。這提醒我們保留執行上下文；它不是「所有字元集轉換一定不用索引」，更不是把某個 MySQL 調整直接搬進本書 SQL Server。

Sommarskog 的文章另有作者用 C# 比較 MARS 的例子，不同網路環境結果不同。你該學的是把本機／遠端、取列、選項拆開對照，而不是搬用作者的倍率，或在尚未確認有 MARS 的專案先把它關掉。

若需要看 server 的執行計畫或事件，而帳號沒有權限，先把 client 條件表、時間與小重現交給 DBA。執行計畫描述資料庫打算怎麼取得資料，不能只從 C++ 總耗時猜出來。不要為了查一筆就擴張帳號權限或清全庫 plan cache。這個土招的代價是多留一份條件紀錄，價值是讓下一位接手者少猜幾次。

## 換個情境想一次

工具執行一樣慢，是否代表一定是 SQL 計畫？

<details><summary>核對判準</summary>

還可能共同等鎖、等網路或拿不同於預期的資料量。工具對照縮小了「僅應用路徑」差異，沒有單獨證明計畫根因；回看分段與等待證據。

</details>

來源：[京東雲原文](https://www.cnblogs.com/Jcloud/p/16646031.html)、[Sommarskog 原文](https://www.sommarskog.se/query-plan-mysteries.html)、[Microsoft query timeout troubleshooting](https://learn.microsoft.com/en-us/troubleshoot/sql/database-engine/performance/troubleshoot-query-timeouts)。中文圖中細節與作者效能數據未親自重現，詳見[來源索引](appendix-sources.md)；本書計時觀察見[驗證紀錄](appendix-validation.md)。

# 14｜把 SQL 貼到工具很快，為什麼程式還在等？

你已經有兩個觀察：工具快、C++ 慢。它們還不是「ODBC 很慢」的證明，因為複製 SQL 文字常常沒有複製整個執行條件。

本章是帶回專案的查核流程，不提供一個假裝保證加速的開關。前章的分段計時已實測；本章沒有重現 MARS、連線池或 query-plan 調校案例。

## 先把兩邊排在同一張紙上

先不要清 cache，也不要改全域 SET options。從一次慢呼叫保留以下非機密資訊：

| 條件 | C++ 路徑 | 工具路徑 |
|---|---|---|
| 實際 server、database、schema | 實際連線目標 | 工具目前連線 |
| 值、SQL 型別、長度 | bind 的實際設定 | literal 或宣告參數 |
| session／交易 | autocommit、隔離、SET options | 是否另開交易 |
| 取列範圍 | 完整 fetch 幾列 | 首頁還是完整結果 |
| 量測起訖 | connect 到 notify？ | 執行到首列或顯示？ |
| 重用狀態 | 新程序、池、MARS 是否存在 | 新 session 或既有視窗 |

空格先寫未知，不要用熟悉的預設值填滿。這和比兩份 C++ build 的 flags 有點像：文字一樣不保證條件相同。但資料庫計畫不等同 C++ 編譯器，類比到這裡就停。

## 第一個小實驗：先統一工作量

假設工具只取第一頁，你的程式讀一萬列。先讓兩邊都完整消耗同一個有限結果，分開記「第一列到了」與「讀完」。預測如果差異主要在消耗範圍，兩者完成時間的落差會改變。

觀察若沒有改善，也不是白做：至少排除了這個條件。下一輪才對齊參數型別／長度，不能同時關池、改隔離、改索引，最後只知道「其中某件事有用」。每輪核對列數與結果，不以少做工作冒充加速。

## 第一手案例提醒的是調查方向，不是配方

京東雲的 MySQL 案例，從獨立 SQL 與程序內的計畫差異，追到參數／欄位字元集轉換。這提醒我們保留執行上下文；它不是「所有字元集轉換一定不用索引」，更不是把某個 MySQL 調整直接搬進本書 SQL Server。

Sommarskog 的文章另有作者用 C# 比較 MARS 的例子，不同網路環境結果不同。你該學的是把本機／遠端、取列、選項拆開對照，而不是搬用作者的倍率，或在尚未確認有 MARS 的專案先把它關掉。

若需要 server plan／events 而帳號沒有權限，先把 client 條件表、時間與小重現交給 DBA。不要為了查一筆就擴張帳號權限或清全庫 plan cache。這個土招的價值是讓下一位接手者少猜幾次。

## 換個情境想一次

工具執行一樣慢，是否代表一定是 SQL 計畫？

<details><summary>核對判準</summary>

還可能共同等鎖、等網路或拿不同於預期的資料量。工具對照縮小了「僅應用路徑」差異，沒有單獨證明計畫根因；回看分段與等待證據。

</details>

來源：[京東雲原文](https://www.cnblogs.com/Jcloud/p/16646031.html)、[Sommarskog 原文](https://www.sommarskog.se/query-plan-mysteries.html)、[Microsoft query timeout troubleshooting](https://learn.microsoft.com/en-us/troubleshoot/sql/database-engine/performance/troubleshoot-query-timeouts)。中文圖中細節與作者效能數據未親自重現，詳見[來源索引](appendix-sources.md)。

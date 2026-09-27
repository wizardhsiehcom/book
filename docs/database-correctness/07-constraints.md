# 07｜先 SELECT 再 INSERT，為什麼還是不夠？

## 問題

匯入前先查「資料不存在」，看起來可以避免重複；但兩個匯入者可能同時查到不存在，然後各自插入同一個自然鍵。程式檢查只是一次觀察，沒有自動把「檢查」和「新增」變成不可分割的動作。決定資料合法與否的規則，應由資料庫在寫入時也檢查。

## 先預測

直接送幾筆錯誤資料給資料庫：相同批次與缺陷號、不存在的批次 ID、101 分、缺少主鍵。哪幾筆會被拒絕？若欄位只有 CHECK(score BETWEEN 0 AND 100) 卻允許 NULL，NULL 會不會被當成超出範圍？

## 約束把規則放在資料邊界

共同 schema [01-schema.sql](examples/01-schema.sql) 逐欄建立了：

- **PRIMARY KEY：** 一張表的一列身分，必須唯一且不能是 NULL。
- **UNIQUE(batch_id, defect_no)：** 防止同一批次重複缺陷號；它是自然鍵的資料庫保護。
- **FOREIGN KEY：** 只接受已存在的批次／缺陷引用，防止孤兒列。
- **NOT NULL：** 必要欄位必須有值；本例 score、model_version、operator_name 都是必填。
- **DEFAULT：** 省略 version_no 時提供 0；明確傳 NULL 仍會被 NOT NULL 擋下。預設值是省略欄位時的供值規則，不是範圍驗證。
- **CHECK：** 限制 defect_no、version_no 與 score 的列內範圍。

可用下列語句思考由外部用戶或另一支程式繞過 UI 時，資料庫仍應拒絕哪些寫入。它們是刻意違規的例子，不應在 seed 上一次執行；若逐句測試，要在隔離的實驗環境記錄各自錯誤：

~~~sql
-- 已有 (batch_id=10, defect_no=1)
INSERT dbo.Defects(defect_id, batch_id, defect_no)
VALUES (4, 10, 1);                -- UNIQUE 擋下

INSERT dbo.Defects(defect_id, batch_id, defect_no)
VALUES (4, 999, 9);               -- FK 擋下

INSERT dbo.Judgments(judgment_id, defect_id, score, model_version, operator_name)
VALUES (104, 1, 101, N'm3', N'lin'); -- CHECK 擋下

INSERT dbo.Judgments(judgment_id, defect_id, score, model_version, operator_name)
VALUES (104, 1, NULL, N'm3', N'lin'); -- NOT NULL 擋下
~~~

INSERT 中省略 created_at 是合法的，因 schema 有預設 UTC 時間；但預設時間只填值，不保證它能排成唯一、可靠的事件全序。讀者不應把時間戳誤認為其他鍵或版本。

## CHECK 與 UNKNOWN 的洞

CHECK 條件拒絕 FALSE，但條件為 UNKNOWN 時 SQL Server 不會以此約束拒絕資料。若 score 可為 NULL，score BETWEEN 0 AND 100 對 NULL 結果是 UNKNOWN，因此單靠 CHECK 不足以強制必填。用獨立資料表變數對照：

~~~sql
DECLARE @Probe TABLE (
    score int NULL CHECK (score BETWEEN 0 AND 100)
);
INSERT @Probe(score) VALUES (NULL);
~~~

上例中的 INSERT 可通過 CHECK；修正規則需要另外標註 score int NOT NULL。本書的正式判定表已將 score 設為 NOT NULL，再加 CHECK，因此同時保證有值及範圍合法。這也說明要把業務不變條件寫完整：單一約束常只保證其中一部分。

約束還有適用邊界：CHECK 適合列內範圍，不會自動驗證其他表的狀態或多列總和；不同列的唯一性用 UNIQUE，父子存在性用 FK。某些跨列或流程規則要由交易、程式流程或更專門的資料庫設計保護，後續章節再接著處理。

SQL Server 的單欄 nullable UNIQUE 還有另一個容易混淆的規則：它通常只允許一列 NULL。因此「未知就彼此不同」不是此約束的語意。若需求是只限制有值的列，可以研究 `WHERE 欄位 IS NOT NULL` 的 filtered unique index；先定需求，不要把其他引擎對 NULL 的做法直接搬來。複合唯一鍵比較整組鍵值，也不能概括成整張表只能有一個 NULL。

## 應用檢查與資料庫規則各做什麼

應用層檢查仍然有價值：它可以在使用者按下匯入時提早指出缺陷編號不合法、分數格式錯誤，並提供可理解的錯誤訊息。但程式可能有多個版本、批次匯入器、維運腳本或另一個服務直接寫資料；若只有畫面做驗證，其他入口就能繞過。資料庫約束離資料最近，能讓每一條寫入路徑面對同一條底線。

競爭時序可畫成：A 查詢尚不存在的 (10,9)；B 也查詢 (10,9) 不存在；A 插入；B 插入。若只有先查再新增，兩段程式都會認為自己安全。UNIQUE 讓最後只有一列能成立，另一個 INSERT 收到衝突；應用要再決定把它回報為重複、核對成同一請求，還是重新讀取資料。約束保護「不能同時有兩筆相同業務鍵」，不保證兩個請求是同一個意圖，也不替你設計重試。

同樣地，FK 可防止子列引用不存在的父列，卻不會驗證操作者有沒有權限建立該缺陷；CHECK 可保證單列分數範圍，卻不會替不同列分數加總；NOT NULL 可保證有值，卻不會判斷該值是否符合現場語意。先把可用約束表達的規則交給資料庫，再把需要跨列、跨系統或友善回應的工作明確留在交易與應用流程中。

## 無提示題

逐一指出自然鍵重複、錯誤外鍵、越界分數、NULL 分數會由哪條規則拒絕。然後用兩個同時匯入的時間線解釋為什麼應用層先 SELECT 的檢查有競爭窗口；最後解釋讓資料庫約束擔任最後防線能保證什麼、不能保證什麼。

> 對應 [約束驗收](examples/09-constraints.sql) 已在 SQL Server 2022 CU27 執行；環境與限制見 [驗證紀錄](verification.md)。

答案：[answers.md｜07 約束](answers.md#07-constraints)。

來源：[Microsoft Learn：Primary and foreign key constraints](https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints?view=sql-server-ver16)、[Microsoft Learn：Unique constraints and check constraints](https://learn.microsoft.com/en-us/sql/relational-databases/tables/unique-constraints-and-check-constraints?view=sql-server-ver16)、[Microsoft Learn：NULL and UNKNOWN](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/null-and-unknown-transact-sql?view=sql-server-ver16)

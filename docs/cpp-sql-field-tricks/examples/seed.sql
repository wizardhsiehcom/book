-- 只在新建的 book-cpp-sql-lab 容器裡跑。已有同名資料庫就停，不覆蓋舊證據。
IF DB_ID(N'FieldTricksLab') IS NOT NULL
    THROW 50001, 'Lab DB already exists: refusing to reseed', 1;
GO
CREATE DATABASE FieldTricksLab;
GO
USE FieldTricksLab;
-- Jobs 是實驗列。兩筆輸入都是 10，所以核心算出來應是 score 20、accepted true。
-- score 先留 NULL，後面的寫入章才會改它，再看 rollback 有沒有把它還原。
CREATE TABLE dbo.Jobs (
    job_id int NOT NULL PRIMARY KEY,
    input_value int NOT NULL,
    note nvarchar(200) NULL,
    score int NULL,
    version_no int NOT NULL DEFAULT 0
);
INSERT dbo.Jobs(job_id,input_value,note) VALUES (1,10,NULL),(15,10,NULL);
-- Operations 給第 15 章當「這次操作已經做過」的紀錄。重跑前先查這裡，而不是盲目再寫一次。
CREATE TABLE dbo.Operations (
    operation_id varchar(64) NOT NULL PRIMARY KEY,
    job_id int NOT NULL,
    score int NOT NULL
);
GO

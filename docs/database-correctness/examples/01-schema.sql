-- 新建空的 B02Lab 才能執行；不包含 DROP / 自動重置。
USE B02Lab;
GO
SET XACT_ABORT ON;
IF OBJECT_ID(N'dbo.Defects') IS NOT NULL
    THROW 51001, N'教材資料表已存在；拒絕重建。', 1;
BEGIN TRANSACTION;
CREATE TABLE dbo.Batches (
    batch_id int NOT NULL CONSTRAINT PK_Batches PRIMARY KEY,
    label nvarchar(40) NOT NULL
);
CREATE TABLE dbo.Defects (
    defect_id int NOT NULL CONSTRAINT PK_Defects PRIMARY KEY,
    batch_id int NOT NULL CONSTRAINT FK_Defects_Batches REFERENCES dbo.Batches(batch_id),
    defect_no int NOT NULL CONSTRAINT CK_Defects_Number CHECK (defect_no > 0),
    version_no int NOT NULL CONSTRAINT DF_Defects_Version DEFAULT 0,
    current_judgment_id int NULL,
    CONSTRAINT UQ_Defects_Business UNIQUE(batch_id, defect_no),
    CONSTRAINT CK_Defects_Version CHECK(version_no >= 0)
);
CREATE TABLE dbo.Judgments (
    judgment_id int NOT NULL CONSTRAINT PK_Judgments PRIMARY KEY,
    defect_id int NOT NULL CONSTRAINT FK_Judgments_Defects REFERENCES dbo.Defects(defect_id),
    score int NOT NULL CONSTRAINT CK_Judgments_Score CHECK(score BETWEEN 0 AND 100),
    model_version nvarchar(40) NOT NULL,
    operator_name nvarchar(40) NOT NULL,
    created_at datetime2(7) NOT NULL CONSTRAINT DF_Judgments_Time DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Judgments_Owner UNIQUE(defect_id, judgment_id)
);
-- 複合外鍵：目前指標不得指向另一個缺陷的判定。
ALTER TABLE dbo.Defects ADD CONSTRAINT FK_Defects_Current
    FOREIGN KEY(defect_id, current_judgment_id)
    REFERENCES dbo.Judgments(defect_id, judgment_id);
CREATE TABLE dbo.Operations (
    operation_id uniqueidentifier NOT NULL CONSTRAINT PK_Operations PRIMARY KEY,
    defect_id int NOT NULL,
    expected_version int NOT NULL,
    score int NOT NULL CONSTRAINT CK_Operations_Score CHECK(score BETWEEN 0 AND 100),
    model_version nvarchar(40) NOT NULL,
    operator_name nvarchar(40) NOT NULL,
    judgment_id int NOT NULL,
    result_version int NOT NULL,
    CONSTRAINT CK_Operations_Version CHECK(expected_version >= 0 AND result_version = expected_version + 1),
    CONSTRAINT FK_Operations_Judgment FOREIGN KEY(defect_id, judgment_id)
        REFERENCES dbo.Judgments(defect_id, judgment_id)
);
CREATE SEQUENCE dbo.JudgmentIds AS int START WITH 1000 INCREMENT BY 1;
INSERT dbo.Batches(batch_id,label) VALUES(10,N'A'),(20,N'B');
INSERT dbo.Defects(defect_id,batch_id,defect_no) VALUES(1,10,1),(2,10,2),(3,20,1);
INSERT dbo.Judgments(judgment_id,defect_id,score,model_version,operator_name,created_at)
VALUES(101,1,80,N'm1',N'lin','2026-01-01T00:00:00'),
      (102,1,90,N'm2',N'lin','2026-01-02T00:00:00'),
      (103,3,70,N'm1',N'chen','2026-01-01T00:00:00');
UPDATE dbo.Defects SET current_judgment_id = 102 WHERE defect_id = 1;
UPDATE dbo.Defects SET current_judgment_id = 103 WHERE defect_id = 3;
-- version_no=0 是載入合成歷史後的編修基線，不是历史判定筆數。
COMMIT;
GO

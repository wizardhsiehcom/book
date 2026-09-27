USE B02Lab;
GO
-- 局部「接收端替身」，不是兩系統原子提交的證明。僅執行一次建表。
CREATE TABLE dbo.Outbox (
    event_id uniqueidentifier NOT NULL PRIMARY KEY,
    judgment_id int NOT NULL REFERENCES dbo.Judgments(judgment_id),
    sent_at datetime2(7) NULL
);
CREATE TABLE dbo.ReceiverEffects (
    event_id uniqueidentifier NOT NULL PRIMARY KEY,
    judgment_id int NOT NULL
);
GO
-- 以具名實驗事件展示relay窗口。正式整合時需把INSERT Outbox放在
-- ApplyJudgment同一交易中、COMMIT之前，且僅走首次操作分支。
-- 本檔只測relay，沒有實作該程序整合。
INSERT dbo.Outbox(event_id,judgment_id)
VALUES('b0200000-0000-0000-0000-000000000017',101);
GO
-- 第一次投遞成功，但故意不更新Outbox.sent_at（模擬確認遺失）。
INSERT dbo.ReceiverEffects(event_id,judgment_id)
SELECT event_id,judgment_id FROM dbo.Outbox
WHERE event_id='b0200000-0000-0000-0000-000000000017';
GO
SET XACT_ABORT ON;
BEGIN TRANSACTION;
-- 第二次投遞，相同event_id已存在，替身不再次產生效果。
IF NOT EXISTS(SELECT 1 FROM dbo.ReceiverEffects WITH(UPDLOCK,HOLDLOCK)
              WHERE event_id='b0200000-0000-0000-0000-000000000017')
    INSERT dbo.ReceiverEffects(event_id,judgment_id)
    VALUES('b0200000-0000-0000-0000-000000000017',101);
COMMIT;
-- 接收端確認之後，發送端另一次本地提交；兩次COMMIT之間可再次中斷。
UPDATE dbo.Outbox SET sent_at=SYSUTCDATETIME()
WHERE event_id='b0200000-0000-0000-0000-000000000017';
IF (SELECT COUNT(*) FROM dbo.ReceiverEffects) <> 1
    THROW 51400, N'替身效果不應重複', 1;
GO

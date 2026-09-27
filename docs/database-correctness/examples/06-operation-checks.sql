USE B02Lab;
GO
SET NOCOUNT ON;
-- 固定ID表示固定意圖；此檔可重跑，但請勿跟其他寫入案例同時執行。
DECLARE @first uniqueidentifier='b0200000-0000-0000-0000-000000000001';
DECLARE @later uniqueidentifier='b0200000-0000-0000-0000-000000000002';
EXEC dbo.ApplyJudgment @first,2,0,80,N'm1',N'lin';
DECLARE @saved int=(SELECT judgment_id FROM dbo.Operations WHERE operation_id=@first);
DECLARE @before_replay int=(SELECT COUNT(*) FROM dbo.Judgments WHERE defect_id=2);
EXEC dbo.ApplyJudgment @first,2,0,80,N'm1',N'lin';
IF (SELECT COUNT(*) FROM dbo.Judgments WHERE defect_id=2) <> @before_replay
    THROW 51300, N'順序重送產生額外判定', 1;
BEGIN TRY
    EXEC dbo.ApplyJudgment @first,2,0,81,N'm1',N'lin';
    THROW 51301, N'異意圖未被拒絕', 1;
END TRY
BEGIN CATCH
    IF ERROR_NUMBER() <> 51202 THROW;
END CATCH;
BEGIN TRY
    -- 預期版本錯誤的「新」意圖必須整筆失敗。
    EXEC dbo.ApplyJudgment 'b0200000-0000-0000-0000-000000000003',2,99,50,N'm1',N'lin';
    THROW 51302, N'版本衝突未被拒絕', 1;
END TRY
BEGIN CATCH
    IF ERROR_NUMBER() <> 51203 THROW;
END CATCH;
BEGIN TRY
    EXEC dbo.ApplyJudgment @first,2,0,80,N'm1 ',N'lin'; -- 尾端空白屬不同意圖
    THROW 51309, N'尾端空白被誤認為相同意圖', 1;
END TRY
BEGIN CATCH
    IF ERROR_NUMBER() <> 51202 THROW;
END CATCH;
BEGIN TRY
    EXEC dbo.ApplyJudgment @first,2,0,NULL,N'm1',N'lin';
    THROW 51310, N'NULL分數未被拒絕', 1;
END TRY
BEGIN CATCH
    IF ERROR_NUMBER() <> 51201 THROW;
END CATCH;
EXEC dbo.ApplyJudgment @later,2,1,90,N'm2',N'chen';
EXEC dbo.ApplyJudgment @first,2,0,80,N'm1',N'lin'; -- 應回第一次80，不是現在90
IF (SELECT judgment_id FROM dbo.Operations WHERE operation_id=@first) <> @saved
    THROW 51303, N'舊操作結果漂移', 1;
IF (SELECT COUNT(*) FROM dbo.Judgments WHERE defect_id=2) <> 2
    THROW 51304, N'合法重判後應有2筆', 1;
IF (SELECT version_no FROM dbo.Defects WHERE defect_id=2) <> 2
    THROW 51305, N'編修版本應為2', 1;
IF EXISTS(SELECT 1 FROM dbo.Operations WHERE operation_id='b0200000-0000-0000-0000-000000000003')
    THROW 51306, N'版本衝突留下成功紀錄', 1;
IF NOT EXISTS(SELECT 1 FROM dbo.Defects d JOIN dbo.Judgments j
              ON j.judgment_id=d.current_judgment_id AND j.defect_id=d.defect_id
              WHERE d.defect_id=2 AND j.score=90)
    THROW 51307, N'目前判定指標不正確', 1;
IF @@TRANCOUNT <> 0 THROW 51308, N'交易未清理', 1;
PRINT N'L05 順序重送/異意圖/重判斷言通過；並行與真實斷線另驗。';
GO

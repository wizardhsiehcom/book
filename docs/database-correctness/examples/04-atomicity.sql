USE B02Lab;
GO
SET NOCOUNT ON;
SET XACT_ABORT ON;
DECLARE @before int = (SELECT version_no FROM dbo.Defects WHERE defect_id=2);
BEGIN TRY
    BEGIN TRANSACTION;
    UPDATE dbo.Defects SET version_no=version_no+1 WHERE defect_id=2;
    INSERT dbo.Judgments(judgment_id,defect_id,score,model_version,operator_name)
        VALUES(900,2,101,N'm1',N'atomicity'); -- 故意違反分數約束
    COMMIT;
    THROW 51110, N'預期約束失敗卻成功', 1;
END TRY
BEGIN CATCH
    DECLARE @error int=ERROR_NUMBER();
    SELECT @error AS error_number, XACT_STATE() AS state_before_cleanup;
    IF XACT_STATE() <> 0 ROLLBACK;
    IF @error <> 547 THROW;
END CATCH;
IF (SELECT version_no FROM dbo.Defects WHERE defect_id=2) <> @before
    THROW 51111, N'版本未回滾', 1;
IF EXISTS (SELECT 1 FROM dbo.Judgments WHERE judgment_id=900)
    THROW 51112, N'失敗判定殘留', 1;
IF @@TRANCOUNT <> 0 THROW 51113, N'交易未清理', 1;
SELECT defect_id,version_no FROM dbo.Defects WHERE defect_id=2;
-- 再用全新連線讀同一列，比對 @before；單一 session 斷言不是新連線證據。
GO

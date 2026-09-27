USE B02Lab;
GO
-- 先載入01-schema。此程序自行管理交易；呼叫者不得帶入既有交易。
CREATE OR ALTER PROCEDURE dbo.ApplyJudgment
    @operation_id uniqueidentifier,
    @defect_id int,
    @expected_version int,
    @score int,
    @model_version nvarchar(max),
    @operator_name nvarchar(max)
AS
BEGIN
    SET NOCOUNT ON;
    IF @@TRANCOUNT <> 0 THROW 51200, N'請以沒有既有交易的連線呼叫', 1;
    SET XACT_ABORT ON;
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
    IF @operation_id IS NULL OR @operation_id='00000000-0000-0000-0000-000000000000'
       OR @defect_id IS NULL OR @defect_id <= 0
       OR @expected_version IS NULL OR @expected_version < 0 OR @expected_version >= 2147483647
       OR @score IS NULL OR @score < 0 OR @score > 100
       OR @model_version IS NULL OR DATALENGTH(@model_version) NOT BETWEEN 2 AND 80
       OR @operator_name IS NULL OR DATALENGTH(@operator_name) NOT BETWEEN 2 AND 80
        THROW 51201, N'輸入不符合契約', 1;
    SET LOCK_TIMEOUT 5000;
    BEGIN TRY
        BEGIN TRANSACTION;
        -- 既有鍵或不存在的鍵範圍均鎖至交易結束；不靠先查再寫的時間差。
        IF EXISTS (SELECT 1 FROM dbo.Operations WITH (UPDLOCK,HOLDLOCK)
                   WHERE operation_id=@operation_id)
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM dbo.Operations WHERE operation_id=@operation_id
                  AND defect_id=@defect_id AND expected_version=@expected_version AND score=@score
                  AND CONVERT(varbinary(max),model_version)=CONVERT(varbinary(max),@model_version)
                  AND CONVERT(varbinary(max),operator_name)=CONVERT(varbinary(max),@operator_name)
            ) THROW 51202, N'相同操作ID帶入不同意圖', 1;
            COMMIT;
            SELECT operation_id,judgment_id,result_version,score FROM dbo.Operations
                WHERE operation_id=@operation_id;
            RETURN;
        END;
        UPDATE dbo.Defects SET version_no=version_no+1
            WHERE defect_id=@defect_id AND version_no=@expected_version;
        IF @@ROWCOUNT <> 1 THROW 51203, N'缺陷不存在或版本衝突；重新讀取，不盲目改版重送', 1;
        DECLARE @judgment_id int=NEXT VALUE FOR dbo.JudgmentIds;
        INSERT dbo.Judgments(judgment_id,defect_id,score,model_version,operator_name)
            VALUES(@judgment_id,@defect_id,@score,@model_version,@operator_name);
        UPDATE dbo.Defects SET current_judgment_id=@judgment_id WHERE defect_id=@defect_id;
        INSERT dbo.Operations(operation_id,defect_id,expected_version,score,model_version,
                             operator_name,judgment_id,result_version)
            VALUES(@operation_id,@defect_id,@expected_version,@score,@model_version,
                   @operator_name,@judgment_id,@expected_version+1);
        COMMIT;
        SELECT operation_id,judgment_id,result_version,score FROM dbo.Operations
            WHERE operation_id=@operation_id;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK;
        THROW;
    END CATCH;
END;
GO
-- 管理員將實際的專用開發使用者加入此 role；此處不建立密碼或伺服器登入。
IF DATABASE_PRINCIPAL_ID(N'B02Writer') IS NULL CREATE ROLE B02Writer;
GRANT EXECUTE ON dbo.ApplyJudgment TO B02Writer;
GRANT SELECT ON dbo.Defects TO B02Writer;
GRANT SELECT ON dbo.Judgments TO B02Writer;
GRANT SELECT ON dbo.Operations TO B02Writer;
-- 不給此 role 直接修改 Judgments/Operations 的權限。
-- ownership chaining 讓相同 owner 的程序可寫資料表。
GO

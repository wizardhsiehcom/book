USE B02Lab;
GO
SET NOCOUNT ON;
SET XACT_ABORT ON;
BEGIN TRY
    INSERT dbo.Defects(defect_id,batch_id,defect_no) VALUES(4,10,1);
    THROW 51700, N'重複業務鍵未被拒絕',1;
END TRY BEGIN CATCH
    IF ERROR_NUMBER()<>2627 THROW;
    SELECT ERROR_NUMBER() AS duplicate_business_key;
END CATCH;
BEGIN TRY
    INSERT dbo.Defects(defect_id,batch_id,defect_no) VALUES(4,999,9);
    THROW 51701, N'無主批次未被拒絕',1;
END TRY BEGIN CATCH
    IF ERROR_NUMBER()<>547 THROW;
    SELECT ERROR_NUMBER() AS missing_parent;
END CATCH;
BEGIN TRY
    INSERT dbo.Judgments(judgment_id,defect_id,score,model_version,operator_name)
        VALUES(104,1,NULL,N'm1',N'lin');
    THROW 51702, N'NULL分數未被拒絕',1;
END TRY BEGIN CATCH
    IF ERROR_NUMBER()<>515 THROW;
    SELECT ERROR_NUMBER() AS missing_score;
END CATCH;
BEGIN TRY
    UPDATE dbo.Defects SET current_judgment_id=103 WHERE defect_id=1;
    THROW 51703, N'跨缺陷指標未被拒絕',1;
END TRY BEGIN CATCH
    IF ERROR_NUMBER()<>547 THROW;
    SELECT ERROR_NUMBER() AS wrong_current_owner;
END CATCH;
DECLARE @CheckProbe TABLE(score int NULL CHECK(score BETWEEN 0 AND 100));
INSERT @CheckProbe VALUES(NULL);
IF (SELECT COUNT(*) FROM @CheckProbe)<>1 THROW 51704,N'CHECK UNKNOWN預測不符',1;
DECLARE @UniqueProbe TABLE(value int NULL UNIQUE);
INSERT @UniqueProbe VALUES(NULL);
BEGIN TRY
    INSERT @UniqueProbe VALUES(NULL);
    THROW 51705,N'單欄UNIQUE允許第二列NULL',1;
END TRY BEGIN CATCH
    IF ERROR_NUMBER()<>2627 THROW;
    SELECT ERROR_NUMBER() AS duplicate_null;
END CATCH;
IF @@TRANCOUNT<>0 THROW 51706,N'測試留下交易',1;
GO

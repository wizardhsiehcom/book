USE B02Lab;
GO
SET NOCOUNT ON;
-- 必須是剛載入、未被其他實驗變更的 seed。
IF (SELECT COUNT(*) FROM dbo.Defects) <> 3 THROW 51100, N'缺陷數應為3', 1;
IF (SELECT COUNT(*) FROM dbo.Judgments) <> 3 THROW 51101, N'判定數應為3', 1;
IF (SELECT COUNT(*) FROM dbo.Defects d LEFT JOIN dbo.Judgments j ON j.defect_id=d.defect_id) <> 4
    THROW 51102, N'LEFT JOIN 應有4列', 1;
IF EXISTS (
    SELECT d.defect_id, COUNT(j.judgment_id) AS n
    FROM dbo.Defects d LEFT JOIN dbo.Judgments j ON j.defect_id=d.defect_id
    GROUP BY d.defect_id
    EXCEPT SELECT v.id,v.n FROM (VALUES(1,2),(2,0),(3,1)) v(id,n)
) THROW 51103, N'各缺陷事件數應為2/0/1', 1;
IF EXISTS (SELECT x FROM (VALUES(1),(2)) a(x) WHERE x NOT IN (1,NULL))
    THROW 51104, N'NOT IN 含NULL不應選到列', 1;
SELECT d.defect_id,j.judgment_id,j.score
FROM dbo.Defects d LEFT JOIN dbo.Judgments j ON j.defect_id=d.defect_id
ORDER BY d.defect_id,j.judgment_id;
PRINT N'L01 查詢斷言通過；不代表其他實驗已驗證。';
GO

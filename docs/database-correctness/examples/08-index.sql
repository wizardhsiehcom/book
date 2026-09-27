USE B02Lab;
GO
-- 每次新連線的局部探針，與業務資料分開。固定10,000筆合成資料。
SET NOCOUNT ON;
CREATE TABLE #JudgmentProbe (
    judgment_id int NOT NULL,
    defect_id int NOT NULL,
    created_at datetime2 NOT NULL,
    score int NOT NULL
);
WITH d(n) AS (SELECT n FROM (VALUES(0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) v(n)),
nums AS (SELECT a.n+10*b.n+100*c.n+1000*d.n AS n FROM d a CROSS JOIN d b CROSS JOIN d c CROSS JOIN d)
INSERT #JudgmentProbe(judgment_id,defect_id,created_at,score)
SELECT n+1,n%100+1,DATEADD(second,n,CONVERT(datetime2,'2026-01-01')),n%101 FROM nums;
SELECT judgment_id,created_at,score INTO #Before FROM #JudgmentProbe WHERE defect_id=1;
PRINT 'BEFORE selective';
SET STATISTICS IO ON;
SET STATISTICS XML ON;
SELECT judgment_id,created_at,score FROM #JudgmentProbe
WHERE defect_id=1 ORDER BY created_at DESC,judgment_id DESC;
SET STATISTICS XML OFF;
SET STATISTICS IO OFF;
CREATE INDEX IX_Probe_History ON #JudgmentProbe(defect_id,created_at DESC,judgment_id DESC) INCLUDE(score);
PRINT 'AFTER selective';
SET STATISTICS IO ON;
SET STATISTICS XML ON;
SELECT judgment_id,created_at,score FROM #JudgmentProbe
WHERE defect_id=1 ORDER BY created_at DESC,judgment_id DESC;
SET STATISTICS XML OFF;
SET STATISTICS IO OFF;
IF EXISTS (SELECT judgment_id,created_at,score FROM #Before
           EXCEPT SELECT judgment_id,created_at,score FROM #JudgmentProbe WHERE defect_id=1)
OR EXISTS (SELECT judgment_id,created_at,score FROM #JudgmentProbe WHERE defect_id=1
           EXCEPT SELECT judgment_id,created_at,score FROM #Before)
    THROW 51500, N'索引前後結果不同', 1;
PRINT 'AFTER broad';
SET STATISTICS IO ON;
SELECT COUNT_BIG(*) AS matched_rows,SUM(CONVERT(bigint,score)) AS score_sum
FROM #JudgmentProbe WHERE defect_id<=95;
SET STATISTICS IO OFF;
DROP INDEX IX_Probe_History ON #JudgmentProbe;
PRINT 'BEFORE broad (index removed)';
SET STATISTICS IO ON;
SELECT COUNT_BIG(*) AS matched_rows,SUM(CONVERT(bigint,score)) AS score_sum
FROM #JudgmentProbe WHERE defect_id<=95;
SET STATISTICS IO OFF;
-- 高命中聚合和上面的明細查詢是兩個工作負載，不能彼此直接比較。
GO

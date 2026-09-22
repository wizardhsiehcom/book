USE FieldTricksLab;
SELECT job_id, input_value, score FROM dbo.Jobs ORDER BY job_id;
SELECT operation_id, job_id, score FROM dbo.Operations WHERE operation_id='chapter-15';
SELECT COUNT(*) AS open_lab_transactions FROM sys.dm_exec_sessions
WHERE program_name='CppSqlFieldLab' AND open_transaction_count > 0;

-- One-time transition of this freshly-created lab, preserving earlier experiment evidence.
USE FieldTricksLab;
IF NOT EXISTS (SELECT 1 FROM dbo.Jobs WHERE job_id=15)
    INSERT dbo.Jobs(job_id,input_value,note) VALUES(15,10,NULL);

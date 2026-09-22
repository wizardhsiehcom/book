-- Only run inside the NEW book-cpp-sql-lab container; no existing DB is reused.
IF DB_ID(N'FieldTricksLab') IS NOT NULL
    THROW 50001, 'Lab DB already exists: refusing to reseed', 1;
GO
CREATE DATABASE FieldTricksLab;
GO
USE FieldTricksLab;
CREATE TABLE dbo.Jobs (
    job_id int NOT NULL PRIMARY KEY,
    input_value int NOT NULL,
    note nvarchar(200) NULL,
    score int NULL,
    version_no int NOT NULL DEFAULT 0
);
INSERT dbo.Jobs(job_id,input_value,note) VALUES (1,10,NULL),(15,10,NULL);
CREATE TABLE dbo.Operations (
    operation_id varchar(64) NOT NULL PRIMARY KEY,
    job_id int NOT NULL,
    score int NOT NULL
);
GO

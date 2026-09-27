USE B02Lab;
GO
SELECT @@VERSION AS engine_version,
       SERVERPROPERTY('Edition') AS edition,
       SERVERPROPERTY('ProductVersion') AS product_version,
       @@SPID AS session_id, @@TRANCOUNT AS transaction_count;
SELECT name, compatibility_level, is_read_committed_snapshot_on,
       snapshot_isolation_state_desc, delayed_durability_desc, recovery_model_desc
FROM sys.databases WHERE database_id = DB_ID();
SELECT @@LOCK_TIMEOUT AS lock_timeout_ms, XACT_STATE() AS transaction_state;
DBCC USEROPTIONS;
-- 另記錄客戶端版本、OS/CPU、driver、連線加密與 autocommit 行為。
GO

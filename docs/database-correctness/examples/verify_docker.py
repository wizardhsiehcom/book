# B02 Docker 實驗驗收；只操作帶 book=b02 label 的 b02-sql2022。
# 需要 Docker CLI、Python 3；容器內使用 SQL Server 官方 sqlcmd。
import subprocess, pathlib, selectors, os, time, uuid, tempfile
SQL_DIR=pathlib.Path(__file__).resolve().parent
OUT=pathlib.Path(tempfile.mkdtemp(prefix='b02-evidence-'))
print('Evidence directory:', OUT, flush=True)
CMD=['docker','exec','-i','b02-sql2022','bash','-lc','export SQLCMDPASSWORD="$MSSQL_SA_PASSWORD"; exec stdbuf -oL -eL /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C -b -r1 -y0 -w65535']
def sql(text,name,expect=0):
 p=subprocess.run(CMD,input=text,text=True,capture_output=True,timeout=90)
 (OUT/(name+'.txt')).write_text(p.stdout+'\n'+p.stderr)
 if p.returncode!=expect:raise RuntimeError(name+': '+p.stdout[-2000:]+p.stderr[-2000:])
 return p.stdout+p.stderr
class Session:
 def __init__(self,db='B02Concurrent'):
  self.p=subprocess.Popen(CMD,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
  self.sel=selectors.DefaultSelector();self.sel.register(self.p.stdout,selectors.EVENT_READ);self.pending=b''
  self.run('USE '+db+'; SET NOCOUNT ON; SET IMPLICIT_TRANSACTIONS OFF; SET XACT_ABORT ON; SET LOCK_TIMEOUT 10000;')
 def send(self,q):
  marker='B02DONE'+uuid.uuid4().hex
  self.p.stdin.write((q+"\nSELECT '"+marker+"';\nGO\n").encode());self.p.stdin.flush();return marker
 def read(self,marker,timeout=25):
  end=time.monotonic()+timeout;out=self.pending;self.pending=b''
  while marker.encode() not in out:
   if self.p.poll() is not None:
    out+=self.p.stdout.read();raise RuntimeError(out.decode())
   if time.monotonic()>end:raise TimeoutError(out.decode())
   for key,_ in self.sel.select(0.2):out+=os.read(key.fd,65536)
  before,after=out.split(marker.encode(),1);self.pending=after
  return before.decode()
 def run(self,q):return self.read(self.send(q))
 def close(self):
  if self.p.poll() is None:
   try:self.run('IF XACT_STATE()<>0 ROLLBACK;')
   except Exception:pass
   self.p.stdin.close()
   try:self.p.wait(timeout=5)
   except subprocess.TimeoutExpired:self.p.terminate()
  self.sel.close()
if __name__=='__main__':
 # 入口先限制container label，避免對不屬於本書的SQL主機操作。
 label=subprocess.check_output(['docker','inspect','--format','{{ index .Config.Labels "book" }}','b02-sql2022'],text=True).strip()
 assert label=='b02',label
 sql("USE master; IF DB_ID(N'B02Lab') IS NOT NULL OR DB_ID(N'B02Concurrent') IS NOT NULL OR DB_ID(N'B02Restored') IS NOT NULL THROW 51699,'Expected new empty B02 lab container',1;",'empty-lab-guard')
 for f in sorted((SQL_DIR).glob('*.sql')):
  sql(f.read_text(),f.stem)
 print('SQL files passed',flush=True)
 for f in ['00-create.sql','01-schema.sql','05-apply.sql']:
  sql((SQL_DIR/f).read_text().replace('B02Lab','B02Concurrent'),'concurrent-'+f)
 a=Session();b=Session()
 try:
  a.run('BEGIN TRAN; UPDATE dbo.Defects SET version_no=version_no+1 WHERE defect_id=1;')
  # A has acknowledged holding its uncommitted write lock. B must time out.
  blocked=b.run('SET LOCK_TIMEOUT 500; BEGIN TRY SELECT version_no FROM dbo.Defects WHERE defect_id=1; END TRY BEGIN CATCH SELECT ERROR_NUMBER() AS e; END CATCH;')
  assert '1222' in blocked,blocked
  a.run('ROLLBACK;');(OUT/'lock-timeout.txt').write_text(blocked)
  # Two readers both see the initial version. Atomic conditional updates protect it.
  a.run("IF (SELECT version_no FROM dbo.Defects WHERE defect_id=1)<>0 THROW 51600,'bad seed',1;")
  b.run('SELECT version_no FROM dbo.Defects WHERE defect_id=1;')
  a.run('UPDATE dbo.Defects SET version_no=version_no+1 WHERE defect_id=1 AND version_no=0; IF @@ROWCOUNT<>1 THROW 51601,\'A lost\',1;')
  b.run('UPDATE dbo.Defects SET version_no=version_no+1 WHERE defect_id=1 AND version_no=0; IF @@ROWCOUNT<>0 THROW 51602,\'B overwrote\',1;')
  # Deterministic lock acquisition order, then overlap cross requests.
  a.run('SET LOCK_TIMEOUT 15000; BEGIN TRAN; UPDATE dbo.Defects SET version_no=version_no+1 WHERE defect_id=1;')
  b.run('SET LOCK_TIMEOUT 15000; BEGIN TRAN; UPDATE dbo.Defects SET version_no=version_no+1 WHERE defect_id=3;')
  qa=a.send('BEGIN TRY UPDATE dbo.Defects SET version_no=version_no+1 WHERE defect_id=3; END TRY BEGIN CATCH SELECT ERROR_NUMBER() AS e; END CATCH; IF XACT_STATE()<>0 ROLLBACK;')
  qb=b.send('BEGIN TRY UPDATE dbo.Defects SET version_no=version_no+1 WHERE defect_id=1; END TRY BEGIN CATCH SELECT ERROR_NUMBER() AS e; END CATCH; IF XACT_STATE()<>0 ROLLBACK;')
  dead=a.read(qa)+b.read(qb);assert '1205' in dead,dead;(OUT/'deadlock.txt').write_text(dead)
  print('lock timeout, optimistic update and deadlock passed',flush=True)
 finally:a.close();b.close()
 # RCSI and SNAPSHOT in the separate concurrency database, after all sessions close.
 sql('USE master; ALTER DATABASE B02Concurrent SET READ_COMMITTED_SNAPSHOT ON; ALTER DATABASE B02Concurrent SET ALLOW_SNAPSHOT_ISOLATION ON;','enable-versions')
 a=Session();b=Session()
 try:
  a.run('BEGIN TRAN; UPDATE dbo.Defects SET version_no=version_no+1 WHERE defect_id=3;')
  r=b.run("IF (SELECT version_no FROM dbo.Defects WHERE defect_id=3)<>0 THROW 51603,'RCSI dirty read',1; SELECT 'RCSI old=0';")
  a.run('COMMIT;')
  r+=b.run("IF (SELECT version_no FROM dbo.Defects WHERE defect_id=3)<>1 THROW 51604,'RCSI missed commit',1; SELECT 'RCSI new=1';")
  a.run('SET TRANSACTION ISOLATION LEVEL SNAPSHOT; BEGIN TRAN;')
  b.run('UPDATE dbo.Defects SET version_no=version_no+1 WHERE defect_id=3;')
  r+=a.run("IF (SELECT version_no FROM dbo.Defects WHERE defect_id=3)<>2 THROW 51605,'snapshot early establishment',1; SELECT 'SNAPSHOT first=2';")
  b.run('UPDATE dbo.Defects SET version_no=version_no+1 WHERE defect_id=3;')
  r+=a.run("IF (SELECT version_no FROM dbo.Defects WHERE defect_id=3)<>2 THROW 51606,'snapshot moved',1; SELECT 'SNAPSHOT second=2'; COMMIT;")
  (OUT/'version-isolation.txt').write_text(r)
 finally:a.close();b.close()
 # Same operation overlaps a first transaction held open by explicit acknowledgement.
 a=Session();b=Session()
 try:
  op="'b0200000-0000-0000-0000-000000000051'"
  a.run(f'''BEGIN TRAN;
SELECT operation_id FROM dbo.Operations WITH(UPDLOCK,HOLDLOCK) WHERE operation_id={op};
UPDATE dbo.Defects SET version_no=version_no+1 WHERE defect_id=2 AND version_no=0;
IF @@ROWCOUNT<>1 THROW 51610,'operation seed',1;
DECLARE @j int=NEXT VALUE FOR dbo.JudgmentIds;
INSERT dbo.Judgments(judgment_id,defect_id,score,model_version,operator_name) VALUES(@j,2,80,N'm1',N'lin');
UPDATE dbo.Defects SET current_judgment_id=@j WHERE defect_id=2;
INSERT dbo.Operations VALUES({op},2,0,80,N'm1',N'lin',@j,1);''')
  qb=b.send(f"EXEC dbo.ApplyJudgment {op},2,0,80,N'm1',N'lin';")
  # Verify B really waits on a lock before releasing A: no fixed sleep controls ordering.
  sql("""USE B02Concurrent;
DECLARE @deadline datetime2=DATEADD(second,4,SYSUTCDATETIME());
WHILE NOT EXISTS(SELECT 1 FROM sys.dm_exec_requests WHERE database_id=DB_ID() AND blocking_session_id>0 AND wait_type LIKE 'LCK%')
BEGIN
 IF SYSUTCDATETIME()>@deadline THROW 51611,'No overlap observed',1;
 WAITFOR DELAY '00:00:00.020';
END;
SELECT session_id,blocking_session_id,wait_type FROM sys.dm_exec_requests
WHERE database_id=DB_ID() AND blocking_session_id>0;""",'concurrent-wait-evidence')
  a.run('COMMIT;');out=b.read(qb)
  out+=b.run("IF (SELECT COUNT(*) FROM dbo.Judgments WHERE defect_id=2)<>1 THROW 51612,'duplicate concurrent event',1; IF (SELECT version_no FROM dbo.Defects WHERE defect_id=2)<>1 THROW 51613,'duplicate version',1;")
  (OUT/'concurrent-operation.txt').write_text(out)
 finally:a.close();b.close()
 # Permission boundary: database-only test user does not create or expose a login secret.
 sql("""USE B02Lab;
CREATE USER B02ReaderWriter WITHOUT LOGIN;
ALTER ROLE B02Writer ADD MEMBER B02ReaderWriter;
EXECUTE AS USER=N'B02ReaderWriter';
EXEC dbo.ApplyJudgment 'b0200000-0000-0000-0000-000000000001',2,0,80,N'm1',N'lin';
BEGIN TRY
 UPDATE dbo.Judgments SET score=10 WHERE judgment_id=101;
 THROW 51620,'direct history write allowed',1;
END TRY BEGIN CATCH
 IF ERROR_NUMBER()<>229 THROW;
 SELECT ERROR_NUMBER() AS expected_denial;
END CATCH;
REVERT;""",'role-boundary')
 # Expand/backfill remain compatible with the current procedure; do not contract an old writer.
 sql("""USE B02Lab;
ALTER TABLE dbo.Operations ADD source_name nvarchar(40) NULL;
GO
UPDATE TOP(1) dbo.Operations SET source_name=N'legacy-unknown' WHERE source_name IS NULL;
SELECT COUNT(*) AS remaining_after_first_batch FROM dbo.Operations WHERE source_name IS NULL;
UPDATE dbo.Operations SET source_name=N'legacy-unknown' WHERE source_name IS NULL;
UPDATE dbo.Operations SET source_name=N'legacy-unknown' WHERE source_name IS NULL;
IF @@ROWCOUNT<>0 THROW 51630,'backfill not reentrant',1;
EXEC dbo.ApplyJudgment 'b0200000-0000-0000-0000-000000000018',1,0,60,N'm3',N'lin';
IF (SELECT COUNT(*) FROM dbo.Operations WHERE source_name IS NULL)<>1 THROW 51631,'old writer compatibility',1;
UPDATE dbo.Operations SET source_name=N'legacy-unknown' WHERE source_name IS NULL;
""",'migration-expand-backfill')
 # Backup path and restore names belong only to this new B02 container.
 sql("""USE master;
BACKUP DATABASE B02Lab TO DISK=N'/var/opt/mssql/data/b02-first-backup.bak' WITH COPY_ONLY,CHECKSUM;
RESTORE VERIFYONLY FROM DISK=N'/var/opt/mssql/data/b02-first-backup.bak' WITH CHECKSUM;
RESTORE FILELISTONLY FROM DISK=N'/var/opt/mssql/data/b02-first-backup.bak';
""",'backup')
 started=time.monotonic()
 sql("""USE master;
IF DB_ID(N'B02Restored') IS NOT NULL THROW 51640,'restore target exists',1;
RESTORE DATABASE B02Restored FROM DISK=N'/var/opt/mssql/data/b02-first-backup.bak'
WITH MOVE N'B02Lab' TO N'/var/opt/mssql/data/B02Restored.mdf',
MOVE N'B02Lab_log' TO N'/var/opt/mssql/data/B02Restored_log.ldf',CHECKSUM,RECOVERY;
DBCC CHECKDB(B02Restored) WITH NO_INFOMSGS;
IF EXISTS(SELECT * FROM B02Lab.dbo.Defects EXCEPT SELECT * FROM B02Restored.dbo.Defects)
OR EXISTS(SELECT * FROM B02Restored.dbo.Defects EXCEPT SELECT * FROM B02Lab.dbo.Defects)
OR EXISTS(SELECT * FROM B02Lab.dbo.Judgments EXCEPT SELECT * FROM B02Restored.dbo.Judgments)
OR EXISTS(SELECT * FROM B02Restored.dbo.Judgments EXCEPT SELECT * FROM B02Lab.dbo.Judgments)
OR EXISTS(SELECT * FROM B02Lab.dbo.Operations EXCEPT SELECT * FROM B02Restored.dbo.Operations)
OR EXISTS(SELECT * FROM B02Restored.dbo.Operations EXCEPT SELECT * FROM B02Lab.dbo.Operations)
THROW 51641,'restored rows differ',1;
""",'restore')
 (OUT/'restore-duration.txt').write_text(str(time.monotonic()-started)+' seconds including CHECKDB and comparison')
 print('RCSI, SNAPSHOT, concurrent dedup, role, migration and restore passed',flush=True)

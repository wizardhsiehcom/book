# Docker Desktop 本機 TCP 回覆中斷；先在空容器跑 verify_docker.py。
# 此例涵蓋提交完成但回覆遺失，以及COMMIT前中斷；不覆蓋每個內部時點。
import socket,threading,select,time,subprocess,uuid
import verify_docker as b02
class Proxy:
 def __init__(self):
  self.listener=socket.socket();self.listener.setsockopt(socket.SOL_SOCKET,socket.SO_REUSEADDR,1)
  self.listener.bind(('127.0.0.1',14339));self.listener.listen(1)
  self.arm=threading.Event();self.cut=threading.Event();self.stop=threading.Event();self.log=[]
  self.thread=threading.Thread(target=self.run,daemon=True);self.thread.start()
 def run(self):
  client,addr=self.listener.accept();server=socket.create_connection(('127.0.0.1',14332),timeout=5)
  try:
   while not self.stop.is_set():
    ready,_,_=select.select([client,server],[],[],0.1)
    for source in ready:
     data=source.recv(65536)
     if not data:return
     if source is server and self.arm.is_set():
      self.log.append({'event':'server_reply_dropped_and_tcp_closed','bytes':len(data),'time':time.time()});self.cut.set();return
     (server if source is client else client).sendall(data)
  finally:
   for s in (client,server):
    try:s.shutdown(socket.SHUT_RDWR)
    except OSError:pass
    s.close()
 def close(self):self.stop.set();self.listener.close();self.thread.join(timeout=3)
label=subprocess.check_output(['docker','inspect','--format','{{ index .Config.Labels "book" }}','b02-sql2022'],text=True).strip()
assert label=='b02',label
b02.sql("USE B02Concurrent; IF EXISTS(SELECT 1 FROM dbo.Operations WHERE operation_id='b0200000-0000-0000-0000-000000000061') THROW 51662,'This fault case already ran; use a fresh lab',1;",'network-precondition')
proxy=Proxy();original=b02.CMD;b02.CMD=[x.replace('-S localhost','-S host.docker.internal,14339') for x in original]
s=None
try:
 s=b02.Session('B02Concurrent')
 proxy.arm.set()
 marker=s.send("EXEC dbo.ApplyJudgment 'b0200000-0000-0000-0000-000000000061',2,1,95,N'm4',N'fault';")
 try:
  result=s.read(marker,timeout=20)
  raise AssertionError('Expected a transport error, got '+result)
 except RuntimeError as e:
  text=str(e);(b02.OUT/'network-client-error.txt').write_text(text)
  assert proxy.cut.is_set(),text
 finally:
  b02.CMD=original
 evidence=b02.sql("""USE B02Concurrent;
SELECT operation_id,score,result_version FROM dbo.Operations WHERE operation_id='b0200000-0000-0000-0000-000000000061';
IF NOT EXISTS(SELECT 1 FROM dbo.Operations WHERE operation_id='b0200000-0000-0000-0000-000000000061' AND score=95)
THROW 51660,'Dropped response did not observe a committed case',1;
EXEC dbo.ApplyJudgment 'b0200000-0000-0000-0000-000000000061',2,1,95,N'm4',N'fault';
IF (SELECT COUNT(*) FROM dbo.Judgments WHERE defect_id=2)<>2 THROW 51661,'Network retry duplicated operation',1;
""",'network-committed-reread')
 (b02.OUT/'network-proxy.txt').write_text(str(proxy.log)+'\nClient response was not decoded or fabricated; server reply bytes were dropped at TCP proxy.\n')
 print('Actual TCP response loss: committed operation recovered; retry did not duplicate')
finally:
 b02.CMD=original
 if s:s.close()
 proxy.close()
# 第二個案例：伺服器已暫存交易內容，但客戶端從未送出COMMIT。
proxy=Proxy();b02.CMD=[x.replace('-S localhost','-S host.docker.internal,14339') for x in original];s=None
try:
 s=b02.Session('B02Concurrent')
 spid=int(s.run('SELECT @@SPID;').strip())
 connection_id=str(uuid.UUID(s.run('SELECT CONVERT(varchar(36),connection_id) FROM sys.dm_exec_connections WHERE session_id=@@SPID;').strip()))
 s.run("""BEGIN TRAN;
UPDATE dbo.Defects SET version_no=version_no+1 WHERE defect_id=3 AND version_no=3;
IF @@ROWCOUNT<>1 THROW 51663,'unexpected rollback fixture',1;
DECLARE @j int=NEXT VALUE FOR dbo.JudgmentIds;
INSERT dbo.Judgments(judgment_id,defect_id,score,model_version,operator_name) VALUES(@j,3,30,N'm4',N'fault');
UPDATE dbo.Defects SET current_judgment_id=@j WHERE defect_id=3;
INSERT dbo.Operations VALUES('b0200000-0000-0000-0000-000000000062',3,3,30,N'm4',N'fault',@j,4);
""")
 transaction_id=int(s.run('SELECT transaction_id FROM sys.dm_tran_current_transaction;').strip())
 proxy.close() # 真正關閉TCP，沒有送出COMMIT或ROLLBACK。
 b02.CMD=original
 b02.sql(f"""USE B02Concurrent;
SET LOCK_TIMEOUT 5000;
DECLARE @deadline datetime2=DATEADD(second,5,SYSUTCDATETIME());
WHILE EXISTS(SELECT 1 FROM sys.dm_exec_connections WHERE connection_id='{connection_id}')
OR EXISTS(SELECT 1 FROM sys.dm_tran_active_transactions WHERE transaction_id={transaction_id})
BEGIN
 IF SYSUTCDATETIME()>@deadline THROW 51664,'old session still exists',1;
 WAITFOR DELAY '00:00:00.020';
END;
IF EXISTS(SELECT 1 FROM dbo.Operations WHERE operation_id='b0200000-0000-0000-0000-000000000062')
OR (SELECT version_no FROM dbo.Defects WHERE defect_id=3)<>3
OR (SELECT COUNT(*) FROM dbo.Judgments WHERE defect_id=3)<>1
OR (SELECT current_judgment_id FROM dbo.Defects WHERE defect_id=3)<>103
THROW 51665,'uncommitted operation survived TCP loss',1;
SELECT {spid} AS old_spid,@@SPID AS observer_spid,'old connection and transaction gone; operation absent; version=3; history count=1; current=103';
""",'network-uncommitted-reread')
 print('Actual TCP close before COMMIT: old session gone and full rollback confirmed')
finally:
 b02.CMD=original
 if s:s.close()
 proxy.close()

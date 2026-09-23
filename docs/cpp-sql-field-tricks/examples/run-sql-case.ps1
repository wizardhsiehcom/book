# 跑 sql_lab 的一個案例。先確認容器真的是這本書的、連接埠沒被改過，再把密碼放進環境變數。
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('mapping','diag','data','batch','bind','rows','rollback','lock','timing','timing-base','retry')]
    [string]$Case,
    [string]$Exe = '.\build\sql_lab.exe'
)
$ErrorActionPreference = 'Stop'
$lab = docker inspect book-cpp-sql-lab | ConvertFrom-Json
if ($LASTEXITCODE -ne 0 -or $lab[0].Config.Labels.purpose -ne 'cpp-sql-book') { throw 'Wrong lab container' }
# 只接受綁在本機 15439 的那個容器。連到別台或別的埠就停。
$port = $lab[0].NetworkSettings.Ports.'1433/tcp'
if ($port.HostIp -ne '127.0.0.1' -or $port.HostPort -ne '15439') { throw 'Unexpected lab port mapping' }
$env:BOOK_SQL_PASSWORD = ($lab[0].Config.Env | Where-Object { $_.StartsWith('MSSQL_SA_PASSWORD=') }).Substring(18)
try {
    & $Exe $Case
    $caseExit = $LASTEXITCODE
} finally { Remove-Item Env:BOOK_SQL_PASSWORD -ErrorAction SilentlyContinue }
exit $caseExit

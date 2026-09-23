# 只負責建立一個隔離的 SQL Server 容器。還沒灌資料，也還沒等它就緒。
$ErrorActionPreference = 'Stop'
$labName = 'book-cpp-sql-lab'
$existing = docker ps -a --filter "name=^/$labName$" --format '{{.Names}}'
if ($LASTEXITCODE -ne 0) { throw 'Docker is unavailable' }
# 同名容器已在就停。不刪、不重建，避免把上一輪的資料庫清掉。
if ($existing) { throw 'book-cpp-sql-lab already exists; do not overwrite it. Inspect or resume it explicitly.' }
# 密碼只放進這個容器的環境變數，不寫進指令列，也不留在目前這個 PowerShell 工作階段。
$env:MSSQL_SA_PASSWORD = 'Lab9!' + [guid]::NewGuid().ToString('N')
try {
    docker run --name $labName --label purpose=cpp-sql-book --memory 3g --cpus 2 `
        -e ACCEPT_EULA=Y -e MSSQL_PID=Developer -e MSSQL_SA_PASSWORD `
        -p 127.0.0.1:15439:1433 -d `
        mcr.microsoft.com/mssql/server@sha256:fbf79e0fea596dec4d91962654cbc217ce17b2c6c206130d57b6685a6a43e992
    if ($LASTEXITCODE -ne 0) { throw 'Container creation failed' }
} finally { Remove-Item Env:MSSQL_SA_PASSWORD -ErrorAction SilentlyContinue }
Write-Output 'Created isolated lab. No host data mount; localhost:15439 only. Readiness and seed are separate steps.'

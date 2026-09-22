$ErrorActionPreference = 'Stop'
$lab = docker inspect book-cpp-sql-lab | ConvertFrom-Json
if ($LASTEXITCODE -ne 0 -or $lab[0].Config.Labels.purpose -ne 'cpp-sql-book') { throw 'Wrong container' }
$env:BOOK_SQL_PASSWORD = ($lab[0].Config.Env | Where-Object { $_.StartsWith('MSSQL_SA_PASSWORD=') }).Substring(18)
try {
    foreach ($case in @('mapping','diag','data','batch','bind','rows','rollback','lock','timing-base','timing','timing-base','retry','retry')) {
        & "$PSScriptRoot\build\sql_lab.exe" $case
        if ($LASTEXITCODE -ne 0) { throw "Case failed: $case" }
    }
} finally { Remove-Item Env:BOOK_SQL_PASSWORD -ErrorAction SilentlyContinue }

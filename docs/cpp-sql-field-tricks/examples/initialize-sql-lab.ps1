$ErrorActionPreference = 'Stop'
$lab = docker inspect book-cpp-sql-lab | ConvertFrom-Json
if ($LASTEXITCODE -ne 0 -or $lab[0].Config.Labels.purpose -ne 'cpp-sql-book') { throw 'Wrong lab container' }
$labPassword = ($lab[0].Config.Env | Where-Object { $_.StartsWith('MSSQL_SA_PASSWORD=') }).Substring(18)
$env:SQLCMDPASSWORD = $labPassword
try {
    Get-Content "$PSScriptRoot\seed.sql" -Raw -Encoding UTF8 |
        docker exec -i -e SQLCMDPASSWORD book-cpp-sql-lab /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -b
    if ($LASTEXITCODE -ne 0) { throw 'Seed failed or DB exists. Do not overwrite existing evidence.' }
    "CREATE LOGIN book_lab WITH PASSWORD = '$labPassword'; USE FieldTricksLab; CREATE USER book_lab FOR LOGIN book_lab; GRANT SELECT, UPDATE, INSERT, DELETE ON dbo.Jobs TO book_lab; GRANT SELECT, INSERT ON dbo.Operations TO book_lab;" |
        docker exec -i -e SQLCMDPASSWORD book-cpp-sql-lab /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -b
    if ($LASTEXITCODE -ne 0) { throw 'Login creation failed; inspect this isolated container before retrying.' }
} finally { Remove-Item Env:SQLCMDPASSWORD -ErrorAction SilentlyContinue }

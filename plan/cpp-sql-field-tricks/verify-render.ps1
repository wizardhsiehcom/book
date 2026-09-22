$ErrorActionPreference = 'Stop'
$pages = @('00-map','00-workday','02-one-job','03-test-mode','04-snapshot','07-results','08-bind','11-rollback','12-lock-wait','15-retry')
$labBrowserProfile = Join-Path $env:TEMP ('cpp-sql-book-render-' + [guid]::NewGuid().ToString('N'))
foreach ($page in $pages) {
    # Windows PowerShell 5 turns native stderr warnings into terminating errors
    # under Stop. Check the process exit status and rendered DOM instead.
    $ErrorActionPreference = 'Continue'
    try {
        $dom = (& 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless=new --disable-gpu --no-first-run --no-default-browser-check --user-data-dir=$labBrowserProfile --virtual-time-budget=12000 --dump-dom "file:///D:/book/book/cpp-sql-field-tricks/html/$page.html" 2>$null | Out-String)
        $browserExit = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = 'Stop'
    }
    if ($browserExit -ne 0) { throw "Chrome failed: $page (exit=$browserExit)" }
    $processed = ([regex]::Matches($dom, 'data-processed="true"')).Count
    if ($processed -ne 1 -or $dom.Contains('Syntax error in text') -or -not $dom.Contains('<svg')) {
        throw "Mermaid render failed: $page (processed=$processed)"
    }
    Write-Output "$page rendered=1 error=0"
}

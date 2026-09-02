param(
  [string]$ConfigPath = "$PSScriptRoot\config.psd1"
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$config = Get-OopbuyDeployConfig -ConfigPath $ConfigPath
Use-OopbuyNodeRuntime
Remove-Item Env:\NO_COLOR -ErrorAction SilentlyContinue

$reportDir = Join-Path $config.ProjectRoot 'reports'
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$reportPath = Join-Path $reportDir "lowtoken-launch-check-$stamp.json"
$launchOutputPath = Join-Path $reportDir "lowtoken-launch-check-verify-launch-$stamp.log"
$utmOutputPath = Join-Path $reportDir "lowtoken-launch-check-curicart-utm-$stamp.log"

Push-Location -LiteralPath $config.ProjectRoot
try {
  & "$PSScriptRoot\verify-launch.ps1" -ConfigPath $ConfigPath > $launchOutputPath 2>&1
  if ($LASTEXITCODE -ne 0) { throw "verify-launch failed; see $launchOutputPath" }

  $sitemapXml = Get-CurlText -Url "$($config.ProductionUrl)/sitemap.xml"
  $paths = @([regex]::Matches($sitemapXml, '<loc>([^<]+)</loc>') | ForEach-Object {
    ([Uri]$_.Groups[1].Value).AbsolutePath
  })
  & "$PSScriptRoot\assert-curicart-links.ps1" -ConfigPath $ConfigPath -Paths $paths > $utmOutputPath 2>&1
  if ($LASTEXITCODE -ne 0) { throw "CuriCart UTM assertion failed; see $utmOutputPath" }

  $wwwHead = Invoke-CurlHead -Url $config.WwwUrl
  $robotsText = Get-CurlText -Url "$($config.ProductionUrl)/robots.txt"
  $questions = Get-Content -LiteralPath (Join-Path $config.ProjectRoot 'content\questions.json') -Raw -Encoding UTF8 | ConvertFrom-Json
  $indexableQuestions = @($questions | Where-Object { $_.status -eq 'approved' -and $_.indexable -eq $true } | ForEach-Object { "/questions/$($_.slug)" })
  $heldQuestions = @($questions | Where-Object { -not ($_.status -eq 'approved' -and $_.indexable -eq $true) } | ForEach-Object { "/questions/$($_.slug)" })

  $report = [ordered]@{
    generated_at = (Get-Date).ToString('s')
    production_url = $config.ProductionUrl
    sitemap_url_count = $paths.Count
    indexable_questions = $indexableQuestions
    not_indexable_or_not_public_questions = $heldQuestions
    www_status = ($wwwHead -split "`t")[1]
    robots_allows_root = ($robotsText -match 'Allow:\s*/')
    robots_has_sitemap = ($robotsText -match [regex]::Escape("$($config.ProductionUrl)/sitemap.xml"))
    verify_launch_log = $launchOutputPath
    curicart_utm_log = $utmOutputPath
    report_path = $reportPath
  }
  $report | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $reportPath -Encoding UTF8

  Write-Output "LAUNCH_CHECK_OK sitemap_urls=$($paths.Count) indexable_questions=$($indexableQuestions.Count) utm=ok report=$reportPath"
} finally {
  Pop-Location
}

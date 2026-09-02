param(
  [string]$ConfigPath = "$PSScriptRoot\config.psd1"
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$config = Get-OopbuyDeployConfig -ConfigPath $ConfigPath
Use-OopbuyNodeRuntime

$reportDir = Join-Path $config.ProjectRoot 'reports'
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$reportPath = Join-Path $reportDir "lowtoken-status-$stamp.json"

Push-Location -LiteralPath $config.ProjectRoot
try {
  $gitBranch = (& git status --branch --short | Select-Object -First 1)
  $gitShort = @(& git status --short)
  $dirtySource = @($gitShort | Where-Object {
    $_ -notmatch ' reports[\\/]' -and
    $_ -notmatch 'reports[\\/]' -and
    $_ -notmatch '^\?\? reports[\\/]'
  })
  $commit = (& git rev-parse --short HEAD).Trim()
  $remote = (& git remote get-url origin).Trim()

  $questionsPath = Join-Path $config.ProjectRoot 'content\questions.json'
  $questions = Get-Content -LiteralPath $questionsPath -Raw -Encoding UTF8 | ConvertFrom-Json
  $indexable = @($questions | Where-Object { $_.status -eq 'approved' -and $_.indexable -eq $true } | ForEach-Object { "/questions/$($_.slug)" })
  $notIndexable = @($questions | Where-Object { -not ($_.status -eq 'approved' -and $_.indexable -eq $true) } | ForEach-Object {
    [ordered]@{ path = "/questions/$($_.slug)"; status = $_.status; indexable = [bool]$_.indexable }
  })

  $robots = $null
  $sitemapCount = $null
  $wwwStatus = $null
  try {
    $robots = Get-CurlText -Url "$($config.ProductionUrl)/robots.txt"
    $sitemapXml = Get-CurlText -Url "$($config.ProductionUrl)/sitemap.xml"
    $sitemapCount = ([regex]::Matches($sitemapXml, '<loc>')).Count
    $wwwHead = Invoke-CurlHead -Url $config.WwwUrl
    $wwwStatus = ($wwwHead -split "`t")[1]
  } catch {
    $liveError = $_.Exception.Message
  }

  $summary = [ordered]@{
    generated_at = (Get-Date).ToString('s')
    project_root = $config.ProjectRoot
    production_url = $config.ProductionUrl
    git_branch = $gitBranch
    commit = $commit
    remote = $remote
    source_dirty_count_excluding_reports = $dirtySource.Count
    report_noise_count = @($gitShort | Where-Object { $_ -match 'reports[\\/]' }).Count
    launch_indexing = [bool]$config.LaunchIndexing
    indexable_questions = $indexable
    not_indexable_questions = $notIndexable
    sitemap_url_count = $sitemapCount
    www_status = $wwwStatus
    live_error = $liveError
    report_path = $reportPath
  }

  $summary | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $reportPath -Encoding UTF8

  Write-Output "STATUS_OK commit=$commit sitemap_urls=$sitemapCount indexable_questions=$($indexable.Count) source_dirty_ex_reports=$($dirtySource.Count) report=$reportPath"
  if ($dirtySource.Count -gt 0) {
    Write-Output "SOURCE_DIRTY:"
    $dirtySource | ForEach-Object { Write-Output $_ }
  }
} finally {
  Pop-Location
}

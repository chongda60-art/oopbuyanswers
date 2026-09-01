param([string]$ConfigPath = "$PSScriptRoot\config.psd1")
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$config = Get-OopbuyDeployConfig -ConfigPath $ConfigPath
$reportDir = Join-Path $config.ProjectRoot 'reports'
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$reportPath = Join-Path $reportDir "launch-verification-$stamp.json"

function Get-MetaRobots([string]$Html) {
  $match = [regex]::Match($Html, '<meta name="robots" content="([^"]+)"')
  if ($match.Success) { return $match.Groups[1].Value }
  return $null
}

function Get-Canonical([string]$Html) {
  $match = [regex]::Match($Html, '<link rel="canonical" href="([^"]+)"')
  if ($match.Success) { return $match.Groups[1].Value }
  return $null
}

function Test-CuricartLinks([string]$Html) {
  $matches = [regex]::Matches($Html, '<a[^>]+href=["''](https://www\.curicart\.com[^"'']+)["'']')
  $bad = New-Object System.Collections.Generic.List[string]
  foreach ($match in $matches) {
    $href = [System.Net.WebUtility]::HtmlDecode($match.Groups[1].Value)
    if ($href -match '\\$' -or
        $href -notmatch [regex]::Escape('utm_source=oopbuyanswers') -or
        $href -notmatch [regex]::Escape('utm_medium=referral') -or
        $href -notmatch [regex]::Escape('utm_campaign=oopbuy_questions') -or
        $href -notmatch 'utm_content=[a-z0-9_]+') {
      $bad.Add($href) | Out-Null
    }
  }
  return [ordered]@{ total = $matches.Count; bad = $bad.Count; bad_links = @($bad) }
}

$sitemapXml = Get-CurlText -Url "$($config.ProductionUrl)/sitemap.xml"
$sitemapUrls = [regex]::Matches($sitemapXml, '<loc>([^<]+)</loc>') | ForEach-Object { $_.Groups[1].Value }
$requiredUrls = @(
  "$($config.ProductionUrl)/",
  "$($config.ProductionUrl)/questions",
  "$($config.ProductionUrl)/questions/oopbuy-qc-photos",
  "$($config.ProductionUrl)/topics/qc",
  "$($config.ProductionUrl)/topics",
  "$($config.ProductionUrl)/sources",
  "$($config.ProductionUrl)/about",
  "$($config.ProductionUrl)/contact",
  "$($config.ProductionUrl)/privacy"
)
$normalizedSitemapUrls = @($sitemapUrls | ForEach-Object { $_.TrimEnd('/') })
$missingRequired = @($requiredUrls | Where-Object { $normalizedSitemapUrls -notcontains $_.TrimEnd('/') })
if ($missingRequired.Count -gt 0) { throw "Sitemap missing required URLs: $($missingRequired -join ', ')" }

$forbidden = @($config.ForbiddenPublicText)
$pageResults = New-Object System.Collections.Generic.List[object]
foreach ($url in $sitemapUrls) {
  $head = Invoke-CurlHead -Url $url -Follow
  $status = ($head -split "`t")[1]
  $html = Get-CurlText -Url $url
  $bodyHtml = $html -replace '(?is)<head.*?</head>', ''
  $forbiddenHits = @($forbidden | Where-Object { $_ -and $bodyHtml -match [regex]::Escape($_) })
  $curicart = Test-CuricartLinks -Html $html
  $pageResults.Add([ordered]@{
    url = $url
    status = $status
    robots = Get-MetaRobots -Html $html
    canonical = Get-Canonical -Html $html
    forbidden_hits = $forbiddenHits
    curicart_links = $curicart.total
    bad_utm_links = $curicart.bad
  }) | Out-Null
  if ($status -ne '200') { throw "Expected 200 for sitemap URL $url, got $status" }
  if ((Get-MetaRobots -Html $html) -ne 'index, follow') { throw "Expected index, follow for $url" }
  if ((Get-Canonical -Html $html).TrimEnd('/') -ne $url.TrimEnd('/')) { throw "Canonical mismatch for $url" }
  if ($forbiddenHits.Count -gt 0) { throw "Forbidden public text on $url`: $($forbiddenHits -join ', ')" }
  if ($curicart.bad -gt 0) { throw "Bad CuriCart UTM links on $url" }
}

$robots = Get-CurlText -Url "$($config.ProductionUrl)/robots.txt"
if ($robots -match 'Disallow:\s*/') { throw 'robots.txt blocks the site.' }
if ($robots -notmatch 'Allow:\s*/') { throw 'robots.txt does not allow crawl.' }

$wwwHead = Invoke-CurlHead -Url $config.WwwUrl
$wwwStatus = ($wwwHead -split "`t")[1]
$wwwRedirect = ($wwwHead -split "`t")[2]
if ($wwwStatus -notin @('301','308')) { throw "Expected www redirect, got $wwwHead" }
if ($wwwRedirect.TrimEnd('/') -ne $config.ProductionUrl.TrimEnd('/')) { throw "Unexpected www redirect target: $wwwHead" }

$report = [ordered]@{
  generated_at = (Get-Date).ToString('s')
  production_url = $config.ProductionUrl
  sitemap_url = "$($config.ProductionUrl)/sitemap.xml"
  sitemap_url_count = $sitemapUrls.Count
  robots_allows_crawl = $true
  www_redirect = $wwwHead
  pages = $pageResults
}
$report | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $reportPath -Encoding utf8
Write-Output "LAUNCH_VERIFY_REPORT=$reportPath"
Write-Output "SITEMAP_URLS=$($sitemapUrls.Count)"
Write-Output 'LAUNCH_VERIFY_OK'

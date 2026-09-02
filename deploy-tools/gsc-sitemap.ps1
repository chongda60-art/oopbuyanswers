param(
  [string]$ConfigPath = "$PSScriptRoot\config.psd1",
  [string]$VerificationFile = 'googledfcd3ef6e7fa1e2b.html',
  [string]$ExpectedVerificationBody = 'google-site-verification: googledfcd3ef6e7fa1e2b.html',
  [switch]$RecordSubmitted,
  [switch]$OpenConsole
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"

$config = Get-OopbuyDeployConfig -ConfigPath $ConfigPath
$reportDir = Join-Path $config.ProjectRoot 'reports'
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$reportPath = Join-Path $reportDir "gsc-sitemap-check-$stamp.json"

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

function New-AbsoluteUrl([string]$BaseUrl, [string]$Path) {
  return [Uri]::new([Uri]"$BaseUrl/", $Path.TrimStart('/')).ToString()
}

$siteUrl = $config.ProductionUrl.TrimEnd('/')
$sitemapUrl = "$siteUrl/sitemap.xml"
$robotsUrl = "$siteUrl/robots.txt"
$verificationUrl = New-AbsoluteUrl -BaseUrl $siteUrl -Path $VerificationFile

$issues = New-Object System.Collections.Generic.List[string]
$pageResults = New-Object System.Collections.Generic.List[object]

$verificationBody = Get-CurlText -Url $verificationUrl
$verificationExact = ($verificationBody.Trim() -eq $ExpectedVerificationBody)
if (-not $verificationExact) {
  $issues.Add("Google verification body mismatch at $verificationUrl") | Out-Null
}

$robotsText = Get-CurlText -Url $robotsUrl
$robotsAllows = ($robotsText -match '(?mi)^\s*Allow:\s*/\s*$') -and ($robotsText -notmatch '(?mi)^\s*Disallow:\s*/\s*$')
$robotsReferencesSitemap = $robotsText -match [regex]::Escape($sitemapUrl)
if (-not $robotsAllows) {
  $issues.Add('robots.txt does not clearly allow crawling.') | Out-Null
}
if (-not $robotsReferencesSitemap) {
  $issues.Add("robots.txt does not reference $sitemapUrl") | Out-Null
}

$sitemapXml = Get-CurlText -Url $sitemapUrl
try {
  [xml]$sitemapDoc = $sitemapXml
  $sitemapUrls = @($sitemapDoc.urlset.url | ForEach-Object { [string]$_.loc } | Where-Object { $_ })
} catch {
  $issues.Add("sitemap.xml is not valid XML: $($_.Exception.Message)") | Out-Null
  $sitemapUrls = @()
}

if ($sitemapUrls.Count -eq 0) {
  $issues.Add('sitemap.xml has no loc URLs.') | Out-Null
}

foreach ($url in $sitemapUrls) {
  $head = Invoke-CurlHead -Url $url -Follow
  $headParts = $head -split "`t"
  $status = if ($headParts.Count -ge 2) { $headParts[1] } else { '' }
  $html = if ($status -eq '200') { Get-CurlText -Url $url } else { '' }
  $robots = if ($html) { Get-MetaRobots -Html $html } else { $null }
  $canonical = if ($html) { Get-Canonical -Html $html } else { $null }
  $indexable = ($status -eq '200') -and ($robots -eq 'index, follow') -and ($canonical -and $canonical.TrimEnd('/') -eq $url.TrimEnd('/'))

  $pageResults.Add([ordered]@{
    url = $url
    status = $status
    robots = $robots
    canonical = $canonical
    indexable = $indexable
  }) | Out-Null

  if ($status -ne '200') {
    $issues.Add("Sitemap URL is not HTTP 200: $url status=$status") | Out-Null
  } elseif ($robots -ne 'index, follow') {
    $issues.Add("Sitemap URL is not index, follow: $url robots=$robots") | Out-Null
  } elseif (-not $canonical -or $canonical.TrimEnd('/') -ne $url.TrimEnd('/')) {
    $issues.Add("Sitemap URL canonical mismatch: $url canonical=$canonical") | Out-Null
  }
}

$gscSitemapsUrlPrefix = 'https://search.google.com/search-console/sitemaps?resource_id=' + [Uri]::EscapeDataString($siteUrl + '/')
$gscSitemapsDomain = 'https://search.google.com/search-console/sitemaps?resource_id=' + [Uri]::EscapeDataString('sc-domain:' + $config.ApexDomain)

if ($OpenConsole) {
  Start-Process $gscSitemapsUrlPrefix
}

$report = [ordered]@{
  generated_at = (Get-Date).ToString('s')
  production_url = $siteUrl
  verification_url = $verificationUrl
  verification_exact = $verificationExact
  robots_url = $robotsUrl
  robots_allows_crawl = $robotsAllows
  robots_references_sitemap = $robotsReferencesSitemap
  sitemap_url = $sitemapUrl
  sitemap_url_count = $sitemapUrls.Count
  sitemap_manually_submitted_in_gsc = [bool]$RecordSubmitted
  gsc_sitemaps_url_prefix = $gscSitemapsUrlPrefix
  gsc_sitemaps_domain_property = $gscSitemapsDomain
  pages = $pageResults
  issues = @($issues)
}

$report | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $reportPath -Encoding utf8
Write-Output "GSC_SITEMAP_REPORT=$reportPath"
Write-Output "VERIFICATION_URL=$verificationUrl"
Write-Output "SITEMAP_URL=$sitemapUrl"
Write-Output "SITEMAP_URLS=$($sitemapUrls.Count)"
if ($RecordSubmitted) {
  Write-Output 'GSC_MANUAL_SUBMISSION_RECORDED'
}
if ($issues.Count -gt 0) {
  Write-Output "GSC_SITEMAP_ISSUES=$($issues.Count)"
  foreach ($issue in $issues) { Write-Output "ISSUE: $issue" }
  exit 1
}
Write-Output 'GSC_SITEMAP_READY'

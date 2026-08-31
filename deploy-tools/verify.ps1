param([string]$ConfigPath = "$PSScriptRoot\config.psd1")
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$config = Get-OopbuyDeployConfig -ConfigPath $ConfigPath

function Test-AllCuricartUrls([string]$Html, [string]$Path) {
  $matches = [regex]::Matches($Html, 'https://www\.curicart\.com[^"''<>\s]+')
  $bad = New-Object System.Collections.Generic.List[string]
  foreach ($match in $matches) {
    $href = [System.Net.WebUtility]::HtmlDecode($match.Value)
    $href = $href -replace '\\+$', ''
    if ($href -notmatch [regex]::Escape('utm_source=oopbuyanswers') -or
        $href -notmatch [regex]::Escape('utm_medium=referral') -or
        $href -notmatch [regex]::Escape('utm_campaign=oopbuy_questions') -or
        $href -notmatch 'utm_content=[a-z0-9_]+') {
      $bad.Add($match.Value) | Out-Null
    }
  }
  if ($bad.Count -gt 0) {
    throw "Bad CuriCart UTM links on $Path`n$($bad -join "`n")"
  }
  return $matches.Count
}

foreach ($url in @($config.ProductionUrl,$config.WwwUrl)) {
  Write-Output (Invoke-CurlHead -Url $url)
}
$html = Get-CurlText -Url $config.ProductionUrl
if ($html -notmatch '<meta name="robots" content="noindex, nofollow"') { throw 'Production robots meta is not noindex,nofollow.' }
$bodyHtml = $html -replace '(?is)<head.*?</head>', ''
foreach ($needle in @($config.ForbiddenPublicText)) {
  if ($needle -and $bodyHtml -match [regex]::Escape($needle)) { throw "Forbidden public body text detected: $needle" }
}
$robots = Get-CurlText -Url "$($config.ProductionUrl)/robots.txt"
if ($robots -notmatch 'Disallow:\s*/') { throw 'robots.txt is not blocking crawl.' }
$sitemap = Get-CurlText -Url "$($config.ProductionUrl)/sitemap.xml"
if ($sitemap -match '<url>') { throw 'sitemap.xml contains URLs while launch indexing is disabled.' }
foreach ($path in @($config.Required200Paths)) {
  $line = Invoke-CurlHead -Url "$($config.ProductionUrl)$path" -Follow
  $status = ($line -split "`t")[1]
  if ($status -ne '200') { throw "Expected 200 for $path, got $status ($line)" }
}
foreach ($path in @($config.Required404Paths)) {
  $line = Invoke-CurlHead -Url "$($config.ProductionUrl)$path" -Follow
  $status = ($line -split "`t")[1]
  if ($status -ne '404') { throw "Expected 404 for $path, got $status ($line)" }
}

$bridgePages = @('/questions/oopbuy-qc-photos','/topics/qc')
foreach ($path in $bridgePages) {
  $pageHtml = Get-CurlText -Url "$($config.ProductionUrl)$path"
  $pageBody = $pageHtml -replace '(?is)<head.*?</head>', ''
  if ($pageHtml -notmatch 'Related product research') { throw "Related product research block missing on $path" }
  if ($pageHtml -match 'href="/product/' -or $pageHtml -match "href='/product/") { throw "Local product link detected on $path" }
  Test-AllCuricartUrls -Html $pageHtml -Path $path | Out-Null
  foreach ($needle in @($config.ForbiddenPublicText)) {
    if ($needle -and $pageBody -match [regex]::Escape($needle)) { throw "Forbidden public body text detected on $path`: $needle" }
  }
  if ($pageHtml -match 'research-card-image' -and $pageHtml -match '<img[^>]+src=""') { throw "Empty product image detected on $path" }
  if ($pageHtml -match 'research-card-meta">\s*</span>') { throw "Empty category label detected on $path" }
  if ($pageHtml -match 'research-card-title">\s*</span>') { throw "Empty card title detected on $path" }
}

$homeHtml = Get-CurlText -Url "$($config.ProductionUrl)/"
if ($homeHtml -notmatch 'Explore product categories') { throw 'Homepage product category navigation missing.' }
$curicartLinkCount = Test-AllCuricartUrls -Html $homeHtml -Path '/'
if ($curicartLinkCount -lt 1) { throw 'No CuriCart links found on homepage.' }
Write-Output 'VERIFY_OK'

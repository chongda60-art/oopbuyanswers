param(
  [string]$ConfigPath = "$PSScriptRoot\config.psd1",
  [switch]$Execute
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$config = Get-OopbuyDeployConfig -ConfigPath $ConfigPath
$reportDir = Join-Path $config.ProjectRoot 'reports'
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$reportPath = Join-Path $reportDir "search-discovery-submissions-$stamp.json"

$hostName = ([Uri]$config.ProductionUrl).Host
$key = '5fe764c20de640c08126a04385fa4761'
$keyLocation = "$($config.ProductionUrl)/$key.txt"
$urls = @(
  "$($config.ProductionUrl)/",
  "$($config.ProductionUrl)/questions/oopbuy-qc-photos"
)

$endpoints = @(
  @{ name = 'Generic IndexNow'; api = 'https://api.indexnow.org/indexnow'; source = 'https://www.indexnow.org/documentation' },
  @{ name = 'Bing'; api = 'https://www.bing.com/indexnow'; source = 'https://www.bing.com/indexnow/meta.json' },
  @{ name = 'Yandex'; api = 'https://yandex.com/indexnow'; source = 'https://www.yandex.com/indexnow/meta.json' },
  @{ name = 'Seznam'; api = 'https://search.seznam.cz/indexnow'; source = 'https://search.seznam.cz/indexnow/meta.json' },
  @{ name = 'Yep'; api = 'https://indexnow.yep.com/indexnow'; source = 'https://indexnow.yep.com/indexnow/meta.json' }
)

$results = New-Object System.Collections.Generic.List[object]

foreach ($endpoint in $endpoints) {
  foreach ($url in $urls) {
    $urlSlug = ([Uri]$url).AbsolutePath.Trim('/')
    if (-not $urlSlug) { $urlSlug = 'home' }
    $urlSlug = $urlSlug -replace '[^A-Za-z0-9]+','-'
    $target = "$($endpoint.api)?url=$([Uri]::EscapeDataString($url))&key=$key&keyLocation=$([Uri]::EscapeDataString($keyLocation))"
    if (-not $Execute) {
      $results.Add([ordered]@{
        endpoint = $endpoint.name
        api = $endpoint.api
        url = $url
        status = 'dry-run'
        source = $endpoint.source
      }) | Out-Null
      continue
    }
    $responseFile = Join-Path $reportDir "indexnow-response-$($endpoint.name -replace '[^A-Za-z0-9]+','-')-$urlSlug-$stamp.txt"
    $statusCode = & curl.exe -L --connect-timeout 20 --max-time 30 -s -o $responseFile -w "%{http_code}" $target
    $results.Add([ordered]@{
      endpoint = $endpoint.name
      api = $endpoint.api
      url = $url
      http_status = $statusCode
      response_file = $responseFile
      source = $endpoint.source
    }) | Out-Null
  }
}

$results.Add([ordered]@{
  endpoint = 'Brave'
  api = $null
  url = $urls -join ', '
  status = 'not_submitted'
  reason = 'No official IndexNow endpoint was found in the current IndexNow search engine list.'
  source = 'https://www.indexnow.org/searchengines.json'
}) | Out-Null

$payload = [ordered]@{
  generated_at = (Get-Date).ToString('s')
  executed = [bool]$Execute
  host = $hostName
  key_location = $keyLocation
  submitted_urls = $urls
  results = $results
}

$payload | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $reportPath -Encoding utf8
Write-Output "SEARCH_DISCOVERY_REPORT=$reportPath"
if (-not $Execute) {
  Write-Output 'DRY_RUN: re-run with -Execute after production verifies indexable pages.'
} else {
  Write-Output 'SEARCH_DISCOVERY_SUBMIT_DONE'
}

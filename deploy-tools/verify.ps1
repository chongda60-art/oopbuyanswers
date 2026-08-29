param([string]$ConfigPath = "$PSScriptRoot\config.psd1")
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$config = Get-OopbuyDeployConfig -ConfigPath $ConfigPath

foreach ($url in @($config.ProductionUrl,$config.WwwUrl)) {
  Write-Output (Invoke-CurlHead -Url $url)
}
$html = Get-CurlText -Url $config.ProductionUrl
if ($html -notmatch '<meta name="robots" content="noindex, nofollow"') { throw 'Production robots meta is not noindex,nofollow.' }
foreach ($needle in @($config.ForbiddenPublicText)) {
  if ($needle -and $html.Contains($needle)) { throw "Forbidden public text detected: $needle" }
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
Write-Output 'VERIFY_OK'

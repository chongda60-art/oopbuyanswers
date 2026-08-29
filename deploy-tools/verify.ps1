param([string]$ConfigPath = "$PSScriptRoot\config.psd1")
$ErrorActionPreference = 'Stop'
$config = if (Test-Path -LiteralPath $ConfigPath) { Import-PowerShellDataFile -LiteralPath $ConfigPath } else { Import-PowerShellDataFile -LiteralPath "$PSScriptRoot\config.example.psd1" }
function Invoke-CurlHead {
  param([Parameter(Mandatory=$true)][string]$Url, [switch]$Follow)
  $format = "%{url_effective}`t%{http_code}`t%{redirect_url}"
  $args = @('-I','--connect-timeout','20','--max-time','30','-s','-o','NUL','-w',$format)
  if ($Follow) { $args = @('-I','-L','--connect-timeout','20','--max-time','30','-s','-o','NUL','-w',$format) }
  $result = & curl.exe @args $Url
  if ($LASTEXITCODE -ne 0) { throw "curl failed for $Url" }
  return $result
}

foreach ($url in @($config.ProductionUrl,$config.WwwUrl)) {
  Write-Output (Invoke-CurlHead -Url $url)
}
$html = (& curl.exe -L --connect-timeout 20 --max-time 30 -s $config.ProductionUrl) -join "`n"
if ($LASTEXITCODE -ne 0) { throw "Failed to fetch $($config.ProductionUrl)" }
if ($html -notmatch '<meta name="robots" content="noindex, nofollow"') { throw 'Production robots meta is not noindex,nofollow.' }
if ($html -match 'Where can I see Oopbuy QC photos|Demo black socks|Demo fragrance') { throw 'Hold or fixture content is publicly visible.' }
$robots = (& curl.exe -L --connect-timeout 20 --max-time 30 -s "$($config.ProductionUrl)/robots.txt") -join "`n"
if ($LASTEXITCODE -ne 0) { throw "Failed to fetch $($config.ProductionUrl)/robots.txt" }
if ($robots -notmatch 'Disallow:\s*/') { throw 'robots.txt is not blocking crawl.' }
Write-Output 'VERIFY_OK'

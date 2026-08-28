param([string]$ConfigPath = "$PSScriptRoot\config.psd1")
$ErrorActionPreference = 'Stop'
$config = if (Test-Path -LiteralPath $ConfigPath) { Import-PowerShellDataFile -LiteralPath $ConfigPath } else { Import-PowerShellDataFile -LiteralPath "$PSScriptRoot\config.example.psd1" }
$targets = @($config.ProductionUrl,$config.WwwUrl)
foreach ($url in $targets) {
  try {
    $response = Invoke-WebRequest -Uri $url -MaximumRedirection 0 -ErrorAction Stop
    Write-Output "$url`t$($response.StatusCode)`t$($response.Headers.Location)"
  } catch {
    if ($_.Exception.Response) { Write-Output "$url`t$([int]$_.Exception.Response.StatusCode)`t$($_.Exception.Response.Headers.Location)" } else { throw }
  }
}
$html = (Invoke-WebRequest -Uri $config.ProductionUrl).Content
if ($html -notmatch '<meta name="robots" content="noindex, nofollow"') { throw 'Production robots meta is not noindex,nofollow.' }
if ($html -match 'Where can I see Oopbuy QC photos|Demo black socks|Demo fragrance') { throw 'Hold or fixture content is publicly visible.' }
$robots = (Invoke-WebRequest -Uri "$($config.ProductionUrl)/robots.txt").Content
if ($robots -notmatch 'Disallow:\s*/') { throw 'robots.txt is not blocking crawl.' }
Write-Output 'VERIFY_OK'

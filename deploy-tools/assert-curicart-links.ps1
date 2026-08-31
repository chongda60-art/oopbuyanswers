param(
  [string]$ConfigPath = "$PSScriptRoot\config.psd1",
  [string[]]$Paths = @('/','/questions','/questions/oopbuy-qc-photos','/topics/qc','/sources')
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$config = Get-OopbuyDeployConfig -ConfigPath $ConfigPath

$totalLinks = 0
$badLinks = New-Object System.Collections.Generic.List[string]

foreach ($path in $Paths) {
  $html = Get-CurlText -Url "$($config.ProductionUrl)$path"
  $matches = [regex]::Matches($html, 'https://www\.curicart\.com[^"''<>\s]+')
  $pageBad = 0
  foreach ($match in $matches) {
    $raw = $match.Value
    $href = [System.Net.WebUtility]::HtmlDecode($raw)
    $href = $href -replace '\\$', ''
    $hasRequiredUtm =
      $href -match [regex]::Escape('utm_source=oopbuyanswers') -and
      $href -match [regex]::Escape('utm_medium=referral') -and
      $href -match [regex]::Escape('utm_campaign=oopbuy_questions') -and
      $href -match 'utm_content=[a-z0-9_]+'
    if (-not $hasRequiredUtm) {
      $pageBad += 1
      $badLinks.Add("$path`t$raw") | Out-Null
    }
  }
  $totalLinks += $matches.Count
  Write-Output "$path curicart_links=$($matches.Count) bad_utm_links=$pageBad"
}

if ($badLinks.Count -gt 0) {
  throw "BAD_CURICART_UTM_LINKS`n$($badLinks -join "`n")"
}

Write-Output "CURICART_LINK_ASSERT_OK total_links=$totalLinks bad_utm_links=0"

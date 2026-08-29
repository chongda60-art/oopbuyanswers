$ErrorActionPreference = 'Stop'

function Get-OopbuyDeployConfig {
  param([string]$ConfigPath = "$PSScriptRoot\config.psd1")

  $fallback = Join-Path $PSScriptRoot 'config.example.psd1'
  $path = if (Test-Path -LiteralPath $ConfigPath) { $ConfigPath } else { $fallback }
  return Import-PowerShellDataFile -LiteralPath $path
}

function Use-OopbuyNodeRuntime {
  $nodeBin = 'C:\Users\92822\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
  $pnpmBin = 'C:\Users\92822\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback'
  $parts = @()
  if (Test-Path -LiteralPath $nodeBin) { $parts += $nodeBin }
  if (Test-Path -LiteralPath $pnpmBin) { $parts += $pnpmBin }
  if ($parts.Count -gt 0) { $env:PATH = (($parts + $env:PATH) -join ';') }
}

function New-OopbuyLogPath {
  param(
    [Parameter(Mandatory=$true)][string]$ProjectRoot,
    [Parameter(Mandatory=$true)][string]$Name
  )

  $reportDir = Join-Path $ProjectRoot 'reports'
  New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
  $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  return Join-Path $reportDir "$Name-$stamp.log"
}

function Invoke-CurlHead {
  param(
    [Parameter(Mandatory=$true)][string]$Url,
    [switch]$Follow
  )

  $format = "%{url_effective}`t%{http_code}`t%{redirect_url}"
  $args = @('-I','--connect-timeout','20','--max-time','30','-s','-o','NUL','-w',$format)
  if ($Follow) {
    $args = @('-I','-L','--connect-timeout','20','--max-time','30','-s','-o','NUL','-w',$format)
  }
  for ($attempt = 1; $attempt -le 3; $attempt++) {
    $result = & curl.exe @args $Url
    if ($LASTEXITCODE -eq 0) { return $result }
    if ($attempt -lt 3) { Start-Sleep -Seconds 2 }
  }
  throw "curl failed for $Url"
}

function Get-CurlText {
  param([Parameter(Mandatory=$true)][string]$Url)

  for ($attempt = 1; $attempt -le 3; $attempt++) {
    $text = (& curl.exe -L --connect-timeout 20 --max-time 30 -s $Url) -join "`n"
    if ($LASTEXITCODE -eq 0) { return $text }
    if ($attempt -lt 3) { Start-Sleep -Seconds 2 }
  }
  throw "Failed to fetch $Url"
}

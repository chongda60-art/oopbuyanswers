param(
  [string]$ConfigPath = "$PSScriptRoot\config.psd1"
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$config = Get-OopbuyDeployConfig -ConfigPath $ConfigPath
Use-OopbuyNodeRuntime

$shotDir = Join-Path $config.ProjectRoot 'reports\screenshots'
New-Item -ItemType Directory -Force -Path $shotDir | Out-Null

Push-Location -LiteralPath $config.ProjectRoot
try {
  pnpm dlx playwright screenshot --channel chrome --viewport-size 1440,1100 --full-page --timeout 60000 "$($config.ProductionUrl)/" "reports/screenshots/oopbuyanswers-production-desktop.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 390,844 --full-page --timeout 60000 "$($config.ProductionUrl)/" "reports/screenshots/oopbuyanswers-production-mobile.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 1440,1100 --full-page --timeout 60000 "$($config.ProductionUrl)/questions/" "reports/screenshots/oopbuyanswers-questions-desktop.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 390,844 --full-page --timeout 60000 "$($config.ProductionUrl)/questions/" "reports/screenshots/oopbuyanswers-questions-mobile.png"
  Write-Output 'SCREENSHOTS_OK'
} finally {
  Pop-Location
}


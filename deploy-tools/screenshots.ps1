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
  pnpm dlx playwright screenshot --channel chrome --viewport-size 1440,1400 --full-page --timeout 60000 "$($config.ProductionUrl)/questions/oopbuy-qc-photos" "reports/screenshots/oopbuyanswers-question-bridge-desktop.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 390,1200 --full-page --timeout 60000 "$($config.ProductionUrl)/questions/oopbuy-qc-photos" "reports/screenshots/oopbuyanswers-question-bridge-mobile.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 1440,1400 --full-page --timeout 60000 "$($config.ProductionUrl)/questions/oopbuy-qc-finder" "reports/screenshots/oopbuyanswers-qc-finder-desktop.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 390,1200 --full-page --timeout 60000 "$($config.ProductionUrl)/questions/oopbuy-qc-finder" "reports/screenshots/oopbuyanswers-qc-finder-mobile.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 1440,1400 --full-page --timeout 60000 "$($config.ProductionUrl)/questions/oopbuy-spreadsheet-with-qc" "reports/screenshots/oopbuyanswers-spreadsheet-with-qc-desktop.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 390,1200 --full-page --timeout 60000 "$($config.ProductionUrl)/questions/oopbuy-spreadsheet-with-qc" "reports/screenshots/oopbuyanswers-spreadsheet-with-qc-mobile.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 1440,1400 --full-page --timeout 60000 "$($config.ProductionUrl)/questions/oopbuy-shoe-size-chart" "reports/screenshots/oopbuyanswers-shoe-size-chart-desktop.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 390,1200 --full-page --timeout 60000 "$($config.ProductionUrl)/questions/oopbuy-shoe-size-chart" "reports/screenshots/oopbuyanswers-shoe-size-chart-mobile.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 1440,1400 --full-page --timeout 60000 "$($config.ProductionUrl)/questions/oopbuy-weidian-link" "reports/screenshots/oopbuyanswers-weidian-link-desktop.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 390,1200 --full-page --timeout 60000 "$($config.ProductionUrl)/questions/oopbuy-weidian-link" "reports/screenshots/oopbuyanswers-weidian-link-mobile.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 1440,1400 --full-page --timeout 60000 "$($config.ProductionUrl)/questions/oopbuy-qc-photos-not-showing" "reports/screenshots/oopbuyanswers-qc-photos-not-showing-desktop.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 390,1200 --full-page --timeout 60000 "$($config.ProductionUrl)/questions/oopbuy-qc-photos-not-showing" "reports/screenshots/oopbuyanswers-qc-photos-not-showing-mobile.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 1440,1400 --full-page --timeout 60000 "$($config.ProductionUrl)/questions/oopbuy-spreadsheet-shoes" "reports/screenshots/oopbuyanswers-spreadsheet-shoes-desktop.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 390,1200 --full-page --timeout 60000 "$($config.ProductionUrl)/questions/oopbuy-spreadsheet-shoes" "reports/screenshots/oopbuyanswers-spreadsheet-shoes-mobile.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 1440,1100 --full-page --timeout 60000 "$($config.ProductionUrl)/topics/qc" "reports/screenshots/oopbuyanswers-topic-qc-desktop.png"
  pnpm dlx playwright screenshot --channel chrome --viewport-size 390,844 --full-page --timeout 60000 "$($config.ProductionUrl)/topics/qc" "reports/screenshots/oopbuyanswers-topic-qc-mobile.png"
  Write-Output 'SCREENSHOTS_OK'
} finally {
  Pop-Location
}

param(
  [string]$ConfigPath = "$PSScriptRoot\config.psd1",
  [string[]]$Paths = @('/','/questions','/questions/oopbuy-qc-photos','/topics/qc','/sources')
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$config = Get-OopbuyDeployConfig -ConfigPath $ConfigPath
Use-OopbuyNodeRuntime

$env:OOPBUY_PRODUCTION_URL = $config.ProductionUrl
$env:OOPBUY_ASSERT_PATHS = ($Paths -join ',')
Push-Location -LiteralPath $config.ProjectRoot
try {
  pnpm dlx @playwright/test test "deploy-tools/assert-curicart-links.spec.js" --reporter=line
} finally {
  Pop-Location
  Remove-Item Env:\OOPBUY_PRODUCTION_URL -ErrorAction SilentlyContinue
  Remove-Item Env:\OOPBUY_ASSERT_PATHS -ErrorAction SilentlyContinue
}

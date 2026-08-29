param(
  [switch]$Execute,
  [switch]$Vercel,
  [switch]$SkipBuild,
  [string]$ConfigPath = "$PSScriptRoot\config.psd1"
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
if (-not $SkipBuild) { & "$PSScriptRoot\build.ps1" -ConfigPath $ConfigPath }
$config = Get-OopbuyDeployConfig -ConfigPath $ConfigPath
Use-OopbuyNodeRuntime
Push-Location -LiteralPath $config.ProjectRoot
try {
  git status --short --branch
  git remote -v
  if (-not $Execute) { Write-Output 'DRY_RUN: build passed; no push or Vercel deployment performed. Re-run with -Execute and optionally -Vercel.'; exit 0 }
  git push origin HEAD
  if ($LASTEXITCODE -ne 0) { throw 'git push failed' }
  Write-Output 'PUSH_OK'
  if ($Vercel) {
    pnpm dlx vercel --prod --yes --scope $config.VercelScope
    if ($LASTEXITCODE -ne 0) { throw 'Vercel production deployment failed' }
    Write-Output 'VERCEL_DEPLOY_OK'
  }
} finally { Pop-Location }

param(
  [switch]$Execute,
  [switch]$Vercel,
  [string]$ConfigPath = "$PSScriptRoot\config.psd1"
)
$ErrorActionPreference = 'Stop'
& "$PSScriptRoot\build.ps1" -ConfigPath $ConfigPath
$config = if (Test-Path -LiteralPath $ConfigPath) { Import-PowerShellDataFile -LiteralPath $ConfigPath } else { Import-PowerShellDataFile -LiteralPath "$PSScriptRoot\config.example.psd1" }
$nodeBin = 'C:\Users\92822\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
$pnpmBin = 'C:\Users\92822\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback'
$env:PATH = "$nodeBin;$pnpmBin;$env:PATH"
Push-Location -LiteralPath $config.ProjectRoot
try {
  git status --short --branch
  git remote -v
  if (-not $Execute) { Write-Output 'DRY_RUN: build passed; no push or Vercel deployment performed. Re-run with -Execute and optionally -Vercel.'; exit 0 }
  git push origin HEAD
  if ($LASTEXITCODE -ne 0) { throw 'git push failed' }
  Write-Output 'PUSH_OK'
  if ($Vercel) {
    pnpm dlx vercel --prod --yes --scope chen-d2eb
    if ($LASTEXITCODE -ne 0) { throw 'Vercel production deployment failed' }
    Write-Output 'VERCEL_DEPLOY_OK'
  }
} finally { Pop-Location }

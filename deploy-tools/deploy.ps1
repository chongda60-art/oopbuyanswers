param([switch]$Execute,[string]$ConfigPath = "$PSScriptRoot\config.psd1")
$ErrorActionPreference = 'Stop'
& "$PSScriptRoot\build.ps1" -ConfigPath $ConfigPath
$config = if (Test-Path -LiteralPath $ConfigPath) { Import-PowerShellDataFile -LiteralPath $ConfigPath } else { Import-PowerShellDataFile -LiteralPath "$PSScriptRoot\config.example.psd1" }
Push-Location -LiteralPath $config.ProjectRoot
try {
  git status --short --branch
  git remote -v
  if (-not $Execute) { Write-Output 'DRY_RUN: build passed; no push performed. Re-run with -Execute to push the current branch.'; exit 0 }
  git push origin HEAD
  if ($LASTEXITCODE -ne 0) { throw 'git push failed' }
  Write-Output 'PUSH_OK: Vercel Git integration should create the production deployment.'
} finally { Pop-Location }

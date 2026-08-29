param([string]$ConfigPath = "$PSScriptRoot\config.psd1")
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$config = Get-OopbuyDeployConfig -ConfigPath $ConfigPath
$root = [string]$config.ProjectRoot
if (-not (Test-Path -LiteralPath $root)) { throw "Project root not found: $root" }
$required = @('package.json','pnpm-lock.yaml','app\layout.tsx','app\robots.ts','app\sitemap.ts')
$missing = $required | Where-Object { -not (Test-Path -LiteralPath (Join-Path $root $_)) }
if ($missing) { throw "Missing required files: $($missing -join ', ')" }
Push-Location -LiteralPath $root
try {
  $remote = (git remote get-url origin) 2>$null
  if ($config.ExpectedGitRemote -and $remote -ne $config.ExpectedGitRemote) {
    throw "Unexpected git remote. Expected $($config.ExpectedGitRemote), got $remote"
  }
} finally {
  Pop-Location
}
$secretHits = rg -n --hidden -g '!node_modules/**' -g '!.next/**' -g '!.git/**' '(ghp_[A-Za-z0-9]{20,}|vercel_[A-Za-z0-9_-]{20,}|BEGIN (RSA|OPENSSH|EC) PRIVATE KEY|password\s*=)' $root
if ($LASTEXITCODE -eq 0) { throw "Potential secret detected. Inspect before deploy.`n$secretHits" }
if ([bool]$config.LaunchIndexing) { throw 'LaunchIndexing must remain false until content and indexing approval.' }
& "$PSScriptRoot\validate-content.ps1" -ProjectRoot $root
Write-Output 'PREFLIGHT_OK'
Write-Output "ProjectRoot=$root"
Write-Output "LaunchIndexing=$($config.LaunchIndexing)"

param([string]$ConfigPath = "$PSScriptRoot\config.psd1")
$ErrorActionPreference = 'Stop'
$config = if (Test-Path -LiteralPath $ConfigPath) { Import-PowerShellDataFile -LiteralPath $ConfigPath } else { Import-PowerShellDataFile -LiteralPath "$PSScriptRoot\config.example.psd1" }
$root = [string]$config.ProjectRoot
if (-not (Test-Path -LiteralPath $root)) { throw "Project root not found: $root" }
$required = @('package.json','pnpm-lock.yaml','app\layout.tsx','app\robots.ts','app\sitemap.ts')
$missing = $required | Where-Object { -not (Test-Path -LiteralPath (Join-Path $root $_)) }
if ($missing) { throw "Missing required files: $($missing -join ', ')" }
$secretHits = rg -n --hidden -g '!node_modules/**' -g '!.next/**' -g '!.git/**' '(ghp_[A-Za-z0-9]{20,}|vercel_[A-Za-z0-9_-]{20,}|BEGIN (RSA|OPENSSH|EC) PRIVATE KEY|password\s*=)' $root
if ($LASTEXITCODE -eq 0) { throw "Potential secret detected. Inspect before deploy.`n$secretHits" }
if ([bool]$config.LaunchIndexing) { throw 'LaunchIndexing must remain false until content and indexing approval.' }
Write-Output 'PREFLIGHT_OK'
Write-Output "ProjectRoot=$root"
Write-Output "LaunchIndexing=$($config.LaunchIndexing)"

param([string]$ConfigPath = "$PSScriptRoot\config.psd1")
$ErrorActionPreference = 'Stop'
& "$PSScriptRoot\preflight.ps1" -ConfigPath $ConfigPath
$config = if (Test-Path -LiteralPath $ConfigPath) { Import-PowerShellDataFile -LiteralPath $ConfigPath } else { Import-PowerShellDataFile -LiteralPath "$PSScriptRoot\config.example.psd1" }
$nodeBin = 'C:\Users\92822\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
$pnpmBin = 'C:\Users\92822\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback'
$env:PATH = "$nodeBin;$pnpmBin;$env:PATH"
Push-Location -LiteralPath $config.ProjectRoot
try { pnpm install --frozen-lockfile; pnpm check; pnpm lint; pnpm build } finally { Pop-Location }

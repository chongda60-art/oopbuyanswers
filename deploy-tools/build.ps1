param([string]$ConfigPath = "$PSScriptRoot\config.psd1")
$ErrorActionPreference = 'Stop'
& "$PSScriptRoot\preflight.ps1" -ConfigPath $ConfigPath
. "$PSScriptRoot\common.ps1"
$config = Get-OopbuyDeployConfig -ConfigPath $ConfigPath
Use-OopbuyNodeRuntime
Push-Location -LiteralPath $config.ProjectRoot
try { pnpm install --frozen-lockfile; pnpm check; pnpm lint; pnpm build } finally { Pop-Location }

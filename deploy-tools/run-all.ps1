param(
  [switch]$ExecutePush,
  [switch]$DeployVercel,
  [switch]$VerifyVercelDomains,
  [switch]$CaptureScreenshots,
  [string]$ConfigPath = "$PSScriptRoot\config.psd1"
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$config = Get-OopbuyDeployConfig -ConfigPath $ConfigPath
$log = New-OopbuyLogPath -ProjectRoot $config.ProjectRoot -Name 'deploy-run'

Write-Output "LOG=$log"
Start-Transcript -LiteralPath $log -Append | Out-Null
try {
  Write-Output 'STEP preflight'
  & "$PSScriptRoot\preflight.ps1" -ConfigPath $ConfigPath

  Write-Output 'STEP build'
  & "$PSScriptRoot\build.ps1" -ConfigPath $ConfigPath

  Write-Output 'STEP git/vercel deploy'
  if ($ExecutePush -and $DeployVercel) {
    & "$PSScriptRoot\deploy.ps1" -ConfigPath $ConfigPath -SkipBuild -Execute -Vercel
  } elseif ($ExecutePush) {
    & "$PSScriptRoot\deploy.ps1" -ConfigPath $ConfigPath -SkipBuild -Execute
  } else {
    & "$PSScriptRoot\deploy.ps1" -ConfigPath $ConfigPath -SkipBuild
  }

  Write-Output 'STEP dns plan'
  $dnsArgs = @('-ConfigPath', $ConfigPath)
  if ($VerifyVercelDomains) { $dnsArgs += '-VerifyWithVercel' }
  & "$PSScriptRoot\dns-plan.ps1" @dnsArgs

  Write-Output 'STEP production verify'
  & "$PSScriptRoot\verify.ps1" -ConfigPath $ConfigPath

  if ($CaptureScreenshots) {
    Write-Output 'STEP screenshots'
    & "$PSScriptRoot\screenshots.ps1" -ConfigPath $ConfigPath
  }

  Write-Output 'RUN_ALL_OK'
} finally {
  Stop-Transcript | Out-Null
}

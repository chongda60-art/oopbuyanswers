param(
  [string]$ConfigPath = "$PSScriptRoot\config.psd1",
  [switch]$SkipBuild,
  [switch]$SkipLint
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$config = Get-OopbuyDeployConfig -ConfigPath $ConfigPath
Use-OopbuyNodeRuntime
Remove-Item Env:\NO_COLOR -ErrorAction SilentlyContinue

$reportDir = Join-Path $config.ProjectRoot 'reports'
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$reportPath = Join-Path $reportDir "lowtoken-verify-$stamp.json"
$logPath = Join-Path $reportDir "lowtoken-verify-$stamp.log"

function Invoke-Step {
  param(
    [Parameter(Mandatory=$true)][string]$Name,
    [Parameter(Mandatory=$true)][scriptblock]$Command
  )
  $started = Get-Date
  try {
    "STEP_START $Name $(Get-Date -Format s)" | Add-Content -LiteralPath $logPath -Encoding UTF8
    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    $global:LASTEXITCODE = 0
    & $Command *>> $logPath
    $exitCode = $LASTEXITCODE
    $stepSucceeded = $?
    $ErrorActionPreference = $previousErrorActionPreference
    if ((-not $stepSucceeded) -or $exitCode -ne 0) { throw "$Name exited with code $exitCode" }
    return [ordered]@{ name = $Name; status = 'ok'; seconds = [math]::Round(((Get-Date) - $started).TotalSeconds, 1) }
  } catch {
    if ($previousErrorActionPreference) {
      $ErrorActionPreference = $previousErrorActionPreference
    }
    return [ordered]@{ name = $Name; status = 'failed'; seconds = [math]::Round(((Get-Date) - $started).TotalSeconds, 1); error = $_.Exception.Message }
  }
}

Push-Location -LiteralPath $config.ProjectRoot
try {
  $steps = New-Object System.Collections.Generic.List[object]
  $steps.Add((Invoke-Step -Name 'pnpm check' -Command { pnpm check })) | Out-Null
  if (-not $SkipLint) {
    $steps.Add((Invoke-Step -Name 'pnpm lint' -Command { pnpm lint })) | Out-Null
  }
  if (-not $SkipBuild) {
    $steps.Add((Invoke-Step -Name 'pnpm build' -Command { pnpm build })) | Out-Null
  }
  $steps.Add((Invoke-Step -Name 'validate-content' -Command { & "$PSScriptRoot\validate-content.ps1" -ProjectRoot $config.ProjectRoot })) | Out-Null
  $steps.Add((Invoke-Step -Name 'launch-check' -Command { & "$PSScriptRoot\launch-check.ps1" -ConfigPath $ConfigPath })) | Out-Null

  $failed = @($steps | Where-Object { $_.status -ne 'ok' })
  $statusReport = & "$PSScriptRoot\status.ps1" -ConfigPath $ConfigPath
  $statusLine = @($statusReport | Where-Object { $_ -match '^STATUS_OK' } | Select-Object -First 1)
  $overallStatus = 'ok'
  if ($failed.Count -gt 0) {
    $overallStatus = 'failed'
  }

  $stepObjects = @(
    $steps | ForEach-Object {
      $step = [ordered]@{
        name = "$($_.name)"
        status = "$($_.status)"
        seconds = [double]$_.seconds
      }
      if ($_.Contains('error')) {
        $step.error = "$($_.error)"
      }
      $step
    }
  )
  $statusSummary = ''
  if ($statusLine) {
    $statusSummary = "$statusLine"
  }

  $report = [ordered]@{
    generated_at = (Get-Date).ToString('s')
    overall_status = $overallStatus
    steps = $stepObjects
    status_summary = $statusSummary
    log_path = $logPath
    report_path = $reportPath
  }
  $report | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $reportPath -Encoding UTF8

  if ($failed.Count -gt 0) {
    Write-Output "LOWTOKEN_VERIFY_FAILED failed=$($failed.Count) report=$reportPath log=$logPath"
    $failed | ForEach-Object { Write-Output "$($_.name): $($_.error)" }
    exit 1
  }

  Write-Output "LOWTOKEN_VERIFY_OK steps=$($steps.Count) report=$reportPath log=$logPath"
  if ($statusLine) { Write-Output $statusLine }
} finally {
  Pop-Location
}

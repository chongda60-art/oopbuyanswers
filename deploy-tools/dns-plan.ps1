param(
  [switch]$VerifyWithVercel,
  [string]$ConfigPath = "$PSScriptRoot\config.psd1"
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$config = Get-OopbuyDeployConfig -ConfigPath $ConfigPath
Use-OopbuyNodeRuntime

Write-Output 'DNS_REQUIRED_RECORDS'
foreach ($value in @($config.VercelARecords)) {
  Write-Output "$($config.ApexDomain)`t@`tA`t$value"
}
Write-Output "$($config.ApexDomain)`twww`tCNAME`t$($config.VercelWwwCname)"

Write-Output 'DNS_OBSERVED_1.1.1.1'
try {
  Resolve-DnsName $config.ApexDomain -Type A -Server 1.1.1.1 |
    Where-Object { $_.IPAddress } |
    ForEach-Object { Write-Output "$($_.Name)`tA`t$($_.IPAddress)`tTTL=$($_.TTL)" }
} catch {
  Write-Output "A_LOOKUP_FAILED`t$($_.Exception.Message)"
}
try {
  Resolve-DnsName $config.WwwDomain -Type CNAME -Server 1.1.1.1 |
    Where-Object { $_.NameHost } |
    ForEach-Object { Write-Output "$($_.Name)`tCNAME`t$($_.NameHost)`tTTL=$($_.TTL)" }
} catch {
  Write-Output "CNAME_LOOKUP_FAILED`t$($_.Exception.Message)"
}

if ($VerifyWithVercel) {
  pnpm dlx vercel domains verify $config.ApexDomain --scope $config.VercelScope
  pnpm dlx vercel domains verify $config.WwwDomain --scope $config.VercelScope
}


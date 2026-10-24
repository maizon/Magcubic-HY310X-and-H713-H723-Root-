#Requires -Version 5.1
<#
.SYNOPSIS
  Cria um DRAFT GitHub Release com apenas o pacote HY310X boot-only previamente validado.
.DESCRIPTION
  NAO publica backup completo, private, metadata, env, misc ou bootloader.
  NAO executa flash, nao interage com ADB e nao publica sem revisao manual.
  Requer GitHub CLI (gh), conta autenticada, permissão de escrita e pacote ZIP local.
.EXAMPLE
  .\tools\publish-recovery.ps1 -ZipPath "$HOME\Downloads\HY310X_H713_BOOT_Recovery_20251013.zip"
#>
param(
  [Parameter(Mandatory=$true)][string]$ZipPath
)
$ErrorActionPreference='Stop'
$tag='hy310x-h713-boot-reference-20251013'
$expected='04a7f6be27b9b80e93f572aaeca2b4ceca538cd63b893f6fd5d27271a9c60362'
$allowed=@('boot_a.img','boot_b.img','vendor_boot_a.img','vendor_boot_b.img','dtbo_a.img','dtbo_b.img','vbmeta_a.img','vbmeta_b.img','vbmeta_system_a.img','vbmeta_system_b.img','vbmeta_vendor_a.img','vbmeta_vendor_b.img')
$path=(Resolve-Path -LiteralPath $ZipPath).Path
if ([IO.Path]::GetFileName($path) -ne 'HY310X_H713_BOOT_Recovery_20251013.zip') { throw 'Nome do ZIP inesperado.' }
if ((Get-Item -LiteralPath $path).Length -ne 47074287) { throw 'Tamanho do ZIP inesperado.' }
$hash=(Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant()
if($hash -ne $expected){throw "SHA256 incorreto: $hash"}
Add-Type -AssemblyName System.IO.Compression
$zip=[System.IO.Compression.ZipFile]::OpenRead($path)
try {
  $images=@($zip.Entries | Where-Object { $_.FullName -like '*.img' })
  if($images.Count -ne 12){throw "Esperadas 12 imagens; obtidas $($images.Count)"}
  foreach($entry in $images) {
    if(-not ($entry.FullName -match '^images/[a-z0-9_]+[.]img$')){throw "Entrada suspeita: $($entry.FullName)"}
    if(($entry.Name -notin $allowed)){throw "Imagem não autorizada no pacote: $($entry.Name)"}
  }
} finally {$zip.Dispose()}
if(-not (Get-Command gh -ErrorAction SilentlyContinue)){throw 'Instale GitHub CLI (gh) e execute gh auth login.'}
Write-Host 'ZIP SHA-256 conferido e nomes auditados.' -ForegroundColor Green
Write-Host 'ATENÇÃO: firmwares OEM podem ter restrições de redistribuição.' -ForegroundColor Yellow
Write-Host 'Este comando cria apenas um RELEASE RASCUNHO; nenhum arquivo fica disponível ao público até que o usuário publique a Release.' -ForegroundColor Yellow
$notes=@'
Pacote de referência com 12 imagens originais extraídas de uma única unidade HY310X identificada como H713 / sun50iw12p1 / tv303, Android 11, firmware Projector.20251013.1058. Não é firmware universal; não é update.img IMAGEWTY. Não inclui partições privadas. Não garante recuperação de bootloop. Verifique SHA-256 antes de utilizar e confirme seus direitos de redistribuição.
'@
gh release create $tag $path --repo maizon/Magcubic-HY310X-and-H713-H723-Root- --title 'HY310X H713 — backup de boot original (referência específica)' --notes $notes --draft
if($LASTEXITCODE -ne 0){throw 'Falha ao criar Release rascunho.'}
Write-Host 'Release rascunho criada. Revise a licença e clique Publish release no GitHub para disponibilizar publicamente.' -ForegroundColor Green

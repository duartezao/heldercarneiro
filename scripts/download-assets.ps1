# Descarrega imagens e video TM Leader Contract para assets/tm/
# Executar na raiz do projeto: powershell -File scripts/download-assets.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
if (Test-Path (Join-Path $PSScriptRoot "..\assets\tm")) {
  $base = (Resolve-Path (Join-Path $PSScriptRoot "..\assets\tm")).Path
} else {
  $base = Join-Path (Get-Location) "assets\tm"
}
New-Item -ItemType Directory -Force -Path $base | Out-Null

$home = Invoke-WebRequest -Uri "https://tmleadercontract.com/en/" -UserAgent "Mozilla/5.0" -UseBasicParsing

function Get-SrcUrl($needle) {
  $m = [regex]::Match($home.Content, "src=`"([^`"]*$([regex]::Escape($needle))[^`"]*)`"")
  if ($m.Success) { return ($m.Groups[1].Value -replace '&amp;', '&') }
  return $null
}

$assets = [ordered]@{
  "banner-outdoor-1.webp"       = { Get-SrcUrl "Web-BANNER_OUTDOOR" }
  "banner-pure-identity.webp"   = { Get-SrcUrl "PURE-IDENTITY" }
  "banner-new-icons.webp"       = { Get-SrcUrl "Web-BANNER_NEW-ICONS" }
  "banner-milano.webp"          = { Get-SrcUrl "campana-1" }
  "banner-outdoor-alt.webp"     = { "https://tmleadercontract.com/wp-content/uploads/Web-BANNER---Outdoor.png.webp" }
  "outdoor-capa-2.webp"         = { "https://tmleadercontract.com/wp-content/uploads/outdoor_tm-leader-contract_mobiliario-hospitality.png_0005_Capa-2.png.webp" }
  "outdoor-capa-3.webp"         = { "https://tmleadercontract.com/wp-content/uploads/outdoor_tm-leader-contract_mobiliario-hospitality.png_0004_Capa-3.png.webp" }
  "outdoor-capa-3b.webp"        = { "https://tmleadercontract.com/wp-content/uploads/outdoor_tm-leader-contract_mobiliario-hospitality-1.png_0003-1.png.webp" }
  "sillon-neil.webp"            = { "https://tmleadercontract.com/wp-content/uploads/sillon-neil_tm-leader-contract_mobiliario-hospitality-1.png.webp" }
  "sillon-arco.webp"            = { "https://tmleadercontract.com/wp-content/uploads/sillon-arco_tm-leader-contract_mobiliario-hospitality.png.webp" }
  "neil-devon.webp"             = { "https://tmleadercontract.com/wp-content/uploads/NEIL-Y-DEVON-TM-LEADER-CONTRACT-MUEBLES.png.webp" }
  "product-a.webp"              = { "https://tmleadercontract.com/wp-content/uploads/a.png.webp" }
  "milano-detail.webp"          = { "https://tmleadercontract.com/wp-content/uploads/1774537764746.jpg.webp" }
  "hero-milano-2026.mov"        = { "https://tmleadercontract.com/wp-content/uploads/TM_Milan_2026_V1_Redes2-correc-color-resolucion-web.mov" }
  # Variantes mobile (biblioteca WP TM — BANNER-WEB / salone-mobile)
  "hero-milano-mobile.webp"     = { "https://tmleadercontract.com/wp-content/uploads/salone-mobile-milano-tm-leader-contract-campana-2026-hero-scaled.png" }
  "banner-milano-mobile.webp"   = { "https://tmleadercontract.com/wp-content/uploads/BANNER-WEB-TM_SALONE-DEL-MOBILE-MILAN-scaled.png" }
  "banner-outdoor-mobile.webp"  = { "https://tmleadercontract.com/wp-content/uploads/BANNER-WEB-TM_outdoor-scaled.png" }
  "milano-campana-mobile.webp"  = { "https://tmleadercontract.com/wp-content/uploads/salone-mobile-milano-tm-leader-contract-campana-2026-scaled.png" }
  # Em Destaque (homepage) — mesma imagem em desktop e mobile
  "featured-milano.webp"        = { "https://tmleadercontract.com/wp-content/uploads/5_escaparate-sala-azul-tm-contract-salone-del-mobile-milano-1.jpg" }
  "featured-outdoor.webp"       = { "https://tmleadercontract.com/wp-content/uploads/BLOQUE-OUTDOOR-Zira.jpg" }
  "featured-novedades.webp"     = { "https://tmleadercontract.com/wp-content/uploads/ejemplo-home-neil-rojo-scaled.jpg" }
  "featured-pure.webp"          = { "https://tmleadercontract.com/wp-content/uploads/TM-Leader-Contract-pure-identity-scaled.png" }
  # Páginas de exibição (galeria oficial TM)
  "exhib-outdoor-1.webp"        = { "https://tmleadercontract.com/wp-content/uploads/1-4.png.webp" }
  "exhib-outdoor-2.webp"        = { "https://tmleadercontract.com/wp-content/uploads/2-5.png.webp" }
  "exhib-outdoor-3.webp"        = { "https://tmleadercontract.com/wp-content/uploads/3-3.png.webp" }
  "exhib-milano-hero.webp"      = { "https://tmleadercontract.com/wp-content/uploads/Portada-blog.png" }
  "exhib-milano-1.webp"         = { "https://tmleadercontract.com/wp-content/uploads/1-3.png.webp" }
  "exhib-milano-2.webp"         = { "https://tmleadercontract.com/wp-content/uploads/2-4.png.webp" }
  "exhib-milano-3.webp"         = { "https://tmleadercontract.com/wp-content/uploads/4-3.png.webp" }
  "exhib-pure-1.webp"           = { "https://tmleadercontract.com/wp-content/uploads/TM-Leader-Contract-pure-identity-scaled.png" }
  "exhib-icons-hero.webp"       = { "https://tmleadercontract.com/wp-content/uploads/Web-BANNER_NEW-ICONS-scaled.png.webp" }
  "exhib-icons-1.webp"          = { "https://tmleadercontract.com/wp-content/uploads/a.png.webp" }
  "exhib-icons-2.webp"          = { "https://tmleadercontract.com/wp-content/uploads/sillon-neil_tm-leader-contract_mobiliario-hospitality-1.png.webp" }
  "exhib-icons-3.webp"          = { "https://tmleadercontract.com/wp-content/uploads/outdoor_tm-leader-contract_mobiliario-hospitality.png_0002_Capa-9.png.webp" }
  "exhib-novedades-hero.webp"   = { "https://tmleadercontract.com/wp-content/uploads/ejemplo-home-neil-rojo-scaled.jpg" }
  "exhib-novedades-1.webp"      = { "https://tmleadercontract.com/wp-content/uploads/NEIL-Y-DEVON-TM-LEADER-CONTRACT-MUEBLES.png.webp" }
  "exhib-novedades-2.webp"      = { "https://tmleadercontract.com/wp-content/uploads/sillon-neil_tm-leader-contract_mobiliario-hospitality-1.png.webp" }
  "exhib-novedades-3.webp"      = { "https://tmleadercontract.com/wp-content/uploads/butaca-devon-azul-tm-leader-contract-2.png" }
  "exhib-milano-2025-hero.webp" = { "https://tmleadercontract.com/wp-content/uploads/5.jpg" }
  "exhib-milano-2025-1.webp"    = { "https://tmleadercontract.com/wp-content/uploads/6.jpg" }
  "exhib-orgatec-hero.webp"      = { "https://tmleadercontract.com/wp-content/uploads/Portadas-orgatec-01.jpg" }
  "exhib-habitat-hero.webp"     = { "https://tmleadercontract.com/wp-content/uploads/Portadas-habitat-01.jpg" }
  "exhib-lisboa-hero.webp"      = { "https://tmleadercontract.com/wp-content/uploads/design-room-portada.jpg" }
  "exhib-marbella-hero.webp"    = { "https://tmleadercontract.com/wp-content/uploads/TM-Leader-Contract-Design-Room-Marbella-2025.png" }
}

foreach ($name in $assets.Keys) {
  $url = & $assets[$name]
  if (-not $url) { Write-Host "skip (no url): $name"; continue }
  $out = Join-Path $base $name
  try {
    Invoke-WebRequest -Uri $url -OutFile $out -UserAgent "Mozilla/5.0" -UseBasicParsing -TimeoutSec 300
    $b = [System.IO.File]::ReadAllBytes($out)
    $ok = ($b.Length -gt 1000) -and ($b[0] -ne 0x3C)
    Write-Host "$(if($ok){'ok'}else{'??'}) $name ($($b.Length) bytes)"
  } catch {
    Write-Host "fail $name"
  }
  Start-Sleep -Seconds 1
}

$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
$movPath = Join-Path $base "hero-milano-2026.mov"
$mp4Path = Join-Path $base "hero-milano-2026.mp4"
if ($ffmpeg -and (Test-Path $movPath) -and -not (Test-Path $mp4Path)) {
  Write-Host "Converting hero-milano-2026.mov -> .mp4 ..."
  & ffmpeg -y -i $movPath -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an $mp4Path 2>$null
  if (Test-Path $mp4Path) { Write-Host "ok hero-milano-2026.mp4" }
}

Write-Host "Done -> $base"

$dest = "D:\求职城市网\public\images\careers"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$images = @{
    "ai-engineer" = "https://s.coze.cn/image/0tyF3AyaMYg/"
    "data-scientist" = "https://s.coze.cn/image/2n1iEO0yEgg/"
    "doctor" = "https://s.coze.cn/image/kQHMkmhtR8A/"
    "lawyer" = "https://s.coze.cn/image/2G-_xlR1FUc/"
    "product-manager" = "https://s.coze.cn/image/49FjpJ3UFF0/"
    "software-engineer" = "https://s.coze.cn/image/_KQKIinL0AE/"
    "teacher" = "https://s.coze.cn/image/Qd66tQPeK5g/"
}

foreach ($name in $images.Keys) {
    $url = $images[$name]
    $outPath = Join-Path $dest "$name.webp"
    Write-Host "Downloading $name..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $outPath -UseBasicParsing -TimeoutSec 60
        $size = [math]::Round((Get-Item $outPath).Length / 1024, 1)
        Write-Host "  -> $outPath ($size KB)"
    } catch {
        Write-Host "  ERROR: $_"
    }
}

Write-Host "`nAll done!"

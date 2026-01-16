# FFmpeg Windows Installer
# Downloads and installs FFmpeg automatically

Write-Host "`n===================================================="
Write-Host "FFmpeg Installer for Katha Audio Generation"
Write-Host "====================================================`n"

$ffmpegUrl = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
$downloadPath = "$env:TEMP\ffmpeg.zip"
$extractPath = "C:\ffmpeg"
$binPath = "$extractPath\bin"

Write-Host "1. Downloading FFmpeg..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $ffmpegUrl -OutFile $downloadPath -UseBasicParsing
    Write-Host "   Download complete!`n" -ForegroundColor Green
} catch {
    Write-Host "   Download failed. Please download manually from:" -ForegroundColor Red
    Write-Host "   https://www.gyan.dev/ffmpeg/builds/" -ForegroundColor Cyan
    exit 1
}

Write-Host "2. Extracting FFmpeg..." -ForegroundColor Yellow
Expand-Archive -Path $downloadPath -DestinationPath $extractPath -Force

# Find the extracted folder
$ffmpegFolder = Get-ChildItem -Path $extractPath -Directory | Select-Object -First 1

# Move files to C:\ffmpeg\bin
if (Test-Path "$ffmpegFolder\bin") {
    if (-not (Test-Path $binPath)) {
        New-Item -ItemType Directory -Path $binPath -Force | Out-Null
    }
    Copy-Item -Path "$ffmpegFolder\bin\*" -Destination $binPath -Force
    Write-Host "   Extraction complete!`n" -ForegroundColor Green
}

Write-Host "3. Adding to PATH..." -ForegroundColor Yellow
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$binPath*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$binPath", "User")
    Write-Host "   Added to PATH!`n" -ForegroundColor Green
} else {
    Write-Host "   Already in PATH!`n" -ForegroundColor Green
}

Write-Host "4. Cleaning up..." -ForegroundColor Yellow
Remove-Item -Path $downloadPath -Force
Write-Host "   Cleanup complete!`n" -ForegroundColor Green

Write-Host "====================================================`n"
Write-Host "FFmpeg installed successfully!" -ForegroundColor Green
Write-Host "Location: $binPath" -ForegroundColor Cyan
Write-Host "`nIMPORTANT: Close and reopen your terminal for PATH changes to take effect.`n"
Write-Host "Then run: ffmpeg -version" -ForegroundColor Yellow
Write-Host "====================================================`n"

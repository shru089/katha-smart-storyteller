# Quick Start Script for Fresh Terminal
# Run this after closing and reopening your terminal

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "KATHA AUDIO GENERATION - Quick Start" -ForegroundColor Yellow
Write-Host "============================================`n" -ForegroundColor Cyan

# 1. Verify FFmpeg
Write-Host "1. Checking FFmpeg..." -ForegroundColor Yellow
try {
    $ffmpegVersion = ffmpeg -version 2>&1 | Select-Object -First 1
    Write-Host "   ✅ FFmpeg found: $ffmpegVersion`n" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ FFmpeg not found in PATH!" -ForegroundColor Red
    Write-Host "   Please restart your terminal or add C:\ffmpeg\bin to PATH manually.`n" -ForegroundColor Red
    exit 1
}

# 2. Navigate to backend
Write-Host "2. Navigating to backend directory..." -ForegroundColor Yellow
Set-Location C:\Users\admini\katha-smart-storyteller\backend
Write-Host "   ✅ In backend directory`n" -ForegroundColor Green

# 3. Activate virtual environment
Write-Host "3. Activating Python virtual environment..." -ForegroundColor Yellow
& .\.venv\Scripts\Activate.ps1
Write-Host "   ✅ Virtual environment activated`n" -ForegroundColor Green

# 4. Run audio generation
Write-Host "4. Starting audio generation...`n" -ForegroundColor Yellow
Write-Host "============================================`n" -ForegroundColor Cyan

python FINAL_AUDIO_GENERATION.py

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "Done!" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Cyan

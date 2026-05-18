#!/usr/bin/env powershell
# Katha PowerPoint Presentation Generator Launcher
# Run this from the project root: .\generate_ppt.ps1

Clear-Host
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Katha PowerPoint Presentation Generator (pptxgenjs)" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Check if Node is installed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Error: Node.js is not installed or not in your system PATH." -ForegroundColor Red
    Write-Host "    Please install Node.js from https://nodejs.org/ to run this generator." -ForegroundColor Yellow
    Exit 1
}

# Navigate to scripts directory
$scriptsDir = Join-Path $PSScriptRoot "scripts"
Set-Location $scriptsDir

# Install pptxgenjs if not installed
if (!(Test-Path "node_modules\pptxgenjs")) {
    Write-Host "[*] Installing dependency: pptxgenjs..." -ForegroundColor Yellow
    npm install pptxgenjs --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[!] Error: Failed to install pptxgenjs." -ForegroundColor Red
        Exit 1
    }
    Write-Host "[+] Dependency installed successfully!" -ForegroundColor Green
} else {
    Write-Host "[+] Dependency pptxgenjs is already installed." -ForegroundColor Green
}

# Run the PowerPoint generator
Write-Host "[*] Generating presentation slides..." -ForegroundColor Yellow
node generate_ppt.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "SUCCESS! PowerPoint Presentation Generated Successfully!" -ForegroundColor Green
    Write-Host "Location: " -NoNewline
    Write-Host "$PSScriptRoot\Katha_Presentation.pptx" -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Cyan
} else {
    Write-Host "[!] Error: Failed to generate the presentation." -ForegroundColor Red
}

# Return to root directory
Set-Location $PSScriptRoot

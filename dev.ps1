#!/usr/bin/env powershell
# Katha Local Development Startup Script
# Run this from the project root: .\dev.ps1

Write-Host "🚀 Starting Katha Development Environment..." -ForegroundColor Cyan

# Start backend
Write-Host "📡 Starting backend on port 8081..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$PSScriptRoot\backend'; Write-Host '🐍 Katha Backend' -ForegroundColor Green; .\.venv\Scripts\activate 2>$null; uvicorn app.main:app --host 127.0.0.1 --port 8081 --reload"
) -WindowStyle Normal

Start-Sleep -Seconds 2

# Start frontend
Write-Host "🎨 Starting frontend on port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$PSScriptRoot\frontend'; Write-Host '⚡ Katha Frontend' -ForegroundColor Green; npm run dev"
) -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "✅ Katha is starting up!" -ForegroundColor Green
Write-Host "   Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:   http://localhost:8081" -ForegroundColor White
Write-Host "   API Docs:  http://localhost:8081/docs" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop." -ForegroundColor Gray

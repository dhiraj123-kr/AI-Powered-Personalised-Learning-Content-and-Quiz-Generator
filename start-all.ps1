# PowerShell One-Click Launcher for AI Learning Platform

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "  Starting AI-Powered Personalised Learning Platform" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

# 1. Start MongoDB service or mongod process if needed
Write-Host "`n[1/3] Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if ($mongoService -and $mongoService.Status -ne "Running") {
    Start-Process -FilePath "net" -ArgumentList "start MongoDB" -Verb RunAs -Wait -ErrorAction SilentlyContinue
}

# 2. Start Backend API in a separate terminal window
Write-Host "[2/3] Launching Backend API (http://localhost:5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"

Start-Sleep -Seconds 2

# 3. Start Frontend in a separate terminal window
Write-Host "[3/3] Launching Frontend (http://localhost:5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "`n✅ Both servers launching in new windows!" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000/api" -ForegroundColor White

@echo off
TITLE AI Learning Platform - One-Click Launcher
echo =========================================================
echo   Starting AI-Powered Personalised Learning Platform
echo =========================================================
echo.

REM 1. Start MongoDB if not already running
echo [1/3] Starting local MongoDB instance on port 27017...
start "MongoDB Local Server" /min "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "%~dp0backend\data" --port 27017

timeout /t 3 >nul

REM 2. Start Backend API
echo [2/3] Starting Backend API on http://localhost:5000...
start "LearnAI - Backend API" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 2 >nul

REM 3. Start Frontend Dev Server
echo [3/3] Starting Frontend Dev Server on http://localhost:5173...
start "LearnAI - Frontend App" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo =========================================================
echo   All services launched!
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:5000/api
echo =========================================================
echo.
echo Press any key to exit this launcher window (servers keep running).
pause >nul

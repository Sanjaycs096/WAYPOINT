@echo off
setlocal enabledelayedexpansion

title Waypoint - Accessible Campus Navigation

:: Set current directory to the directory where this batch script lives
cd /d "%~dp0"

echo ===============================================================================
echo                   WAYPOINT - ACCESSIBLE CAMPUS NAVIGATION
echo                   Frontend-Only Local Development Server
echo ===============================================================================
echo.

:: 1. Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found on your system PATH.
    echo.
    echo Waypoint requires Node.js - version 20 or newer recommended - to run.
    echo Please download and install Node.js from:
    echo   https://nodejs.org/
    echo.
    echo After installing, reopen Command Prompt and run this launcher again.
    echo.
    pause
    exit /b 1
)

:: 2. Check for npm
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm was not found on your system PATH.
    echo.
    echo Please ensure npm is installed alongside Node.js.
    echo Download: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Display Node and npm versions
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
for /f "tokens=*" %%v in ('npm -v') do set NPM_VER=%%v
echo [OK] Detected Node.js %NODE_VER% and npm %NPM_VER%
echo.

:: 3. Check dependencies (node_modules)
if not exist "node_modules\" (
    echo [INFO] Dependencies are missing. Installing packages...
    if exist "package-lock.json" (
        echo Running: npm ci
        call npm ci
    ) else (
        echo Running: npm install
        call npm install
    )
    if %ERRORLEVEL% neq 0 (
        echo.
        echo [ERROR] Dependency installation failed.
        echo Please check your internet connection and try running 'npm install' manually.
        echo.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully.
    echo.
) else (
    echo [OK] Dependencies found in node_modules.
    echo.
)

:: 4. Launch Waypoint
echo ===============================================================================
echo  Architecture : Pure client-side application - No backend required
echo  Local URL    : http://localhost:3000
echo  Press Ctrl+C in this terminal window to stop the server at any time.
echo ===============================================================================
echo.
echo Starting development server on port 3000...
echo.

call npm run dev

if %ERRORLEVEL% neq 0 (
    echo.
    echo [WARNING] Server stopped with error code %ERRORLEVEL%.
    pause
)

@echo off
rem Nikke Library launcher: starts the local server and opens it in your browser.
rem Close this window (or press Ctrl+C) to stop the server.
cd /d "%~dp0"

set PORT=4170
set URL=http://localhost:%PORT%
rem Readiness checks use 127.0.0.1: the server listens on IPv4 only.
set CHECK=http://127.0.0.1:%PORT%/api/characters

if "%~1"=="__open_when_ready" goto open_when_ready

title Nikke Library

rem Already running? Just open the browser.
curl.exe -s -o nul --max-time 2 "%CHECK%"
if not errorlevel 1 (
  echo Nikke Library is already running at %URL%
  start "" "%URL%"
  ping -n 4 127.0.0.1 >nul
  exit /b
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install it from https://nodejs.org and try again.
  pause
  exit /b 1
)

rem A background copy of this script opens the browser once loading is done.
start "" /b cmd /c ""%~f0" __open_when_ready"

echo Starting Nikke Library... loading data takes about 30 seconds.
echo The browser will open by itself when it is ready.
echo Close this window to stop the server.
echo.
node server.js
echo.
echo Server stopped.
pause
exit /b

:open_when_ready
rem Poll for up to about 2 minutes; ping is used as a 1-second sleep.
set /a tries=0
:poll
curl.exe -s -o nul --max-time 2 "%CHECK%"
if not errorlevel 1 (
  start "" "%URL%"
  exit /b
)
set /a tries+=1
if %tries% geq 120 exit /b
ping -n 2 127.0.0.1 >nul
goto poll

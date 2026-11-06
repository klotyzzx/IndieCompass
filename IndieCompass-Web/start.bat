@echo off
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
 echo Install Node.js 24 LTS from https://nodejs.org and run this file again.
 pause
 exit /b 1
)
node launcher.mjs
if errorlevel 1 pause

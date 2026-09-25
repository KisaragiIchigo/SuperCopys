@echo off
echo =======================================
echo SuperCopy (React+Electron) Build Script
echo =======================================

cd /d "%~dp0Remake"

echo.
echo [1/2] Installing dependencies...
call npm install

echo.
echo [2/2] Compiling and Packaging app...
call npm run package

echo.
echo =======================================
echo Build Complete!
echo Check the Remake\release folder.
echo =======================================
pause

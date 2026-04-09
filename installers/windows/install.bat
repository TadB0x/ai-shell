@echo off
setlocal EnableDelayedExpansion

echo.
echo  ==============================================
echo   ai-shell installer for Windows
echo  ==============================================
echo.

:: Check for admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo  [ERROR] Please run this installer as Administrator.
    pause
    exit /b 1
)

:: Check Node.js
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo  [ERROR] Node.js not found. Install it from https://nodejs.org ^(v18+^)
    pause
    exit /b 1
)

set INSTALL_DIR=%ProgramFiles%\ai-shell
set APP_DIR=%INSTALL_DIR%\app

echo  Installing to: %INSTALL_DIR%
echo.

if not exist "%APP_DIR%" mkdir "%APP_DIR%"

:: Copy app files
xcopy /e /i /y "%~dp0app" "%APP_DIR%" >nul

:: Write launcher batch file
(
echo @echo off
echo node "%APP_DIR%\dist\index.js" %%*
) > "%INSTALL_DIR%\ai.cmd"

:: Add to PATH
echo %PATH% | find /i "%INSTALL_DIR%" >nul
if %errorLevel% neq 0 (
    setx /M PATH "%PATH%;%INSTALL_DIR%" >nul
    echo  PATH updated. Restart your terminal.
)

echo.
echo  ==============================================
echo   Installation complete!
echo  ==============================================
echo.
echo   Open a new terminal and run:
echo     ai config
echo   Then:
echo     ai list files larger than 100mb
echo.
pause

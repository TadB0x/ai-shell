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
    echo  Right-click install.bat and select "Run as administrator"
    pause
    exit /b 1
)

set INSTALL_DIR=%ProgramFiles%\ai-shell
set BIN_SOURCE=%~dp0ai-win-x64.exe

:: Check binary exists
if not exist "%BIN_SOURCE%" (
    echo  [ERROR] ai-win-x64.exe not found next to install.bat
    echo  Make sure both files are in the same folder.
    pause
    exit /b 1
)

echo  Installing to: %INSTALL_DIR%
echo.

:: Create install dir
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

:: Copy binary
copy /y "%BIN_SOURCE%" "%INSTALL_DIR%\ai.exe" >nul
if %errorLevel% neq 0 (
    echo  [ERROR] Failed to copy binary.
    pause
    exit /b 1
)

:: Add to PATH if not already there
echo %PATH% | find /i "%INSTALL_DIR%" >nul
if %errorLevel% neq 0 (
    echo  Adding %INSTALL_DIR% to system PATH...
    setx /M PATH "%PATH%;%INSTALL_DIR%" >nul
    echo  PATH updated. You may need to restart your terminal.
) else (
    echo  PATH already contains %INSTALL_DIR%
)

echo.
echo  ==============================================
echo   Installation complete!
echo  ==============================================
echo.
echo   Open a new terminal and run:
echo     ai config
echo   Then:
echo     ai "list files larger than 100mb"
echo.
pause

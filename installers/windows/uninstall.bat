@echo off
echo.
echo  Uninstalling ai-shell...

net session >nul 2>&1
if %errorLevel% neq 0 (
    echo  [ERROR] Please run as Administrator.
    pause
    exit /b 1
)

set INSTALL_DIR=%ProgramFiles%\ai-shell

if exist "%INSTALL_DIR%\ai.exe" (
    del /f /q "%INSTALL_DIR%\ai.exe"
    rmdir "%INSTALL_DIR%"
    echo  Removed %INSTALL_DIR%
) else (
    echo  ai-shell does not appear to be installed.
)

echo.
echo  Done. You may also want to remove %INSTALL_DIR% from your PATH manually.
pause

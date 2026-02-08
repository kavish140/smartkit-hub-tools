@echo off
echo ===============================================
echo  Windows Defender - Add Exclusion for exe
echo ===============================================
echo.

:: Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo This script requires Administrator privileges.
    echo Right-click this file and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo Running with Administrator privileges...
echo.

:: Add exclusion using PowerShell
powershell -Command "Add-MpPreference -ExclusionPath 'S:\smartkit\smartkit-hub-tools-main\smartkit-hub-tools-main\public\VideoDownloaderPro.exe'"

if %errorLevel% equ 0 (
    echo.
    echo SUCCESS! Exclusion added.
    echo VideoDownloaderPro.exe is now allowed to run.
    echo.
    echo Try opening the exe file now - it should work!
    echo.
) else (
    echo.
    echo ERROR: Failed to add exclusion.
    echo.
    echo Manual method:
    echo 1. Open Windows Security
    echo 2. Virus and threat protection -^> Manage settings
    echo 3. Exclusions -^> Add or remove exclusions
    echo 4. Add exclusion -^> File
    echo 5. Select: S:\smartkit\smartkit-hub-tools-main\smartkit-hub-tools-main\public\VideoDownloaderPro.exe
    echo.
)

pause


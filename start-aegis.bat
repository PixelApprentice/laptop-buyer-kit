@echo off
:: Aegis Laptop Diagnostics - USB Portable Launcher
:: --------------------------------------------------
:: This batch file starts the Aegis server and opens the browser.
:: It requires Python 3.10+ to be installed on the target machine.
::
:: UAC elevation is requested via the .manifest file so Aegis
:: can access hardware telemetry registers (SMART, hwmon, ACPI).
::
:: NO data is sent externally. 100% offline and local.

title Aegis Laptop Diagnostics

:: Check Python is available
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Download from https://www.python.org/downloads/
    pause
    exit /b 1
)

:: Install/check the package (offline from this USB if bundled)
echo [Aegis] Checking installation...
python -m pip install -e . --quiet 2>nul
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Could not install via pip. Trying direct launch...
)

:: Launch the server on localhost:8080
echo [Aegis] Starting offline diagnostics server on http://127.0.0.1:8080
start "" python -m laptop_inspector.web.server

:: Wait 2 seconds for server to start
timeout /t 2 /nobreak >nul

:: Open browser
echo [Aegis] Opening browser...
start "" http://127.0.0.1:8080

echo [Aegis] Server running. Press Ctrl+C in the server window to stop.
pause

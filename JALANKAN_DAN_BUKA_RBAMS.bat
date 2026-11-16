@echo off
chcp 65001 >nul
title Risk Based Audit Management System (RBAMS) - PT. Agung Putra Nirantara
echo ======================================================================
echo    RISK BASED AUDIT MANAGEMENT SYSTEM (RBAMS)
echo    PT. AGUNG PUTRA NIRANTARA
echo ======================================================================
echo.

:: Periksa apakah port 3000 sedang aktif
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Menyalakan Web Server RBAMS...
    cd /d "%~dp0rbams-ui"
    start /min cmd /c "npx vite preview --port 3000 --host"
    timeout /t 2 /nobreak >nul
) else (
    echo [INFO] Server RBAMS sudah aktif berjalan.
)

echo [INFO] Membuka aplikasi RBAMS di web browser...
start http://localhost:3000/

echo.
echo ======================================================================
echo    Aplikasi berhasil dibuka di browser: http://localhost:3000/
echo    Jendela ini dapat Anda tutup kapan saja.
echo ======================================================================
timeout /t 3 >nul
exit

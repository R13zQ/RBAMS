@echo off
chcp 65001 >nul
title Sinkronisasi RBAMS ke GitHub (R13zQ/RBAMS)
echo ======================================================================
echo    SINKRONISASI UPDATE RBAMS KE GITHUB
echo    Repository: https://github.com/R13zQ/RBAMS
echo ======================================================================
echo.

echo [1/3] Menyiapkan perubahan file...
cd /d "%~dp0"
git add .

set msg=Update RBAMS (%date% %time%)
set /p usermsg="Tulis catatan perubahan [Tekan Enter untuk default]: "
if not "%usermsg%"=="" set msg=%usermsg%

echo.
echo [2/3] Menyimpan perubahan ke Git...
git commit -m "%msg%"

echo.
echo [3/3] Mengunggah (Push) ke GitHub...
git pull --rebase origin main >nul 2>&1
git push origin main

echo.
if %errorlevel% equ 0 (
    echo ======================================================================
    echo    BERHASIL! Update sudah tersimpan di GitHub:
    echo    https://github.com/R13zQ/RBAMS
    echo ======================================================================
) else (
    echo ======================================================================
    echo    [PERHATIAN] Gagal mengunggah ke GitHub.
    echo    Silakan periksa koneksi internet atau login GitHub Anda.
    echo ======================================================================
)
echo.
pause

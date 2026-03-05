@echo off
title FermerX - Ishga tushirish
color 0A
echo.
echo  =============================================
echo   FermerX - Fermer xo'jaligi boshqaruv tizimi
echo  =============================================
echo.
echo  Ilova ishga tushirilmoqda...
echo  Brauzer avtomatik ochiladi.
echo.
echo  Ilovani to'xtatish uchun: Ctrl+C bosing
echo  =============================================
echo.
cd /d "%~dp0"
npm run dev
pause

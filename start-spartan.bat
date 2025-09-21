@echo off
TITLE SPARTAN 4 - Iniciando Entorno de Desarrollo

echo ========================================
echo    SPARTAN 4 - Entorno de Desarrollo
echo ========================================

echo.
echo Verificando requisitos previos...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado o no esta en el PATH
    echo Por favor instale Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Deteniendo procesos anteriores si existen...
taskkill /F /IM node.exe 2>nul

echo.
echo Iniciando servidor backend...
cd backend
start "SPARTAN 4 - Backend" /MIN cmd /c "npm run dev ^|^| pause"
cd ..

timeout /t 5 /nobreak >nul

echo.
echo Iniciando servidor frontend...
start "SPARTAN 4 - Frontend" /MIN cmd /c "npm run dev ^|^| pause"

echo.
echo ========================================
echo    SPARTAN 4 se esta iniciando...
echo ========================================
echo.
echo Servidores:
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:3001
echo.
echo Credenciales de prueba:
echo - Email: testuser@example.com
echo - Contraseña: TestPass123!
echo.
echo Para detener los servidores, cierre ambas ventanas de terminal
echo o presione Ctrl+C en cada una.
echo.
echo Presione cualquier tecla para abrir el navegador...
pause >nul

start http://localhost:5173

echo.
echo SPARTAN 4 esta ahora en ejecucion.
echo.
echo Presione cualquier tecla para salir...
pause >nul
@echo off
TITLE SPARTAN 4 - Crear Acceso Directo

echo ========================================
echo    SPARTAN 4 - Crear Acceso Directo
echo ========================================

echo.
echo Creando acceso directo en el escritorio...
echo.

powershell -Command ^
$DesktopPath = [System.Environment]::GetFolderPath('Desktop'); ^
$WshShell = New-Object -comObject WScript.Shell; ^
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\SPARTAN 4.lnk"); ^
$Shortcut.TargetPath = "%~dp0start-spartan.bat"; ^
$Shortcut.WorkingDirectory = "%~dp0"; ^
$Shortcut.IconLocation = "%~dp0public\favicon.ico,0"; ^
$Shortcut.Save()

echo.
echo Acceso directo "SPARTAN 4" creado en el escritorio.
echo.
echo Puede iniciar SPARTAN 4 haciendo doble clic en el acceso directo.
echo.
pause
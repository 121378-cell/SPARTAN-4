import { writeFileSync } from 'fs';
import { join } from 'path';

// Create a simple installer script that packages our startup files
const installerContent = `
@echo off
TITLE SPARTAN 4 Installer

echo ========================================
echo    SPARTAN 4 - Instalador
echo ========================================

echo.
echo Creando accesos directos...
echo.

REM Create desktop shortcut
set "desktop_shortcut=%USERPROFILE%\\Desktop\\SPARTAN 4.lnk"
set "target=%~dp0start-spartan.bat"
set "working_dir=%~dp0"

echo Set oWS = WScript.CreateObject("WScript.Shell") > CreateShortcut.vbs
echo sLinkFile = oWS.ExpandEnvironmentStrings("%desktop_shortcut%") >> CreateShortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> CreateShortcut.vbs
echo oLink.TargetPath = "%target%" >> CreateShortcut.vbs
echo oLink.WorkingDirectory = "%working_dir%" >> CreateShortcut.vbs
echo oLink.Save >> CreateShortcut.vbs

cscript CreateShortcut.vbs
del CreateShortcut.vbs

echo.
echo Acceso directo creado en el escritorio.
echo.
echo Instalacion completada.
echo.
echo Puede iniciar SPARTAN 4 desde el acceso directo en su escritorio.
echo.
pause
`;

writeFileSync(join('.', 'create-shortcut.bat'), installerContent);
console.log('Installer script created successfully!');
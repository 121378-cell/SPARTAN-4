# SPARTAN 4 - Enhanced Startup Script
param(
    [switch]$NoBrowser,
    [switch]$Quiet
)

function Write-Status {
    param([string]$Message, [string]$Color = "White")
    if (-not $Quiet) {
        Write-Host $Message -ForegroundColor $Color
    }
}

function Write-Header {
    param([string]$Message)
    if (-not $Quiet) {
        Write-Host "========================================" -ForegroundColor Green
        Write-Host $Message -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
    }
}

function Test-CommandExists {
    param([string]$Command)
    $exists = $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
    return $exists
}

function Kill-ProcessByPort {
    param([int]$Port)
    
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($connection in $connections) {
            $processId = $connection.OwningProcess
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            if ($process) {
                Write-Status "Deteniendo proceso en el puerto $Port (PID: $processId) - $($process.ProcessName)" -Color Yellow
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

# Main execution
Write-Header "SPARTAN 4 - Entorno de Desarrollo"

# Check prerequisites
Write-Status "Verificando requisitos previos..." -Color Cyan
if (-not (Test-CommandExists "npm")) {
    Write-Status "ERROR: Node.js no esta instalado o no esta en el PATH" -Color Red
    Write-Status "Por favor instale Node.js desde https://nodejs.org/" -Color Red
    exit 1
}

# Kill existing processes
Write-Status "Deteniendo procesos anteriores si existen..." -Color Yellow
Kill-ProcessByPort 3001  # Backend
Kill-ProcessByPort 5173  # Frontend

# Start backend
Write-Status "Iniciando servidor backend..." -Color Cyan
Set-Location -Path "backend"
$backendJob = Start-Job -ScriptBlock {
    Set-Location -Path $using:PSScriptRoot\backend
    npm run dev
}
Set-Location -Path ".."

Start-Sleep -Seconds 5

# Start frontend
Write-Status "Iniciando servidor frontend..." -Color Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location -Path $using:PSScriptRoot
    npm run dev
}

# Wait a moment for servers to start
Start-Sleep -Seconds 3

# Display status
Write-Header "SPARTAN 4 esta ahora en ejecucion"
Write-Status "Servidores:" -Color White
Write-Status "  - Frontend: http://localhost:5173" -Color White
Write-Host "  - Backend:  http://localhost:3001" -Color White
Write-Status "" -Color White
Write-Status "Credenciales de prueba:" -Color Yellow
Write-Status "  - Email: testuser@example.com" -Color White
Write-Status "  - Contraseña: TestPass123!" -Color White
Write-Status "" -Color White

# Open browser unless -NoBrowser flag is used
if (-not $NoBrowser) {
    Write-Status "Abriendo navegador..." -Color Cyan
    Start-Process "http://localhost:5173"
}

Write-Status "Para detener los servidores, cierre esta ventana o presione Ctrl+C" -Color Gray
Write-Status "" -Color White

# Wait for user input or jobs to complete
Write-Status "Presione cualquier tecla para detener los servidores..." -Color Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Cleanup
Write-Status "Deteniendo servidores..." -Color Yellow
Stop-Job $backendJob -ErrorAction SilentlyContinue
Stop-Job $frontendJob -ErrorAction SilentlyContinue
Remove-Job $backendJob -ErrorAction SilentlyContinue
Remove-Job $frontendJob -ErrorAction SilentlyContinue

Write-Status "SPARTAN 4 se ha detenido correctamente." -Color Green
# SPARTAN 4 Development Environment Startup Script
Write-Host "========================================" -ForegroundColor Green
Write-Host "Starting SPARTAN 4 Development Environment" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "Checking for existing processes..." -ForegroundColor Yellow

# Function to kill process by port
function Kill-ProcessByPort {
    param([int]$Port)
    
    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($process) {
        $pid = $process.OwningProcess
        Write-Host "Killing process using port $Port (PID: $pid)" -ForegroundColor Yellow
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
}

# Kill processes using our ports
Kill-ProcessByPort 3001  # Backend
Kill-ProcessByPort 5174  # Frontend

Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Cyan
Set-Location -Path "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal -PassThru
Set-Location -Path ".."

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Starting frontend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal -PassThru

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "SPARTAN 4 Development Environment Started" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5174" -ForegroundColor White
Write-Host "Backend: http://localhost:3001" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Login with:" -ForegroundColor Yellow
Write-Host "Email: testuser@example.com" -ForegroundColor White
Write-Host "Password: TestPass123!" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
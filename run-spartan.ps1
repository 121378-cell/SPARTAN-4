# SPARTAN 4 Development Environment Startup Script (Fixed Version)
Write-Host "========================================" -ForegroundColor Green
Write-Host "Starting SPARTAN 4 Development Environment" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "Checking for existing processes..." -ForegroundColor Yellow

# Function to kill process by port
function Kill-ProcessByPort {
    param([int]$Port)
    
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($connection in $connections) {
            $processId = $connection.OwningProcess
            Write-Host "Killing process using port $Port (PID: $processId)" -ForegroundColor Yellow
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        }
    }
}

# Kill processes using our ports
Kill-ProcessByPort 3001  # Backend
Kill-ProcessByPort 5174  # Frontend

Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Cyan
Set-Location -Path "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal
Set-Location -Path ".."

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Starting frontend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

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
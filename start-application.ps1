Write-Host "Starting Banking Application..." -ForegroundColor Green

# Start backend server
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location backend; mvn spring-boot:run" -WindowStyle Normal

# Wait for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

# Start frontend server
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location Frontend; npx vite" -WindowStyle Normal

Write-Host ""
Write-Host "Banking Application startup initiated!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend server will be available at: http://localhost:8081" -ForegroundColor Blue
Write-Host "Frontend server will be available at: http://localhost:5173" -ForegroundColor Blue
Write-Host ""
Write-Host "You can access the application at: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
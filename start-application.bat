@echo off
echo Starting Banking Application...

REM Open backend in a new command prompt window
start "Backend Server" cmd /k "cd backend && mvn spring-boot:run"

REM Wait a few seconds for backend to start
timeout /t 10 /nobreak >nul

REM Open frontend in a new command prompt window
start "Frontend Server" cmd /k "cd Frontend && npx vite"

echo.
echo Banking Application startup initiated!
echo.
echo Backend server will be available at: http://localhost:8081
echo Frontend server will be available at: http://localhost:5173
echo.
echo You can access the application at: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul
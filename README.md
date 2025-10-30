# Banking Application

A full-stack banking application with React frontend and Java Spring Boot backend.

## Project Structure
```
Banking Application/
├── backend/              # Java Spring Boot backend
├── Frontend/             # React frontend
├── start-application.bat # Windows batch script to start both servers
├── start-application.ps1 # PowerShell script to start both servers
└── README.md             # This file
```

## Prerequisites
- Java 17 or higher
- Maven
- Node.js and npm
- Git

## How to Run the Application

### Option 1: Using the Automated Scripts (Recommended)

#### Windows Batch Script
Double-click on `start-application.bat` or run from command prompt:
```
start-application.bat
```

#### PowerShell Script
Right-click on `start-application.ps1` and select "Run with PowerShell" or run from PowerShell:
```
.\start-application.ps1
```

### Option 2: Manual Start

#### Start Backend Server
1. Open a terminal/command prompt
2. Navigate to the `backend` directory
3. Run: `mvn spring-boot:run`
4. The backend server will start on port 8081

#### Start Frontend Server
1. Open another terminal/command prompt
2. Navigate to the `Frontend` directory
3. Run: `npx vite`
4. The frontend server will start on port 5173

## Access the Application
After starting both servers:
- Open your browser and go to: http://localhost:5173
- The banking application UI will be displayed

## API Endpoints
- Backend API: http://localhost:8081/api/
- H2 Database Console: http://localhost:8081/h2-console

## Features
- Account creation and management
- Deposit and withdrawal functionality
- Money transfer between accounts
- Transaction history
- Responsive web interface

## Technology Stack
### Backend
- Java 17
- Spring Boot
- Spring Data JPA
- H2 Database
- Maven

### Frontend
- React
- Vite
- JavaScript
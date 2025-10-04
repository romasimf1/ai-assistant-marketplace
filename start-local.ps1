# AI Assistant Marketplace - Local Development Setup (PowerShell)
# This script sets up and runs the full-stack application locally on Windows

param(
    [switch]$UseDocker,
    [switch]$SkipSetup
)

Write-Host "🚀 Starting AI Assistant Marketplace - Local Development" -ForegroundColor Blue
Write-Host "======================================================" -ForegroundColor Blue

# Check if we're in the right directory
if (!(Test-Path "package.json") -or !(Test-Path "backend") -or !(Test-Path "frontend")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Function to check Docker
function Test-Docker {
    try {
        $dockerVersion = docker --version 2>$null
        $composeVersion = docker-compose --version 2>$null
        if ($dockerVersion -and $composeVersion) {
            Write-Host "✅ Docker and Docker Compose are available" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "⚠️ Docker not found. Will use manual setup." -ForegroundColor Yellow
        return $false
    }
    return $false
}

# Setup backend
function Setup-Backend {
    Write-Host "🔧 Setting up backend..." -ForegroundColor Blue

    Push-Location backend

    # Check if node_modules exists
    if (!(Test-Path "node_modules")) {
        Write-Host "📦 Installing backend dependencies..." -ForegroundColor Blue
        npm install
    } else {
        Write-Host "✅ Backend dependencies already installed" -ForegroundColor Green
    }

    # Generate Prisma client
    Write-Host "🗃️ Generating Prisma client..." -ForegroundColor Blue
    npm run prisma:generate

    # Setup database
    Write-Host "💾 Setting up database..." -ForegroundColor Blue
    npm run prisma:push

    Pop-Location
    Write-Host "✅ Backend setup completed" -ForegroundColor Green
}

# Setup frontend
function Setup-Frontend {
    Write-Host "🎨 Setting up frontend..." -ForegroundColor Blue

    Push-Location frontend

    # Check if node_modules exists
    if (!(Test-Path "node_modules")) {
        Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Blue
        npm install
    } else {
        Write-Host "✅ Frontend dependencies already installed" -ForegroundColor Green
    }

    Pop-Location
    Write-Host "✅ Frontend setup completed" -ForegroundColor Green
}

# Start with Docker
function Start-Docker {
    Write-Host "🐳 Starting services with Docker Compose..." -ForegroundColor Blue

    if (!(Test-Path "docker-compose.yml")) {
        Write-Host "❌ docker-compose.yml not found!" -ForegroundColor Red
        return $false
    }

    # Create .env files if they don't exist
    if (!(Test-Path "backend\.env")) {
        Write-Host "📝 Creating backend .env file..." -ForegroundColor Yellow
        if (Test-Path "backend\env-example.txt") {
            Copy-Item "backend\env-example.txt" "backend\.env"
        }
    }

    if (!(Test-Path "frontend\.env.local")) {
        Write-Host "📝 Creating frontend .env.local file..." -ForegroundColor Yellow
        "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" | Out-File -FilePath "frontend\.env.local" -Encoding UTF8
    }

    # Start services
    docker-compose up --build -d

    Write-Host "✅ Services started with Docker!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔧 Backend API: http://localhost:3001" -ForegroundColor Cyan
    Write-Host "🏥 Health Check: http://localhost:3001/health" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Yellow
    Write-Host "  Logs: docker-compose logs -f"
    Write-Host "  Stop: docker-compose down"

    return $true
}

# Start manually
function Start-Manual {
    Write-Host "🔧 Starting services manually..." -ForegroundColor Blue

    # Start backend
    Write-Host "🚀 Starting backend server..." -ForegroundColor Blue
    Push-Location backend
    Start-Job -ScriptBlock {
        param($Path)
        Set-Location $Path
        npm run dev
    } -ArgumentList $PWD.Path | Out-Null
    $backendJob = Get-Job | Select-Object -Last 1
    Pop-Location

    # Wait a bit
    Start-Sleep -Seconds 3

    # Start frontend
    Write-Host "🚀 Starting frontend server..." -ForegroundColor Blue
    Push-Location frontend
    Start-Job -ScriptBlock {
        param($Path)
        Set-Location $Path
        npm run dev
    } -ArgumentList $PWD.Path | Out-Null
    $frontendJob = Get-Job | Select-Object -Last 1
    Pop-Location

    Write-Host "✅ Services started manually!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔧 Backend API: http://localhost:3001" -ForegroundColor Cyan
    Write-Host "🏥 Health Check: http://localhost:3001/health" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To stop services:" -ForegroundColor Yellow
    Write-Host "  Stop-Job -Id $($backendJob.Id), $($frontendJob.Id)"
    Write-Host "  Remove-Job -Id $($backendJob.Id), $($frontendJob.Id)"
}

# Health check
function Test-Health {
    Write-Host "🏥 Running health checks..." -ForegroundColor Blue

    Start-Sleep -Seconds 5

    try {
        $backendResponse = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 10
        if ($backendResponse.StatusCode -eq 200) {
            Write-Host "✅ Backend is healthy" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️ Backend health check failed" -ForegroundColor Yellow
    }

    try {
        $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10
        if ($frontendResponse.StatusCode -eq 200) {
            Write-Host "✅ Frontend is responding" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️ Frontend health check failed" -ForegroundColor Yellow
    }
}

# Main execution
if (!$SkipSetup) {
    Setup-Backend
    Write-Host ""
    Setup-Frontend
    Write-Host ""
}

# Choose startup method
$dockerAvailable = Test-Docker

if ($UseDocker -and $dockerAvailable) {
    $result = Start-Docker
    if ($result) {
        Test-Health
        exit 0
    }
} elseif ($dockerAvailable) {
    $useDocker = Read-Host "Use Docker Compose? (y/n)"
    if ($useDocker -eq "y" -or $useDocker -eq "Y") {
        $result = Start-Docker
        if ($result) {
            Test-Health
            exit 0
        }
    }
}

# Manual startup
Start-Manual
Test-Health

Write-Host ""
Write-Host "✅ Setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Useful PowerShell commands:" -ForegroundColor Blue
Write-Host "  View running jobs: Get-Job"
Write-Host "  Stop all jobs: Get-Job | Stop-Job; Get-Job | Remove-Job"
Write-Host "  View job output: Receive-Job -Id <job-id>"

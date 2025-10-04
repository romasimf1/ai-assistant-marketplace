#!/bin/bash

# AI Assistant Marketplace - Local Development Setup
# This script sets up and runs the full-stack application locally

echo "🚀 Starting AI Assistant Marketplace - Local Development"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is available
check_docker() {
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        print_success "Docker and Docker Compose are available"
        return 0
    else
        print_warning "Docker not found. Will use manual setup."
        return 1
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."

    if [ ! -d "backend" ]; then
        print_error "Backend directory not found!"
        exit 1
    fi

    cd backend

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
    else
        print_success "Backend dependencies already installed"
    fi

    # Generate Prisma client
    print_status "Generating Prisma client..."
    npm run prisma:generate

    # Setup database
    print_status "Setting up database..."
    npm run prisma:push

    # Run database seed (if exists)
    if [ -f "prisma/seed.js" ] || [ -f "prisma/seed.ts" ]; then
        print_status "Seeding database..."
        npm run prisma:db:seed 2>/dev/null || print_warning "No seed script found"
    fi

    cd ..
    print_success "Backend setup completed"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."

    if [ ! -d "frontend" ]; then
        print_error "Frontend directory not found!"
        exit 1
    fi

    cd frontend

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    else
        print_success "Frontend dependencies already installed"
    fi

    cd ..
    print_success "Frontend setup completed"
}

# Start services with Docker
start_docker() {
    print_status "Starting services with Docker Compose..."

    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found!"
        return 1
    fi

    # Create .env files if they don't exist
    if [ ! -f "backend/.env" ]; then
        print_warning "Creating backend .env file..."
        cp backend/env-example.txt backend/.env 2>/dev/null || print_warning "env-example.txt not found"
    fi

    if [ ! -f "frontend/.env.local" ]; then
        print_warning "Creating frontend .env.local file..."
        echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" > frontend/.env.local
    fi

    # Start services
    docker-compose up --build -d

    print_success "Services started with Docker!"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:3001"
    echo "🏥 Health Check: http://localhost:3001/health"
    echo "📊 Database Admin: http://localhost:5555 (if configured)"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
}

# Start services manually
start_manual() {
    print_status "Starting services manually..."

    # Start backend in background
    print_status "Starting backend server..."
    cd backend
    npm run dev > ../backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..

    # Wait a bit for backend to start
    sleep 3

    # Start frontend in background
    print_status "Starting frontend server..."
    cd frontend
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..

    print_success "Services started manually!"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:3001"
    echo "🏥 Health Check: http://localhost:3001/health"
    echo ""
    echo "Process IDs: Backend($BACKEND_PID), Frontend($FRONTEND_PID)"
    echo "To stop: kill $BACKEND_PID $FRONTEND_PID"
    echo ""
    echo "Logs:"
    echo "  Backend: tail -f backend.log"
    echo "  Frontend: tail -f frontend.log"
}

# Health check
health_check() {
    print_status "Running health checks..."

    # Wait for services to start
    sleep 5

    # Check backend health
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_warning "Backend health check failed"
    fi

    # Check frontend
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is responding"
    else
        print_warning "Frontend health check failed"
    fi
}

# Main execution
main() {
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi

    print_status "AI Assistant Marketplace - Local Setup"
    echo ""

    # Setup components
    setup_backend
    echo ""
    setup_frontend
    echo ""

    # Choose startup method
    if check_docker; then
        echo ""
        read -p "Use Docker Compose? (y/n): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            start_docker
            health_check
            exit 0
        fi
    fi

    # Manual startup
    start_manual
    health_check

    print_success "Setup completed!"
    echo ""
    print_status "Useful commands:"
    echo "  View backend logs: tail -f backend.log"
    echo "  View frontend logs: tail -f frontend.log"
    echo "  Stop services: kill $BACKEND_PID $FRONTEND_PID"
    echo "  Docker logs: docker-compose logs -f"
    echo "  Stop Docker: docker-compose down"
}

# Run main function
main "$@"

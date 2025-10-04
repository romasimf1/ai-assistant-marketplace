#!/bin/bash

echo "🚀 Starting AI Assistant Marketplace Project..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Generate Prisma client
echo "🗃️ Generating Prisma client..."
npm run prisma:generate

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Start backend in background
echo "⚙️ Starting backend server..."
cd ../backend
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 5

# Start frontend
echo "🌐 Starting frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Project started successfully!"
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend: http://localhost:3001"
echo "📍 Health check: http://localhost:3001/health"

# Wait for user to stop
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

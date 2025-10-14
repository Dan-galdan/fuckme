#!/bin/bash

echo "🔧 COMPLETE PORT ISSUE FIX"
echo "=========================="

# Define ports
BACKEND_PORT=4000
FRONTEND_PORT=5173
FRONTEND_PORT_ALT=5176

echo "📊 Current port usage:"
echo "----------------------"
lsof -i :$BACKEND_PORT -i :$FRONTEND_PORT -i :$FRONTEND_PORT_ALT 2>/dev/null || echo "No processes found on these ports"

echo ""
echo "🧹 Step 1: Killing ALL development processes..."
echo "----------------------------------------------"

# Kill all Node.js processes
echo "Killing all Node.js processes..."
pkill -f "node.*vite" 2>/dev/null || echo "No vite processes found"
pkill -f "node.*tsx" 2>/dev/null || echo "No tsx processes found"
pkill -f "concurrently" 2>/dev/null || echo "No concurrently processes found"

# Kill processes by port
for port in $BACKEND_PORT $FRONTEND_PORT $FRONTEND_PORT_ALT; do
    PID=$(lsof -t -i :$port 2>/dev/null)
    if [ -n "$PID" ]; then
        echo "Killing process $PID on port $port"
        kill -9 $PID 2>/dev/null || echo "Process $PID already dead"
    else
        echo "Port $port is free"
    fi
done

echo ""
echo "⏳ Waiting for processes to terminate..."
sleep 3

echo ""
echo "🔍 Step 2: Verifying ports are free..."
echo "--------------------------------------"
for port in $BACKEND_PORT $FRONTEND_PORT $FRONTEND_PORT_ALT; do
    if lsof -i :$port >/dev/null 2>&1; then
        echo "❌ Port $port is still in use!"
        PID=$(lsof -t -i :$port)
        echo "Force killing PID $PID..."
        kill -9 $PID 2>/dev/null
        sleep 1
    else
        echo "✅ Port $port is free"
    fi
done

echo ""
echo "🧽 Step 3: Cleaning up any remaining processes..."
echo "------------------------------------------------"
# Kill any remaining development processes
pkill -f "npm.*dev" 2>/dev/null || echo "No npm dev processes found"
pkill -f "pnpm.*dev" 2>/dev/null || echo "No pnpm dev processes found"

echo ""
echo "📋 Step 4: Final port status..."
echo "-------------------------------"
echo "Backend port ($BACKEND_PORT):"
lsof -i :$BACKEND_PORT 2>/dev/null || echo "  ✅ FREE"

echo "Frontend port ($FRONTEND_PORT):"
lsof -i :$FRONTEND_PORT 2>/dev/null || echo "  ✅ FREE"

echo "Alternative frontend port ($FRONTEND_PORT_ALT):"
lsof -i :$FRONTEND_PORT_ALT 2>/dev/null || echo "  ✅ FREE"

echo ""
echo "🚀 Step 5: Starting clean development environment..."
echo "----------------------------------------------------"
echo "Starting backend and frontend on correct ports..."

# Start the development environment
npm run dev

echo ""
echo "✅ PORT ISSUE FIX COMPLETE!"
echo "=========================="
echo "Backend should be running on: http://localhost:$BACKEND_PORT"
echo "Frontend should be running on: http://localhost:$FRONTEND_PORT"
echo ""
echo "If you still see port conflicts, run this script again."

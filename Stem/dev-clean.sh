#!/bin/bash

# Clean development script - kills all existing dev processes before starting new ones

echo "🧹 Cleaning up existing development processes..."

# Kill all npm, tsx, and concurrently processes
pkill -f "npm.*dev"
pkill -f "tsx.*watch"
pkill -f "concurrently"

# Wait a moment for processes to terminate
sleep 2

# Check if port 4000 is still in use
if lsof -i :4000 > /dev/null 2>&1; then
    echo "⚠️  Port 4000 still in use, force killing..."
    lsof -ti :4000 | xargs kill -9
fi

# Check if port 5173 is still in use
if lsof -i :5173 > /dev/null 2>&1; then
    echo "⚠️  Port 5173 still in use, force killing..."
    lsof -ti :5173 | xargs kill -9
fi

echo "✅ Cleanup complete!"
echo "🚀 Starting development servers..."

# Start the development servers
npm run dev

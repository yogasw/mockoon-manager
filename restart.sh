#!/bin/bash

# Exit on error
set -e

# Function to check if directory exists
check_directory() {
    if [ ! -d "$1" ]; then
        echo "Error: Directory $1 not found"
        exit 1
    fi
}

# Function to handle errors
handle_error() {
    echo "Error occurred in script at line: ${BASH_LINENO[0]}"
    exit 1
}

# Function to safely stop PM2 process
stop_pm2_process() {
    local process_name=$1
    if pm2 list | grep -q "$process_name"; then
        echo "Stopping $process_name..."
        pm2 stop "$process_name"
        pm2 delete "$process_name"
    fi
}

# Set error handler
trap 'handle_error' ERR

echo "📦 Stopping Mockoon Manager processes..."
stop_pm2_process "fe-mockoon-manager"
stop_pm2_process "be-mockoon-manager"

# Store the root directory
ROOT_DIR=$(pwd)

# Backend deployment
echo "🔄 Deploying backend..."
check_directory "backend"
cd backend
echo "Installing backend dependencies..."
npm install
echo "Starting backend with PM2..."
npm start

# Return to root directory
cd "$ROOT_DIR"

# Frontend deployment
echo "🔄 Deploying frontend..."
check_directory "frontend"
cd frontend
echo "Installing frontend dependencies..."
npm install
echo "Installing serve globally..."
npm install -g serve
echo "Building frontend..."
npm run build
echo "Starting frontend with PM2..."
npm start

# Return to root directory
cd "$ROOT_DIR"

# Display running processes
echo "✨ Deployment complete! Running processes:"
pm2 list

# Save PM2 process list
echo "💾 Saving PM2 process list..."
pm2 save

echo "🚀 Application has been restarted successfully!"
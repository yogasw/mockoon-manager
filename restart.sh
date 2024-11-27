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

# Function to wait for PM2 to be ready
wait_for_pm2() {
    echo "Waiting for PM2 to be ready..."
    for i in {1..10}; do
        if pm2 list &>/dev/null; then
            return 0
        fi
        sleep 1
    done
    return 1
}

# Set error handler
trap 'handle_error' ERR

# Kill existing PM2 daemon and clear dump
echo "📦 Cleaning up existing PM2 processes..."
pm2 kill || true
sleep 2

# Start PM2 daemon
echo "📦 Starting PM2 daemon..."
pm2 ping > /dev/null 2>&1 || pm2 resurrect
wait_for_pm2

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

# Save PM2 configuration
echo "💾 Setting up PM2 startup..."
pm2 save

# Setup PM2 startup with systemd
if ! systemctl is-enabled pm2-root.service &>/dev/null; then
    env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root
    systemctl enable pm2-root
fi

# Ensure PM2 service is running
systemctl restart pm2-root

# Display running processes
echo "✨ Deployment complete! Running processes:"
pm2 list

echo "🚀 Application has been restarted successfully!"
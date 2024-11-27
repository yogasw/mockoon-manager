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
        pm2 stop "$process_name" 2>/dev/null || true
        pm2 delete "$process_name" 2>/dev/null || true
    else
        echo "Process $process_name not running"
    fi
}

# Set error handler
trap 'handle_error' ERR

# Ensure PM2 is running in daemon mode
echo "📦 Ensuring PM2 daemon is running..."
pm2 ping > /dev/null || pm2 daemon

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

# Save PM2 process list and ensure startup script
echo "💾 Saving PM2 process list and ensuring startup configuration..."
pm2 save

# Check if startup configuration exists, if not create it
if ! systemctl is-enabled pm2-root.service &>/dev/null; then
    echo "🔧 Configuring PM2 startup..."
    pm2 startup systemd -u root --hp /root
    # Apply the startup configuration
    sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root
fi

# Ensure PM2 service is running
echo "🔄 Ensuring PM2 service is running..."
systemctl is-active --quiet pm2-root || systemctl start pm2-root
systemctl enable pm2-root

# Save again to ensure everything is synchronized
pm2 save

echo "🚀 Application has been restarted successfully!"
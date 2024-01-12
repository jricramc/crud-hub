#!/bin/bash

# Default values
APP_NAME="GraphQL-PE-CORE-API"
REPO_URL="https://github.com/webhubhq/GraphQL-PE-CORE-API.git"
PORT=3000

# Parse command-line parameters
while [ "$#" -gt 0 ]; do
    case "$1" in
        -a|--app-name)
            APP_NAME="$2"
            shift 2
            ;;
        -r|--repo-url)
            REPO_URL="$2"
            shift 2
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Update the package manager
sudo apt update

# Install Git
sudo apt install -y git

# Install Node.js and npm
sudo apt install -y nodejs npm

# Install PM2 globally
sudo npm install -g pm2

# Install NGINX
sudo apt install -y nginx

# Start and enable NGINX
sudo systemctl start nginx
sudo systemctl enable nginx

# Create a directory for your app
sudo mkdir "/var/www/${APP_NAME}"
sudo chown -R ec2-user:ec2-user "/var/www/${APP_NAME}"

# Navigate to the app directory
cd "/var/www/${APP_NAME}"

# Clone your app repository
git clone "${REPO_URL}" .

# Add other commands using the variables, e.g., $PORT

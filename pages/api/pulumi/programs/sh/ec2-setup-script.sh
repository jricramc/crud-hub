#!/bin/bash

# Default values
APP_NAME="GraphQL-PE-CORE-API"
REPO_URL="https://github.com/webhubhq/GraphQL-PE-CORE-API.git"
PORT=3000

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

# Install app dependencies
npm install

# start the Apollo Server built in repo
npm run start

# Add other commands using the variables, e.g., $PORT

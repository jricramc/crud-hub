#!/bin/bash

exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
yum -y update
echo "Finish basic update and system log config"

# Default values
APP_NAME="GraphQL-PE-CORE-API"
REPO_URL="https://github.com/webhubhq/GraphQL-PE-CORE-API.git"

# Echo variable names
echo "APP_NAME: $APP_NAME"
echo "REPO_URL: $REPO_URL"

# Install Node.js 14.x (you can change the version if needed)
curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs

# Confirm Node.js and npm installation
node --version
npm --version


# Install Git
sudo yum install -y git

# Install PM2 globally
sudo npm install -g pm2

# Install NGINX
sudo yum install -y nginx

# Start NGINX
sudo systemctl start nginx

# Enable NGINX to start on boot
sudo systemctl enable nginx

# Add NGINX proxy pass
cd /etc/nginx/conf.d

# This line of code must have no identation to work    
read -d '\n' API_CONF << EndOfText
# Server configuration
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;

    # Add index.php to the list if you are using PHP
    index index.html index.htm index.nginx-debian.html;

    server_name _;

    location / {
        # First attempt to serve request as file, then
        # as directory, then fall back to displaying a 404.
        try_files $uri $uri/ =404;
        # proxy_pass http://localhost:8080;
        # proxy_http_version 1.1;
        # proxy_set_header Upgrade $http_upgrade;
        # proxy_set_header Connection 'upgrade';
        # proxy_set_header Host $host;
        # proxy_cache_bypass $http_upgrade;
    }

    location /api {
        rewrite ^\/api\/(.*)$ /api/$1 break;
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

}
EndOfText    

echo "$API_CONF"
echo "$API_CONF" >> api.conf

# Reload NGINX with changes
sudo systemctl reload nginx

echo "Reloaded NGINX with api.conf"

# Create a directory for your app
sudo mkdir -p "/var/www/$APP_NAME"
# sudo chown -R ec2-user:ec2-user "/var/www/$APP_NAME"

# Navigate to the app directory
cd "/var/www/$APP_NAME"

# Clone your app repository
git clone "$REPO_URL" .

# Install app dependencies
npm install

# start the Apollo Server built in repo
npm run start
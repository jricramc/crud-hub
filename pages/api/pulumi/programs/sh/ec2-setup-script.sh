#!/bin/bash

exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
yum -y update
echo "Finish basic update and system log config"

# Default Node Server Values
NODE_NAME="Node-Server-API"
NODE_REPO_URL="https://github.com/mbogo-mit/node-express-boilerplate.git"

# Echo variable names
echo "NODE_NAME: $NODE_NAME"
echo "NODE_REPO_URL: $NODE_REPO_URL"

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

# Overwrite or create api.conf
cat << 'EndOfText' > api.conf
# Server configuration
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;

    # Add index.php to the list if you are using PHP
    index index.html index.htm index.nginx-debian.html;

    server_name _;

    location / {
        rewrite ^\/(.*)$ /$1 break;
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

}
EndOfText



# Reload NGINX with changes
sudo systemctl reload nginx

echo "Reloaded NGINX with api.conf"


echo "Initializing $NODE_NAME"

# Create a directory for your Node Server App
sudo mkdir -p "/var/www/$NODE_NAME"
# sudo chown -R ec2-user:ec2-user "/var/www/$NODE_NAME"

# Navigate to the app directory
cd "/var/www/$NODE_NAME"

# Clone your app repository
git clone "$NODE_REPO_URL" .

# Install app dependencies
npm install

# start the Node Server built in repo
(npm run start)
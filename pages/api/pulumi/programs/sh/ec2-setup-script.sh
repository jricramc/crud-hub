#!/bin/bash

exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
yum -y update
echo "Finish basic update and system log config"

# Default Mintlify Values
MINTLIFY_NAME="Mintlify-API-Kit"
MINTLIFY_REPO_URL="https://github.com/mbogo-mit/mintlify-starter-kit.git"

# Echo variable names
echo "MINTLIFY_NAME: $MINTLIFY_NAME"
echo "MINTLIFY_REPO_URL: $MINTLIFY_REPO_URL"

# Default GraphQL API Values
GQL_NAME="GraphQL-PE-CORE-API"
GQL_REPO_URL="https://github.com/webhubhq/GraphQL-PE-CORE-API.git"

# Echo variable names
echo "GQL_NAME: $GQL_NAME"
echo "GQL_REPO_URL: $GQL_REPO_URL"

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
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /api/gql {
        rewrite ^\/api\/gql\/(.*)$ /api/gql/$1 break;
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /api/node {
        rewrite ^\/api\/node\/(.*)$ /api/node/$1 break;
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



echo "Initializing $GQL_NAME"

# Create a directory for your GQL App
sudo mkdir -p "/var/www/$GQL_NAME"
# sudo chown -R ec2-user:ec2-user "/var/www/$GQL_NAME"

# Navigate to the app directory
cd "/var/www/$GQL_NAME"

# Clone your app repository
git clone "$GQL_REPO_URL" .

# Install app dependencies
npm install

# start the Apollo Server built in repo
(npm run start)


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



echo "Initializing $MINTLIFY_NAME"

# Create a directory for your app
sudo mkdir -p "/var/www/$MINTLIFY_NAME"
# sudo chown -R ec2-user:ec2-user "/var/www/$MINTLIFY_NAME"

# Navigate to the app directory
cd "/var/www/$MINTLIFY_NAME"

# Clone your app repository
git clone "$MINTLIFY_REPO_URL" .

# Install app dependencies
npm install -g mintlify

mintlify install

# start the Mintlify App
(mintlify dev)

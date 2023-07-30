FROM node:14

# Install Pulumi CLI
RUN curl -fsSL https://get.pulumi.com | sh

# Install project dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

CMD ["npm", "start"]

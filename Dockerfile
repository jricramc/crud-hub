# Use the official lightweight Node.js 16 image.
FROM node:16.8.0

# Install Pulumi CLI
RUN curl -fsSL https://get.pulumi.com | sh


# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./


# Install dependencies
RUN npm install

# Copy local code to the container image.
COPY . ./

RUN npm run tsc

# Build the production version of the application
RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "start" ]

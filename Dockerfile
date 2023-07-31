# Use the official lightweight Node.js 16 image.
FROM node:18

# Install Pulumi CLI
RUN curl -fsSL https://get.pulumi.com | sh

# Add Pulumi's bin to PATH
ENV PATH="/root/.pulumi/bin:${PATH}"

# Set working directory
WORKDIR /usr/src/

# Copy package.json and package-lock.json
COPY package*.json ./

RUN printenv

# Install dependencies
RUN npm install

# Copy local code to the container image.
COPY . ./

RUN npm run tsc || cat /root/.npm/_logs/*-debug.log

# Build the production version of the application
RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "start" ]

# Use the official lightweight Node.js 16 image.
FROM node:18

ARG PULUMI_ACCESS_TOKEN
ENV PULUMI_ACCESS_TOKEN=${PULUMI_ACCESS_TOKEN}

RUN echo "Environment variables:" && \
    echo "--------------------" && \
    node -e "console.log(process.env);" && \
    echo "--------------------"
# Install Pulumi CLI
RUN curl -fsSL https://get.pulumi.com | sh

# Set working directory for Pulumi commands
ENV PATH="/root/.pulumi/bin:${PATH}"

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy local code to the container image.
COPY . .

# Build the app
RUN npm run build

# Run the web service on container startup.
CMD ["npm", "run", "start"]

# Use the official lightweight Node.js 16 image.
FROM node:18

ARG PULUMI_ACCESS_TOKEN
ENV PULUMI_ACCESS_TOKEN=${PULUMI_ACCESS_TOKEN}

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN sudo npm install --legacy-peer-deps

# Copy local code to the container image.
COPY . .

RUN npm run build

RUN echo "Environment variables:" && \
    echo "--------------------" && \
    node -e "console.log(process.env);" && \
    echo "--------------------"
# Install Pulumi CLI
RUN curl -fsSL https://get.pulumi.com | sh

# Set working directory for Pulumi commands
ENV PATH="/root/.pulumi/bin:${PATH}"

# Build the app


# Run the web service on container startup.
CMD ["npm", "run", "start"]

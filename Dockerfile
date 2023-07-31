# Use the official lightweight Node.js 16 image.
FROM node:18

# Install Pulumi CLI
RUN curl -fsSL https://get.pulumi.com | sh
# Set working directory for Pulumi commands
ENV PATH="/root/.pulumi/bin:${PATH}"

# WORKDIR /pulumi

# Copy Pulumi access token as a build-time argument
# ARG PULUMI_ACCESS_TOKEN
# ENV PULUMI_ACCESS_TOKEN=${PULUMI_ACCESS_TOKEN}


# Set working directory
WORKDIR /usr/src/app


# Log into Pulumi account using the build-time environment variable
# RUN pulumi login --cloud-url https://api.pulumi.com


# Copy package.json and package-lock.json
COPY package*.json ./

# RUN printenv

# Install dependencies
RUN npm install

# Copy local code to the container image.
COPY . .

# # Copy the Pulumi CLI and logged-in state from the pulumi-builder stage
# COPY --from=pulumi-builder /pulumi/.pulumi /root/.pulumi
# COPY --from=pulumi-builder /pulumi/.pulumi/bin/pulumi /usr/local/bin/pulumi

# RUN npm run tsc || cat /root/.npm/_logs/*-debug.log

# Build the production version of the application
# RUN npm run build

# Run the web service on container startup.
CMD ["npm", "run", "dev"]

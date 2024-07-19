# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install a simple web server to serve the built files
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 8008

# Set the command to run the application
CMD ["serve", "-s", "dist", "-l", "8008"]



# Use an official Node.js LTS image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package files first for better Docker caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port your app listens on
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]

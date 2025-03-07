# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /src

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port
EXPOSE 4000

# Start the server
CMD ["npm", "run", "dev"]

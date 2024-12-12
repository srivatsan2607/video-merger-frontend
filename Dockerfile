# Use official Node.js image as base image
FROM node:20.11.1-alpine3.19

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Serve the app using a static file server (like serve or http-server)
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

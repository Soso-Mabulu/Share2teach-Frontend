# Stage 1: Build the Vue.js application
FROM node:16-alpine AS build-stage

# Set working directory
WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Cache dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Build the application in production mode
RUN npm run build

# Stage 2: Serve the app using NGINX
FROM nginx:stable-alpine AS production-stage

# Copy the build output from the build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 8080  
# Change this from 80 to 8080

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]

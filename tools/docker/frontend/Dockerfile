# Use an official Node runtime as a parent image
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container at /app/frontend
COPY ./frontend/package*.json ./

# Install any needed dependencies
RUN npm install

# Copy the current directory contents into the container at /app/frontend
COPY ./frontend ./

# Build the Angular project
RUN npm run build

# Use an official Nginx runtime as a parent image
#FROM nginx:latest
#
## Copy the Angular build from the Node image to the Nginx image
#COPY --from=builder /app/dist/sage-page-graph /usr/share/nginx/html
#
## Copy the Nginx configuration file to the container
#COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the web server
EXPOSE 80

# Serve the Angular app with an HTTP server (or nginx, depending on your setup)
CMD ["npm", "start"]
#CMD ["nginx", "-g", "daemon off;"]
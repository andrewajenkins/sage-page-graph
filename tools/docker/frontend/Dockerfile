# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory inside the container
WORKDIR /app/frontend

# Copy the current directory contents into the container at /app/frontend
COPY ./frontend .

# Install any needed dependencies
RUN npm install

# Build the Angular project
RUN npm run build

# Expose port 80 for the web server
EXPOSE 80

# Serve the Angular app with an HTTP server (or nginx, depending on your setup)
CMD ["npm", "start"]

# Step 1: Build the Angular app
FROM node:18 AS builder
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend ./
RUN npm run build --production  # Production build

# Step 2: Serve the Angular app with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/sage-page-graph/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

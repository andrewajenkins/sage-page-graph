# **Installing Sage Page**

This guide explains how to set up and run Sage Page locally and on an AWS EC2 instance.

---

## **Local Installation**

### **Prerequisites**
- Docker and Docker Compose
- Node.js and npm
- Python (3.8+)
- WSL2 (for Windows users)

### **Steps**
1. **Start Docker Containers**  
   From a **WSL2 shell**:
   ```bash
   docker compose up --build
   ```

2. **Install and Run the Frontend**  
   From a **Windows shell**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Set Up Backend Path**  
   Add the backend path to your Python environment variables:
   ```bash
   export PYTHONPATH=E:\code\sage-page-graph\backend:$PYTHONPATH
   ```

4. **Build the Frontend for Production**  
   To generate the production-ready `dist` folder, run:
   ```bash
   npm run build --production
   ```

---

## **AWS EC2 Installation**

### **Prerequisites**
1. **Install Docker**  
   Follow the [official Docker installation guide](https://docs.docker.com/engine/install/).
   
2. **Install Docker Compose**  
   Install Docker Compose:
   ```bash
   sudo apt-get update
   sudo apt-get install docker-compose
   ```

3. **Install Node.js and npm**  
   Use NodeSource to install the latest Node.js and npm:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Clone and Install the Project**  
   Clone your repository and navigate to the project folder:
   ```bash
   git clone <repository-url>
   cd sage-page-graph
   ```

---

### **Steps**
1. **Build the Frontend**  
   Navigate to the `frontend` directory and build the production-ready frontend:
   ```bash
   cd frontend
   npm install
   npm run build --production
   ```

2. **Start Docker Containers**  
   From the project root directory:
   ```bash
   cd ..
   docker-compose up --build
   ```

3. **Set Up the Database**  
   Before creating users, make database migrations and apply them:
   ```bash
   docker exec -it backend-container python manage.py makemigrations
   docker exec -it backend-container python manage.py migrate
   ```

4. **Create a Superuser**  
   Create an admin user for Django:
   ```bash
   docker exec -it backend-container python manage.py createsuperuser
   ```

5. **Access the Server via SSH**  
   Use the provided key pair to access the EC2 instance:
   ```bash
   ssh -i "~/sage-page-graph-key-pair.pem" admin@<your-ec2-public-ip>
   ```

---

## **Useful Commands**

### **Docker**
- **Rebuild and Restart Containers**:
  ```bash
  docker compose up --build
  ```

- **Stop Containers**:
  ```bash
  docker compose down
  ```

### **Frontend**
- **Run Development Server**:
  ```bash
  npm start
  ```

- **Build for Production**:
  ```bash
  npm run build --production
  ```

### **Backend**
- **Apply Migrations**:
  ```bash
  docker exec -it backend-container python manage.py migrate
  ```

- **Create Superuser**:
  ```bash
  docker exec -it backend-container python manage.py createsuperuser
  ```

---

## **Notes**
- Ensure that all required environment variables are configured before running the app (e.g., `OPENAI_API_KEY` in backend/.env file).
- Replace `<repository-url>` and `<your-ec2-public-ip>` with the appropriate values for your deployment.
- For production deployment, configure HTTPS using Nginx and a valid SSL certificate.
- `ssh -i "~/sage-page-graph-key-pair.pem" admin@ec2-54-85-198-73.compute-1.amazonaws.com` is an example command for accessing the EC2 instance. Replace the key pair path and public IP with your own.
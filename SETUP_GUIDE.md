# Setup Guide

This guide will help you set up and run the Banking System Modernization project.

## Prerequisites

### Required Software

1. **Docker** (v20.10+)
   - [Install Docker](https://docs.docker.com/get-docker/)
   - Verify: `docker --version`

2. **Docker Compose** (v2.0+)
   - Usually comes with Docker Desktop
   - Verify: `docker-compose --version`

3. **Node.js** (v18+) - For local development
   - [Install Node.js](https://nodejs.org/)
   - Verify: `node --version`

4. **npm** (v9+)
   - Comes with Node.js
   - Verify: `npm --version`

5. **Git**
   - [Install Git](https://git-scm.com/)
   - Verify: `git --version`

### System Requirements

- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: At least 10GB free space
- **Operating System**: Linux, macOS, or Windows with WSL2

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Keerthan04/EDA_Project.git
cd EDA_Project
```

### 2. Start All Services with Docker Compose

```bash
docker-compose up --build
```

This command will:
- Build Docker images for all 7 services
- Start all containers
- Set up networking between services

**Note**: First build will take 5-10 minutes depending on your internet speed and system.

### 3. Access the Application

Once all services are running, you can access:

- **Frontend Dashboard**: http://localhost:3006
- **API Gateway**: http://localhost:3000
- **Customer Service**: http://localhost:3001
- **Payments Service**: http://localhost:3002
- **Partner Integration Service**: http://localhost:3003
- **Regulatory Reporting Service**: http://localhost:3004
- **Core Banking Adapter**: http://localhost:3005

### 4. Verify Services are Running

Check health endpoints for each service:

```bash
# API Gateway
curl http://localhost:3000/health

# Customer Service
curl http://localhost:3001/health

# Payments Service
curl http://localhost:3002/health

# Partner Integration Service
curl http://localhost:3003/health

# Regulatory Reporting Service
curl http://localhost:3004/health

# Core Banking Adapter
curl http://localhost:3005/health
```

Each should return a JSON response with status information.

## Local Development Setup

If you want to run services individually for development:

### 1. Install Dependencies for Each Service

```bash
# Example for Customer Service
cd customer-service
npm install
cd ..

# Repeat for other services
cd payments-service && npm install && cd ..
cd partner-integration-service && npm install && cd ..
cd regulatory-reporting-service && npm install && cd ..
cd core-banking-adapter && npm install && cd ..
cd api-gateway && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Set Up Environment Variables

Each service has a `.env.example` file. Copy it to `.env`:

```bash
# Example for Customer Service
cd customer-service
cp .env.example .env
cd ..
```

Edit the `.env` files as needed for your local setup.

### 3. Start Services Individually

Open separate terminal windows for each service:

```bash
# Terminal 1 - Customer Service
cd customer-service
npm start

# Terminal 2 - Payments Service
cd payments-service
npm start

# Terminal 3 - Partner Integration Service
cd partner-integration-service
npm start

# Terminal 4 - Regulatory Reporting Service
cd regulatory-reporting-service
npm start

# Terminal 5 - Core Banking Adapter
cd core-banking-adapter
npm start

# Terminal 6 - API Gateway
cd api-gateway
npm start

# Terminal 7 - Frontend
cd frontend
npm run dev
```

## Docker Commands

### Build Services

Build all services:
```bash
docker-compose build
```

Build specific service:
```bash
docker-compose build customer-service
```

### Start Services

Start all services:
```bash
docker-compose up
```

Start in detached mode (background):
```bash
docker-compose up -d
```

Start specific services:
```bash
docker-compose up customer-service payments-service
```

### Stop Services

Stop all services:
```bash
docker-compose down
```

Stop and remove volumes:
```bash
docker-compose down -v
```

### View Logs

View all logs:
```bash
docker-compose logs
```

View logs for specific service:
```bash
docker-compose logs customer-service
```

Follow logs in real-time:
```bash
docker-compose logs -f
```

### Scale Services

Scale a specific service:
```bash
docker-compose up --scale customer-service=3
```

### Restart Services

Restart all services:
```bash
docker-compose restart
```

Restart specific service:
```bash
docker-compose restart customer-service
```

## Troubleshooting

### Issue: Port Already in Use

**Error**: `Bind for 0.0.0.0:3001 failed: port is already allocated`

**Solution**:
1. Check which process is using the port:
   ```bash
   # On Linux/Mac
   lsof -i :3001
   
   # On Windows
   netstat -ano | findstr :3001
   ```

2. Stop the process or change the port in `docker-compose.yml`

### Issue: Docker Build Fails

**Error**: Various build errors

**Solutions**:
1. Clear Docker cache:
   ```bash
   docker system prune -a
   ```

2. Rebuild without cache:
   ```bash
   docker-compose build --no-cache
   ```

3. Check Docker daemon is running:
   ```bash
   docker info
   ```

### Issue: Services Can't Communicate

**Error**: Services return connection errors

**Solution**:
1. Check all services are on the same network:
   ```bash
   docker network ls
   docker network inspect eda_project_banking-network
   ```

2. Verify service names in `docker-compose.yml` match environment variables

### Issue: Frontend Can't Connect to API

**Error**: Network errors in browser console

**Solution**:
1. Check API Gateway is running:
   ```bash
   curl http://localhost:3000/health
   ```

2. Verify environment variable in frontend:
   ```bash
   # In frontend/.env
   NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:3000
   ```

3. Check browser console for CORS errors

### Issue: Container Keeps Restarting

**Error**: Container in restart loop

**Solutions**:
1. Check logs:
   ```bash
   docker-compose logs customer-service
   ```

2. Check for syntax errors in code

3. Verify all dependencies are installed

### Issue: Out of Memory

**Error**: Docker crashes or services are slow

**Solution**:
1. Increase Docker memory allocation:
   - Docker Desktop → Settings → Resources → Memory
   - Allocate at least 4GB (8GB recommended)

2. Stop unused containers:
   ```bash
   docker stop $(docker ps -a -q)
   ```

## Testing the API

### Using curl

```bash
# Get all customers
curl http://localhost:3000/api/customers/customers

# Get specific customer
curl http://localhost:3000/api/customers/customers/1

# Create new customer
curl -X POST http://localhost:3000/api/customers/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"New Customer","email":"new@example.com"}'

# Process payment
curl -X POST http://localhost:3000/api/payments/payments \
  -H "Content-Type: application/json" \
  -d '{"amount":500,"currency":"USD","fromAccount":"ACC001","toAccount":"ACC002"}'
```

### Using Postman

1. Import the API endpoints
2. Set base URL to `http://localhost:3000`
3. Test each endpoint

## Development Workflow

1. **Make Code Changes**
   - Edit service code in respective directories

2. **Test Locally**
   ```bash
   cd <service-name>
   npm start
   ```

3. **Build Docker Image**
   ```bash
   docker-compose build <service-name>
   ```

4. **Test with Docker**
   ```bash
   docker-compose up <service-name>
   ```

5. **Run All Services**
   ```bash
   docker-compose up
   ```

## Production Deployment Considerations

1. **Environment Variables**
   - Use production values
   - Never commit `.env` files
   - Use secrets management

2. **Database**
   - Set up proper database services
   - Configure persistent volumes
   - Set up backups

3. **Monitoring**
   - Add logging service
   - Set up health checks
   - Configure alerts

4. **Security**
   - Enable HTTPS
   - Add authentication
   - Configure firewall rules
   - Use API keys

5. **Scaling**
   - Use Kubernetes for orchestration
   - Set up load balancers
   - Configure auto-scaling

## Getting Help

- Check the [Architecture Documentation](./ARCHITECTURE.md)
- Review service-specific README files
- Check Docker logs for errors
- Open an issue on GitHub

## Next Steps

1. Explore the [Architecture Documentation](./ARCHITECTURE.md)
2. Review individual service README files
3. Test API endpoints
4. Customize for your use case
5. Add your own features

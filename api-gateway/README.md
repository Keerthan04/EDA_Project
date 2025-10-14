# API Gateway Service

The API Gateway acts as a single entry point for all client requests and routes them to the appropriate microservices.

## Features
- Request routing to all backend microservices
- CORS support
- Health check endpoint
- Service discovery and load balancing

## Endpoints
- `GET /health` - Health check
- `/api/customers/*` - Routes to Customer Service
- `/api/payments/*` - Routes to Payments Service
- `/api/partners/*` - Routes to Partner Integration Service
- `/api/regulatory/*` - Routes to Regulatory Reporting Service
- `/api/core-banking/*` - Routes to Core Banking Adapter

## Running Locally
```bash
npm install
npm start
```

## Environment Variables
See `.env.example` for required environment variables.

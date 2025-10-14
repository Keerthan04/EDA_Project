# Banking System Modernization - EDA Project

A microservices-based banking system modernization architecture designed to replace legacy systems with a scalable, event-driven architecture.

## 🏗️ Architecture Overview

This project implements a microservices architecture with the following components:

### Services

1. **API Gateway** (Port 3000)
   - Central entry point for all client requests
   - Routes requests to appropriate microservices
   - Handles authentication and rate limiting

2. **Customer Service** (Port 3001)
   - Customer management and profile handling
   - Account creation and updates
   - KYC information management

3. **Payments Service** (Port 3002)
   - Payment processing and transactions
   - Multi-currency support
   - Transaction history and status tracking

4. **Partner Integration Service** (Port 3003)
   - Third-party partner integrations
   - Payment gateway connections
   - Credit bureau services integration

5. **Regulatory Reporting Service** (Port 3004)
   - Compliance monitoring and reporting
   - AML/KYC report generation
   - Regulatory submission handling

6. **Core Banking Adapter** (Port 3005)
   - Legacy system integration bridge
   - Account balance inquiries
   - Transaction processing with core banking

7. **Frontend UI** (Port 3006)
   - Next.js-based web application
   - Service status dashboard
   - Modern user interface

8. **Customer Frontend** (Port 3007)
   - Customer-facing portal
   - Payment initiation interface
   - Transaction history view
   - Account management from customer perspective

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- Git

### Running with Docker Compose

1. Clone the repository:
```bash
git clone https://github.com/Keerthan04/EDA_Project.git
cd EDA_Project
```

2. Build and start all services:
```bash
docker-compose up --build
```

3. Access the application:
   - Frontend Dashboard: http://localhost:3006
   - Customer Frontend: http://localhost:3007
   - API Gateway: http://localhost:3000
   - Individual services: Ports 3001-3005

### Stopping Services

```bash
docker-compose down
```

## 🛠️ Development

### Running Services Locally

Each service can be run independently for development:

```bash
# Example: Running Customer Service
cd customer-service
npm install
npm start
```

### Environment Variables

Each service has a `.env.example` file. Copy it to `.env` and configure as needed:

```bash
cp .env.example .env
```

## 📁 Project Structure

```
EDA_Project/
├── api-gateway/                    # API Gateway service
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── customer-service/               # Customer management service
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── payments-service/               # Payment processing service
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── partner-integration-service/    # Partner integration service
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── regulatory-reporting-service/   # Regulatory compliance service
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── core-banking-adapter/          # Core banking adapter service
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── frontend/                       # Next.js frontend application (Dashboard)
│   ├── app/
│   ├── Dockerfile
│   ├── package.json
│   └── next.config.ts
├── customer_frontend/              # Next.js customer portal
│   ├── app/
│   ├── Dockerfile
│   ├── package.json
│   └── next.config.ts
├── docker-compose.yml             # Docker Compose configuration
└── README.md                      # This file
```

## 🔌 API Endpoints

### API Gateway Routes

- `GET /health` - Gateway health check
- `/api/customers/*` - Customer Service routes
- `/api/payments/*` - Payments Service routes
- `/api/partners/*` - Partner Integration routes
- `/api/regulatory/*` - Regulatory Reporting routes
- `/api/core-banking/*` - Core Banking Adapter routes

Refer to individual service README files for detailed endpoint documentation.

## 🧪 Testing

```bash
# Run tests for a specific service
cd <service-name>
npm test
```

## 🐳 Docker

### Building Individual Services

```bash
docker build -t banking-<service-name> ./<service-name>
```

### Running Individual Containers

```bash
docker run -p 3001:3001 banking-customer-service
```

## 🔄 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Containerization**: Docker, Docker Compose
- **Architecture Pattern**: Microservices, API Gateway
- **Communication**: REST APIs

## 📊 Monitoring & Health Checks

Each service exposes a `/health` endpoint for monitoring:

```bash
# Check API Gateway health
curl http://localhost:3000/health

# Check Customer Service health
curl http://localhost:3001/health
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is part of an educational architecture demonstration.

## 👥 Authors

Banking System Modernization Team

## 🔗 Related Documentation

- [API Gateway Documentation](./api-gateway/README.md)
- [Customer Service Documentation](./customer-service/README.md)
- [Payments Service Documentation](./payments-service/README.md)
- [Partner Integration Documentation](./partner-integration-service/README.md)
- [Regulatory Reporting Documentation](./regulatory-reporting-service/README.md)
- [Core Banking Adapter Documentation](./core-banking-adapter/README.md)
- [Customer Frontend Documentation](./customer_frontend/README.md)

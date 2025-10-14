# Architecture Documentation

## System Architecture

This banking system modernization project follows a microservices architecture pattern with the following key principles:

### Design Principles

1. **Separation of Concerns**: Each service handles a specific business domain
2. **Independent Deployment**: Services can be deployed independently
3. **Technology Agnostic**: Each service can use different technologies if needed
4. **Scalability**: Services can be scaled independently based on load
5. **Resilience**: Failure in one service doesn't bring down the entire system

## Service Architecture

### API Gateway Pattern

The API Gateway serves as the single entry point for all client requests:

```
Client (Frontend) → API Gateway → Microservices
```

**Benefits:**
- Single point of entry
- Centralized authentication and authorization
- Request routing and load balancing
- API composition and aggregation
- Protocol translation

### Microservices

#### 1. Customer Service (Port 3001)
**Responsibility:** Customer relationship management

**Key Features:**
- Customer profile CRUD operations
- Account number generation
- Customer data validation

**Data Model:**
```
Customer {
  id: number
  name: string
  email: string
  accountNumber: string
}
```

#### 2. Payments Service (Port 3002)
**Responsibility:** Payment processing and transaction management

**Key Features:**
- Payment initiation and processing
- Transaction status tracking
- Multi-currency support
- Payment validation

**Data Model:**
```
Payment {
  id: number
  transactionId: string
  amount: number
  currency: string
  status: string
  fromAccount: string
  toAccount: string
  timestamp: string
}
```

#### 3. Partner Integration Service (Port 3003)
**Responsibility:** External partner and third-party integrations

**Key Features:**
- Partner management
- Integration request handling
- API gateway for external services
- Status monitoring

**Data Model:**
```
Partner {
  id: number
  name: string
  type: string
  status: string
  apiEndpoint: string
}

Integration {
  id: number
  partnerId: number
  transactionId: string
  type: string
  status: string
  timestamp: string
}
```

#### 4. Regulatory Reporting Service (Port 3004)
**Responsibility:** Compliance and regulatory reporting

**Key Features:**
- Report generation (AML, KYC, etc.)
- Compliance checks
- Regulatory submission handling
- Audit trail maintenance

**Data Model:**
```
Report {
  id: number
  reportId: string
  type: string
  title: string
  status: string
  period: string
  submittedDate: string
}

ComplianceCheck {
  id: number
  checkId: string
  type: string
  status: string
  timestamp: string
}
```

#### 5. Core Banking Adapter (Port 3005)
**Responsibility:** Legacy system integration bridge

**Key Features:**
- Account management
- Transaction processing
- Balance inquiries
- Legacy system protocol handling
- Data transformation and mapping

**Data Model:**
```
Account {
  id: number
  accountNumber: string
  customerId: number
  balance: number
  currency: string
  accountType: string
  status: string
}

Transaction {
  id: number
  transactionId: string
  accountNumber: string
  type: string (debit/credit)
  amount: number
  balance: number
  timestamp: string
}
```

#### 6. Frontend UI (Port 3006)
**Responsibility:** User interface and experience

**Technology:** Next.js 15 with React 19 and TypeScript

**Key Features:**
- Service status dashboard
- Real-time service health monitoring
- Responsive design
- Modern UI components

## Communication Patterns

### Synchronous Communication
Currently, all services use REST APIs for synchronous communication:

```
Frontend → API Gateway → Service
```

### Future Enhancements

1. **Asynchronous Communication**
   - Message queues (RabbitMQ, Kafka)
   - Event-driven architecture
   - Publish-subscribe patterns

2. **Service Mesh**
   - Istio or Linkerd
   - Service-to-service communication
   - Traffic management
   - Observability

3. **Database per Service**
   - Each service owns its data
   - MongoDB for document storage
   - PostgreSQL for relational data

## Deployment Architecture

### Docker Containerization

Each service is containerized using Docker:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE <PORT>
CMD ["npm", "start"]
```

### Docker Compose Orchestration

All services are orchestrated using Docker Compose:

```
docker-compose up --build
```

**Network Architecture:**
- All services are on a custom bridge network (`banking-network`)
- Services can communicate using service names as hostnames
- Exposed ports for external access

## Security Considerations

### Current State
- CORS enabled on all services
- Service-to-service communication within Docker network

### Future Enhancements
1. **Authentication & Authorization**
   - JWT tokens
   - OAuth 2.0
   - API keys

2. **Encryption**
   - HTTPS/TLS
   - Data encryption at rest
   - Secrets management (Vault)

3. **API Rate Limiting**
   - Request throttling
   - DDoS protection

## Monitoring & Observability

### Future Enhancements

1. **Logging**
   - Centralized logging (ELK Stack)
   - Structured logging
   - Log aggregation

2. **Metrics**
   - Prometheus
   - Grafana dashboards
   - Custom metrics

3. **Tracing**
   - Distributed tracing (Jaeger)
   - Request correlation
   - Performance monitoring

4. **Health Checks**
   - Liveness probes
   - Readiness probes
   - Dependency health monitoring

## Scalability

Each service can be scaled independently:

```bash
docker-compose up --scale customer-service=3
```

### Load Balancing
- API Gateway handles load balancing
- Round-robin distribution
- Health-based routing

## Resilience Patterns

### Future Implementation

1. **Circuit Breaker**
   - Prevent cascading failures
   - Fast failure detection

2. **Retry Pattern**
   - Automatic retry with exponential backoff
   - Idempotency keys

3. **Timeout Pattern**
   - Service call timeouts
   - Graceful degradation

4. **Bulkhead Pattern**
   - Resource isolation
   - Failure containment

## Development Workflow

1. **Local Development**
   - Run services individually with `npm start`
   - Use `.env` files for configuration

2. **Docker Development**
   - Build individual services
   - Test with Docker Compose

3. **CI/CD Pipeline**
   - Automated testing
   - Docker image building
   - Deployment automation

## Testing Strategy

### Unit Tests
- Individual service logic
- Isolated component testing

### Integration Tests
- Service-to-service communication
- API endpoint testing

### End-to-End Tests
- Complete user workflows
- System-wide testing

## Migration Strategy

### Legacy System Integration

The Core Banking Adapter serves as the bridge:

1. **Phase 1**: Parallel run with legacy system
2. **Phase 2**: Gradual traffic migration
3. **Phase 3**: Legacy system decommissioning

### Data Migration
- ETL processes
- Data validation
- Rollback procedures

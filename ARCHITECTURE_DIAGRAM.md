# Architecture Diagram

## System Overview

```
┌───────────────────────────────────┬─────────────────────────────────────┐
│        Client Browser             │         Client Browser              │
│   http://localhost:3006           │     http://localhost:3007           │
│   (Admin Dashboard)               │     (Customer Portal)               │
└─────────────┬─────────────────────┴───────────────┬─────────────────────┘
              │                                     │
              ▼                                     ▼
┌──────────────────────────────────┐  ┌────────────────────────────────────┐
│   Frontend (Next.js)             │  │  Customer Frontend (Next.js)       │
│      Port: 3006                  │  │       Port: 3007                   │
│  ┌────────────────────────────┐  │  │  ┌──────────────────────────────┐ │
│  │ • Service Dashboard        │  │  │  │ • Customer View              │ │
│  │ • Health Monitoring        │  │  │  │ • Payment Initiation         │ │
│  │ • Responsive UI            │  │  │  │ • Transaction History        │ │
│  └────────────────────────────┘  │  │  │ • Account Management         │ │
└─────────────┬────────────────────┘  │  └──────────────────────────────┘ │
              │                       └─────────────┬──────────────────────┘
              │                                     │
              └──────────────┬──────────────────────┘
                             │ HTTP/REST
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API Gateway                                  │
│                          Port: 3000                                  │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  • Request Routing                                          │    │
│  │  • Load Balancing                                           │    │
│  │  • Authentication & Authorization (Future)                  │    │
│  │  • Rate Limiting (Future)                                   │    │
│  └────────────────────────────────────────────────────────────┘    │
└────┬─────────┬─────────┬─────────┬─────────┬────────────────────────┘
     │         │         │         │         │
     │         │         │         │         │
     ▼         ▼         ▼         ▼         ▼
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│Customer │Payments │Partner  │Regulatory│Core    │
│Service  │Service  │Integr.  │Reporting │Banking │
│         │         │Service  │Service   │Adapter │
└─────────┴─────────┴─────────┴─────────┴─────────┘
```

## Detailed Service Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Microservices Layer                           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────┐       ┌─────────────────────┐              │
│  │  Customer Service   │       │  Payments Service   │              │
│  │     Port: 3001      │       │     Port: 3002      │              │
│  ├─────────────────────┤       ├─────────────────────┤              │
│  │ • Customer CRUD     │       │ • Payment Process   │              │
│  │ • Profile Mgmt      │       │ • Transaction Track │              │
│  │ • Account Numbers   │       │ • Multi-currency    │              │
│  │ • KYC Data          │       │ • Status Monitoring │              │
│  └─────────────────────┘       └─────────────────────┘              │
│                                                                        │
│  ┌─────────────────────┐       ┌─────────────────────┐              │
│  │ Partner Integration │       │ Regulatory Reporting│              │
│  │     Port: 3003      │       │     Port: 3004      │              │
│  ├─────────────────────┤       ├─────────────────────┤              │
│  │ • Partner Mgmt      │       │ • AML Reports       │              │
│  │ • API Integrations  │       │ • KYC Reports       │              │
│  │ • Payment Gateways  │       │ • Compliance Checks │              │
│  │ • Credit Bureaus    │       │ • Audit Trails      │              │
│  └─────────────────────┘       └─────────────────────┘              │
│                                                                        │
│  ┌─────────────────────┐                                             │
│  │ Core Banking Adapter│                                             │
│  │     Port: 3005      │                                             │
│  ├─────────────────────┤                                             │
│  │ • Legacy Bridge     │                                             │
│  │ • Account Mgmt      │                                             │
│  │ • Balance Inquiry   │                                             │
│  │ • Transaction Process│                                            │
│  │ • Data Transform    │                                             │
│  └─────────────────────┘                                             │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## Communication Flow

### Request Flow Example: Get Customer Data

```
1. User accesses Frontend
   ↓
2. Frontend → API Gateway
   GET http://api-gateway:3000/api/customers/customers/1
   ↓
3. API Gateway → Customer Service
   GET http://customer-service:3001/customers/1
   ↓
4. Customer Service processes request
   ↓
5. Customer Service → API Gateway
   { success: true, data: {...} }
   ↓
6. API Gateway → Frontend
   Response with customer data
   ↓
7. Frontend displays data to user
```

### Request Flow Example: Process Payment

```
1. User initiates payment on Frontend
   ↓
2. Frontend → API Gateway
   POST http://api-gateway:3000/api/payments/payments
   ↓
3. API Gateway → Payments Service
   POST http://payments-service:3002/payments
   ↓
4. Payments Service → Core Banking Adapter
   POST http://core-banking-adapter:3005/transactions
   ↓
5. Core Banking Adapter processes transaction
   ↓
6. Core Banking Adapter → Payments Service
   { success: true, transaction: {...} }
   ↓
7. Payments Service → API Gateway
   { success: true, payment: {...} }
   ↓
8. API Gateway → Frontend
   Response with payment confirmation
   ↓
9. Frontend displays success message
```

## Docker Network Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    Docker Bridge Network                        │
│                   (banking-network)                             │
│                                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │Frontend │  │Customer │  │   API   │  │Customer │          │
│  │Dashboard│  │Frontend │  │Gateway  │  │Service  │          │
│  │ :3006   │  │ :3007   │  │  :3000  │  │  :3001  │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
│                                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │Payments │  │Partner  │  │Regulatory│  │  Core   │          │
│  │Service  │  │Integr.  │  │Reporting │  │ Banking │          │
│  │  :3002  │  │  :3003  │  │  :3004  │  │Adapter  │          │
│  │         │  │         │  │         │  │  :3005  │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
         │              │              │              │
         │              │              │              │
    Exposed Ports: 3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007
         │              │              │              │
         ▼              ▼              ▼              ▼
    ┌────────────────────────────────────────────────────┐
    │              Host Machine                          │
    │         (localhost / 127.0.0.1)                    │
    └────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────┐
│                 Technology Layers                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Presentation Layer                                  │
│  ┌────────────────────────────────────────────┐    │
│  │  Next.js 15 | React 19 | TypeScript       │    │
│  │  Tailwind CSS | Responsive Design          │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  API Gateway Layer                                   │
│  ┌────────────────────────────────────────────┐    │
│  │  Node.js | Express.js                      │    │
│  │  http-proxy-middleware | CORS              │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  Business Logic Layer (Microservices)                │
│  ┌────────────────────────────────────────────┐    │
│  │  Node.js | Express.js                      │    │
│  │  RESTful APIs | JSON                       │    │
│  │  Async/Await | Error Handling              │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  Infrastructure Layer                                │
│  ┌────────────────────────────────────────────┐    │
│  │  Docker | Docker Compose                   │    │
│  │  Container Orchestration                   │    │
│  │  Bridge Networking                         │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Deployment Model

```
Development Environment:
┌──────────────────────────────────────────────────────────┐
│  Developer Machine                                        │
│  ┌────────────────────────────────────────────────┐     │
│  │  docker-compose up --build                     │     │
│  │  ├── Build all images                          │     │
│  │  ├── Create containers                         │     │
│  │  ├── Setup networking                          │     │
│  │  └── Start services                            │     │
│  └────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘

Production Environment (Future):
┌──────────────────────────────────────────────────────────┐
│  Kubernetes Cluster                                       │
│  ┌────────────────────────────────────────────────┐     │
│  │  Pods (Replicated Services)                    │     │
│  │  ├── Load Balancers                            │     │
│  │  ├── Auto-scaling                              │     │
│  │  ├── Health Checks                             │     │
│  │  ├── Service Discovery                         │     │
│  │  └── Rolling Updates                           │     │
│  └────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘
```

## Port Mapping

| Service                     | Internal Port | External Port | URL                                |
|-----------------------------|---------------|---------------|------------------------------------|
| Frontend Dashboard          | 3006          | 3006          | http://localhost:3006              |
| Customer Frontend           | 3007          | 3007          | http://localhost:3007              |
| API Gateway                 | 3000          | 3000          | http://localhost:3000              |
| Customer Service            | 3001          | 3001          | http://localhost:3001              |
| Payments Service            | 3002          | 3002          | http://localhost:3002              |
| Partner Integration Service | 3003          | 3003          | http://localhost:3003              |
| Regulatory Reporting Service| 3004          | 3004          | http://localhost:3004              |
| Core Banking Adapter        | 3005          | 3005          | http://localhost:3005              |

## API Routes

| Route                    | Target Service          | Description                    |
|--------------------------|-------------------------|--------------------------------|
| `/health`                | API Gateway             | Gateway health check           |
| `/api/customers/*`       | Customer Service        | Customer operations            |
| `/api/payments/*`        | Payments Service        | Payment operations             |
| `/api/partners/*`        | Partner Integration     | Partner operations             |
| `/api/regulatory/*`      | Regulatory Reporting    | Compliance operations          |
| `/api/core-banking/*`    | Core Banking Adapter    | Core banking operations        |

## Security Architecture (Future Enhancement)

```
┌──────────────────────────────────────────────────────┐
│              Security Layers                          │
├──────────────────────────────────────────────────────┤
│                                                       │
│  1. API Gateway                                       │
│     ├── JWT Authentication                           │
│     ├── API Key Validation                           │
│     ├── Rate Limiting                                │
│     └── Request Validation                           │
│                                                       │
│  2. Service Level                                     │
│     ├── Service-to-Service Auth                      │
│     ├── Input Validation                             │
│     ├── Error Handling                               │
│     └── Audit Logging                                │
│                                                       │
│  3. Network Level                                     │
│     ├── Docker Network Isolation                     │
│     ├── TLS/SSL Encryption                           │
│     ├── Firewall Rules                               │
│     └── DDoS Protection                              │
│                                                       │
│  4. Data Level                                        │
│     ├── Encryption at Rest                           │
│     ├── Encryption in Transit                        │
│     ├── Secrets Management                           │
│     └── Data Masking                                 │
│                                                       │
└──────────────────────────────────────────────────────┘
```

## Scalability Model

```
Horizontal Scaling:
┌─────────────────────────────────────────────────────┐
│  Load Balancer                                       │
└────┬────────────┬────────────┬────────────┬─────────┘
     │            │            │            │
     ▼            ▼            ▼            ▼
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│Customer │  │Customer │  │Customer │  │Customer │
│Service  │  │Service  │  │Service  │  │Service  │
│Instance1│  │Instance2│  │Instance3│  │Instance4│
└─────────┘  └─────────┘  └─────────┘  └─────────┘
```

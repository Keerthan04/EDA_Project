# Regulatory Reporting Service

Handles regulatory compliance reporting and monitoring for the banking system.

## Features
- Regulatory report generation
- Compliance monitoring
- AML/KYC reporting
- Transaction monitoring

## Endpoints
- `GET /health` - Health check
- `GET /reports` - Get all reports
- `GET /reports/:id` - Get report by ID
- `POST /reports` - Generate new report
- `GET /compliance-checks` - Get all compliance checks
- `POST /compliance-checks` - Run compliance check

## Running Locally
```bash
npm install
npm start
```

## Environment Variables
See `.env.example` for required environment variables.

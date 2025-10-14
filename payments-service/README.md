# Payments Service

Handles payment processing and transaction management in the banking system.

## Features
- Payment processing
- Transaction tracking
- Payment status monitoring
- Multi-currency support

## Endpoints
- `GET /health` - Health check
- `GET /payments` - Get all payments
- `GET /payments/:id` - Get payment by ID
- `POST /payments` - Process new payment
- `GET /payments/:id/status` - Get payment status

## Running Locally
```bash
npm install
npm start
```

## Environment Variables
See `.env.example` for required environment variables.

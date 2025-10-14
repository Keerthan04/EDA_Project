# Core Banking Adapter Service

Adapter service that bridges modern microservices with legacy core banking systems.

## Features
- Account management
- Transaction processing
- Balance inquiries
- Legacy system integration
- Data transformation and mapping

## Endpoints
- `GET /health` - Health check
- `GET /accounts` - Get all accounts
- `GET /accounts/:accountNumber` - Get account details
- `GET /accounts/:accountNumber/balance` - Get account balance
- `GET /accounts/:accountNumber/transactions` - Get account transactions
- `POST /transactions` - Process transaction (debit/credit)

## Running Locally
```bash
npm install
npm start
```

## Environment Variables
See `.env.example` for required environment variables.

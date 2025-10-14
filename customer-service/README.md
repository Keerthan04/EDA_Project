# Customer Service

Manages customer information and accounts in the banking system.

## Features
- Customer CRUD operations
- Account number generation
- Customer profile management

## Endpoints
- `GET /health` - Health check
- `GET /customers` - Get all customers
- `GET /customers/:id` - Get customer by ID
- `POST /customers` - Create new customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

## Running Locally
```bash
npm install
npm start
```

## Environment Variables
See `.env.example` for required environment variables.

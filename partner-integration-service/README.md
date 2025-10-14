# Partner Integration Service

Manages integrations with external partners and third-party services.

## Features
- Partner management
- Integration request handling
- API gateway for external partners
- Status tracking for integrations

## Endpoints
- `GET /health` - Health check
- `GET /partners` - Get all partners
- `GET /partners/:id` - Get partner by ID
- `GET /integrations` - Get all integrations
- `POST /integrations` - Create new integration
- `GET /integrations/:id/status` - Get integration status

## Running Locally
```bash
npm install
npm start
```

## Environment Variables
See `.env.example` for required environment variables.

# Customer Frontend

A Next.js-based customer portal for interacting with the banking system microservices from a customer perspective.

## Features

- **Customer Dashboard**: View customer information and account details
- **Account Balance**: Display real-time account balance and status
- **Payment Initiation**: Process payments through various channels (UPI, NEFT, RTGS, IMPS)
- **Transaction History**: View detailed transaction history with filtering
- **Microservices Integration**: Seamlessly integrates with all backend microservices

## Pages

### 1. Home (`/`)
- Select a customer from the list
- View customer information
- See account balance and status
- Quick access to payment and transaction features

### 2. Payments (`/payments`)
- Initiate new payments
- Support for multiple payment types (UPI, NEFT, RTGS, IMPS)
- Real-time payment processing
- Transaction confirmation and status

### 3. Transactions (`/transactions`)
- View complete transaction history
- Transaction summary (total, debits, credits)
- Detailed transaction information with timestamps

## Technology Stack

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Port**: 3007

## Microservices Integration

This frontend interacts with the following microservices through the API Gateway:

- **Customer Service**: Fetches customer information
- **Payments Service**: Processes payment transactions
- **Core Banking Adapter**: Retrieves account balances and transaction history
- **Partner Integration**: External payment network processing

## Running Locally

### Prerequisites
- Node.js 18+
- API Gateway running on port 3000

### Development Mode
```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3007`

### Production Build
```bash
npm install
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:3000
```

## Docker

### Build
```bash
docker build -t customer-frontend .
```

### Run
```bash
docker run -p 3007:3007 -e NEXT_PUBLIC_API_GATEWAY_URL=http://api-gateway:3000 customer-frontend
```

## API Endpoints Used

- `GET /api/customers/customers` - Fetch all customers
- `GET /api/core-banking/accounts` - Fetch all accounts
- `GET /api/core-banking/accounts/:accountNumber` - Get specific account details
- `GET /api/core-banking/accounts/:accountNumber/transactions` - Get transaction history
- `POST /api/payments/payments` - Initiate payment

## User Flow

1. **Select Customer**: Choose a customer from the list on the home page
2. **View Details**: See customer information, account balance, and status
3. **Initiate Payment**: Click on "Initiate Payment" to process a transaction
4. **View History**: Click on "View Transactions" to see transaction history

## Payment Processing Flow

1. User fills payment form with amount, from/to accounts, and payment type
2. Request goes through API Gateway to Payments Service
3. Payments Service orchestrates with Core Banking Adapter
4. Funds are verified and held
5. External payment network processes the transfer
6. Transaction is finalized and logged
7. User receives confirmation with transaction details

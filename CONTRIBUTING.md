# Contributing Guide

Thank you for your interest in contributing to the Banking System Modernization project! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Maintain a professional environment

## How to Contribute

### 1. Fork the Repository

Click the "Fork" button on GitHub to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/EDA_Project.git
cd EDA_Project
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates

### 4. Make Your Changes

Follow the coding standards outlined below.

### 5. Test Your Changes

```bash
# Test individual service
cd <service-name>
npm install
npm start

# Test with Docker
docker-compose build <service-name>
docker-compose up <service-name>

# Test all services
docker-compose up --build
```

### 6. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 7. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 8. Create a Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template
5. Submit the PR

## Development Guidelines

### Code Style

#### JavaScript/TypeScript

- Use ES6+ syntax
- Use `const` and `let`, avoid `var`
- Use arrow functions where appropriate
- Use async/await instead of callbacks
- Add comments for complex logic
- Keep functions small and focused

Example:
```javascript
// Good
const getCustomerById = async (id) => {
  try {
    const customer = await Customer.findById(id);
    return { success: true, data: customer };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Bad
var getCustomerById = function(id, callback) {
  Customer.findById(id, function(err, customer) {
    if (err) {
      callback(err);
    } else {
      callback(null, customer);
    }
  });
};
```

#### Naming Conventions

- **Variables/Functions**: camelCase
  ```javascript
  const userName = 'John';
  const fetchUserData = () => {};
  ```

- **Classes/Components**: PascalCase
  ```javascript
  class CustomerService {}
  const UserProfile = () => {};
  ```

- **Constants**: UPPER_SNAKE_CASE
  ```javascript
  const API_BASE_URL = 'http://localhost:3000';
  const MAX_RETRY_ATTEMPTS = 3;
  ```

- **Files**: kebab-case
  ```
  customer-service.js
  api-routes.ts
  ```

### API Design

#### RESTful Endpoints

Follow REST conventions:

```
GET    /resources       - List all resources
GET    /resources/:id   - Get single resource
POST   /resources       - Create new resource
PUT    /resources/:id   - Update entire resource
PATCH  /resources/:id   - Partial update
DELETE /resources/:id   - Delete resource
```

#### Response Format

Always return consistent response format:

```javascript
// Success
{
  "success": true,
  "data": {...}
}

// Error
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error"
}
```

#### HTTP Status Codes

- `200` - OK (successful GET, PUT, PATCH, DELETE)
- `201` - Created (successful POST)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (server errors)

### Docker Best Practices

1. **Use Alpine Images**
   ```dockerfile
   FROM node:18-alpine
   ```

2. **Minimize Layers**
   ```dockerfile
   RUN npm install --production && \
       npm cache clean --force
   ```

3. **Don't Run as Root**
   ```dockerfile
   USER node
   ```

4. **Use .dockerignore**
   ```
   node_modules
   .git
   .env
   ```

### Environment Variables

- Never commit `.env` files
- Always provide `.env.example` files
- Document all environment variables
- Use meaningful names

### Error Handling

Always handle errors gracefully:

```javascript
app.get('/endpoint', async (req, res) => {
  try {
    const data = await someAsyncOperation();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error in endpoint:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});
```

### Logging

Use consistent logging:

```javascript
// Startup
console.log('Customer Service running on port 3001');

// Errors
console.error('Database connection failed:', error);

// Debug (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

## Adding a New Service

To add a new microservice:

### 1. Create Service Directory

```bash
mkdir my-new-service
cd my-new-service
```

### 2. Initialize Package

```bash
npm init -y
```

### 3. Install Dependencies

```bash
npm install express cors dotenv
npm install --save-dev nodemon
```

### 4. Create Basic Structure

```
my-new-service/
├── src/
│   └── server.js
├── Dockerfile
├── .env.example
├── package.json
└── README.md
```

### 5. Add to Docker Compose

Edit `docker-compose.yml`:

```yaml
my-new-service:
  build:
    context: ./my-new-service
    dockerfile: Dockerfile
  container_name: banking-my-new-service
  ports:
    - "3007:3007"
  environment:
    - PORT=3007
  networks:
    - banking-network
```

### 6. Update API Gateway

Add routes in `api-gateway/src/server.js`:

```javascript
app.use('/api/my-service', createProxyMiddleware({
  target: 'http://my-new-service:3007',
  changeOrigin: true,
  pathRewrite: { '^/api/my-service': '' }
}));
```

### 7. Document the Service

Create a comprehensive README in the service directory.

## Testing

### Unit Tests

Add unit tests for business logic:

```javascript
// customer-service/tests/customer.test.js
const { validateCustomer } = require('../src/validators');

describe('Customer Validation', () => {
  test('should validate correct customer data', () => {
    const customer = {
      name: 'John Doe',
      email: 'john@example.com'
    };
    expect(validateCustomer(customer)).toBe(true);
  });
});
```

### Integration Tests

Test API endpoints:

```javascript
// customer-service/tests/api.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Customer API', () => {
  test('GET /customers should return all customers', async () => {
    const response = await request(app).get('/customers');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

## Documentation

### Update README

When adding features, update:
- Main README.md
- Service-specific READMEs
- ARCHITECTURE.md if architecture changes
- SETUP_GUIDE.md if setup changes

### Code Comments

Add comments for:
- Complex algorithms
- Business logic
- Non-obvious code
- API endpoints

```javascript
/**
 * Processes a payment transaction
 * @param {Object} payment - Payment details
 * @param {number} payment.amount - Amount to transfer
 * @param {string} payment.fromAccount - Source account
 * @param {string} payment.toAccount - Destination account
 * @returns {Promise<Object>} Transaction result
 */
const processPayment = async (payment) => {
  // Implementation
};
```

## Pull Request Guidelines

### PR Title Format

```
feat(customer-service): add email validation
fix(api-gateway): resolve routing issue
docs: update setup guide
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Docker builds successfully
```

## Review Process

1. Automated checks must pass
2. Code review by maintainers
3. Address review comments
4. Approval by at least one maintainer
5. Merge to main branch

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Join our community chat

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in commit history

Thank you for contributing! 🎉

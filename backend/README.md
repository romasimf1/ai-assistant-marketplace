# AI Assistant Marketplace Backend

Backend API for the AI Assistant Marketplace platform - connecting Philadelphia users with AI-powered voice assistants.

## 🚀 Features

- **RESTful API** with OpenAPI 3.0 documentation
- **JWT Authentication** with refresh tokens
- **PostgreSQL Database** with Prisma ORM
- **TypeScript** for type safety
- **Comprehensive Testing** with Vitest
- **Security First** with rate limiting, CORS, and input validation
- **Philadelphia Focus** with local business integration

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma
- **Authentication:** JWT with bcrypt
- **Validation:** Joi
- **Testing:** Vitest
- **Security:** Helmet, CORS, Express Rate Limit

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL 15 or higher
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/ai-assistant-marketplace.git
   cd ai-assistant-marketplace/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env-example.txt .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Push schema to database
   npm run prisma:push

   # (Optional) Open Prisma Studio
   npm run prisma:studio
   ```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret for JWT access tokens | Required |
| `JWT_REFRESH_SECRET` | Secret for JWT refresh tokens | Required |
| `JWT_EXPIRES_IN` | Access token expiration | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |

### External Services

| Variable | Description | Required |
|----------|-------------|----------|
| `ELEVENLABS_API_KEY` | ElevenLabs API key | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |

## 🚦 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Health Check
```bash
curl http://localhost:3001/health
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui

# Run specific test file
npm test authService.test.ts
```

## 📚 API Documentation

The API documentation is available at:
- **Local:** `http://localhost:3001/api/docs`
- **File:** `docs/api.md`

### Key Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/assistants` - List assistants
- `POST /api/v1/orders` - Create order
- `GET /api/v1/users/profile` - Get user profile

## 🗄️ Database Management

### Prisma Commands

```bash
# Generate client after schema changes
npm run prisma:generate

# Push schema changes to database
npm run prisma:push

# Create and apply migrations
npm run prisma:migrate

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npm run prisma:studio
```

### Database Schema

The database schema includes:
- **Users** - User accounts and profiles
- **Assistants** - AI assistant configurations
- **Orders** - Service orders and transactions
- **Reviews** - User feedback and ratings

## 🔒 Security

### Implemented Security Measures

- **Password Hashing** with bcrypt (12 rounds)
- **JWT Tokens** with short expiration times
- **Rate Limiting** (100 requests per 15 minutes)
- **Input Validation** with Joi schemas
- **CORS** configuration
- **Helmet** security headers
- **SQL Injection Prevention** via Prisma ORM

### Authentication Flow

1. User registers/logs in
2. Server returns access and refresh tokens
3. Client includes access token in Authorization header
4. Server validates token on protected routes
5. Client uses refresh token to get new access token when expired

## 📊 Monitoring & Logging

- **Health Checks** at `/health` endpoint
- **Error Logging** with stack traces in development
- **Database Connection Monitoring**
- **Request/Response Logging** via Morgan (can be added)

## 🚀 Deployment

### Environment Setup

1. **Set NODE_ENV=production**
2. **Configure production database**
3. **Set secure JWT secrets**
4. **Configure external service API keys**
5. **Set up SSL certificates**

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Railway/Render Deployment

1. Connect GitHub repository
2. Set environment variables
3. Configure build command: `npm run build`
4. Set start command: `npm start`

## 🧪 Testing Strategy

### Test Coverage

- **Unit Tests** for services and utilities
- **Integration Tests** for API endpoints
- **Database Tests** with test database
- **Authentication Tests** for security
- **Validation Tests** for input handling

### Test Structure

```
tests/
├── setup.ts              # Test configuration
├── services/            # Service unit tests
├── routes/              # API integration tests
├── middleware/          # Middleware tests
└── utils/               # Utility function tests
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Ensure PostgreSQL is running
   - Verify database exists

2. **JWT Token Invalid**
   - Check JWT_SECRET is set
   - Verify token format in Authorization header
   - Check token expiration

3. **Prisma Client Error**
   - Run `npm run prisma:generate`
   - Check database schema matches Prisma schema

4. **Port Already in Use**
   - Change PORT in environment variables
   - Kill process using the port

### Debug Mode

Set `DEBUG=*` environment variable for detailed logging:

```bash
DEBUG=* npm run dev
```

## 📈 Performance Optimization

### Database Optimization

- **Indexes** on frequently queried fields
- **Connection Pooling** via Prisma
- **Query Optimization** with select/include
- **Caching** strategies (Redis planned)

### API Optimization

- **Rate Limiting** prevents abuse
- **Input Validation** reduces processing
- **Pagination** for large datasets
- **Compression** middleware (can be added)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'feat: add new feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Create a Pull Request

### Commit Convention

Follow [Conventional Commits](https://conventionalcommits.org/):

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation
- `style:` code style changes
- `refactor:` code refactoring
- `test:` testing
- `chore:` maintenance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Email:** backend-support@ai-assistant-marketplace.com

## 🗺️ Roadmap

- [ ] AI service integrations (ElevenLabs, OpenAI)
- [ ] Payment processing (Stripe)
- [ ] Real-time notifications (WebSockets)
- [ ] Advanced analytics and reporting
- [ ] Multi-region deployment
- [ ] GraphQL API alongside REST

---

**Philadelphia, PA** 🔔

Built with ❤️ for the Philadelphia community

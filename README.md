<<<<<<< HEAD
# Physics School - Full-Stack Learning Platform

A comprehensive physics learning platform built with React, TypeScript, Fastify, and MongoDB. Features adaptive placement testing, personalized recommendations, and subscription-based access to physics lessons from grade 6 to EESH preparation.

## 🏗️ Architecture

This is a monorepo containing:
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Fastify + TypeScript + MongoDB
- **Shared**: Zod schemas and TypeScript types

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- pnpm (recommended) or npm

### 1. Clone and Install
```bash
git clone <repository-url>
cd physics-school-monorepo
pnpm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Common
NODE_ENV=development
PORT=4000
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:4000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/physics_school

# Auth (generate strong secrets)
JWT_ACCESS_SECRET=your_strong_access_secret_here
JWT_REFRESH_SECRET=your_strong_refresh_secret_here
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=30d

# Payments
PAYMENT_PROVIDER=mock  # Use 'qpay' for production
```

### 3. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in .env)
```

### 4. Seed Data
```bash
# Seed lessons and questions
pnpm backend seed:lessons
pnpm backend seed:questions

# Create admin user
pnpm backend seed:admin admin@physics-school.com admin123
```

### 5. Start Development Servers
```bash
# Start both frontend and backend
pnpm dev

# Or start individually
pnpm --filter backend dev    # Backend on :4000
pnpm --filter frontend dev   # Frontend on :5173
```

## 📱 Features

### Student Features
- **Registration Flow**: Multi-step registration with placement test
- **Adaptive Placement Test**: Determines student's physics level
- **Personalized Recommendations**: AI-driven lesson suggestions
- **Progress Tracking**: Monitor learning progress and level improvements
- **Subscription Management**: Premium access to all content
- **Retest Scheduling**: Periodic level assessments

### Admin Features
- **Content Management**: Create and manage lessons, questions, tests
- **Analytics Dashboard**: View student progress and platform statistics
- **User Management**: Monitor user activity and subscription status

### Technical Features
- **Type-Safe API**: Full TypeScript with Zod validation
- **JWT Authentication**: Secure token-based auth with refresh tokens
- **Payment Integration**: QPay integration with mock provider for development
- **Responsive Design**: Mobile-first UI with dark mode support
- **Real-time Updates**: Live payment status and progress tracking

## 🔧 Development

### Project Structure
```
/
├── frontend/           # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/      # New pages (Register, Dashboard, etc.)
│   │   ├── stores/     # Zustand state management
│   │   ├── api/        # API client
│   │   └── ...
├── backend/            # Fastify + TypeScript backend
│   ├── src/
│   │   ├── modules/    # Feature modules (auth, payments, etc.)
│   │   ├── db/         # Mongoose models
│   │   ├── config/     # Environment configuration
│   │   └── ...
├── shared/             # Shared types and schemas
│   └── src/types/      # Zod schemas
└── package.json        # Workspace configuration
```

### Available Scripts
```bash
# Development
pnpm dev                    # Start both servers
pnpm --filter backend dev   # Backend only
pnpm --filter frontend dev  # Frontend only

# Building
pnpm build                  # Build all packages
pnpm --filter backend build # Backend only
pnpm --filter frontend build # Frontend only

# Testing
pnpm test                   # Run all tests
pnpm --filter backend test  # Backend tests
pnpm --filter frontend test # Frontend tests

# Linting
pnpm lint                   # Lint all packages

# Database
pnpm backend seed:lessons   # Seed lesson data
pnpm backend seed:questions # Seed question data
pnpm backend seed:admin     # Create admin user
```

## 🔌 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register-init`
Initialize registration process.
```json
{
  "name": "John Doe",
  "phone": "+976-9999-9999",
  "email": "john@example.com",
  "grade": "10",
  "goals": ["Improve physics grades", "Prepare for EESH"],
  "password": "securepassword123"
}
```

#### POST `/api/auth/complete-registration`
Complete registration after placement test.
```json
{
  "placementSessionId": "placement_1234567890_abc123",
  "placementResults": { /* test results */ }
}
```

#### POST `/api/auth/login`
Login with email/phone and password.
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Test Endpoints

#### GET `/api/tests/placement?grade=10`
Get placement test for specific grade.

#### POST `/api/tests/attempt`
Submit test answers.
```json
{
  "testId": "test_id",
  "placementSessionId": "session_id",
  "answers": [
    {
      "questionId": "q1",
      "answer": "A"
    }
  ]
}
```

### Lesson Endpoints

#### GET `/api/lessons`
Get lessons with optional filters.
```
GET /api/lessons?grade=10&topics=kinematics&difficulty=3&page=1&limit=10
```

#### GET `/api/lessons/:id`
Get specific lesson details.

### Payment Endpoints

#### POST `/api/payments/session`
Create payment session.
```json
{
  "amount": 50000,
  "currency": "MNT",
  "planId": "monthly_premium"
}
```

#### GET `/api/payments/status/:sessionId`
Check payment status.

### Admin Endpoints

#### POST `/api/admin/lessons`
Create new lesson (admin only).

#### POST `/api/admin/questions`
Create new question (admin only).

#### GET `/api/admin/stats/overview`
Get platform statistics (admin only).

## 💳 Payment Integration

### Switching from Mock to QPay

1. **Update Environment Variables**:
```env
PAYMENT_PROVIDER=qpay
QPAY_MERCHANT_ID=your_merchant_id
QPAY_API_KEY=your_api_key
QPAY_API_BASE=https://api.qpay.mn
PAYMENT_WEBHOOK_SECRET=your_webhook_secret
```

2. **Implement QPay Provider**:
The `QPayPaymentProvider` class in `backend/src/modules/payments/qpay.ts` contains TODOs for:
- Creating invoices via QPay API
- Generating QR codes or payment URLs
- Webhook signature verification
- Payment status checking

3. **Configure Webhooks**:
Set up webhook endpoint at `/api/webhooks/payments` in your QPay merchant dashboard.

### Mock Payment Provider
For development, the mock provider:
- Simulates payment completion after 3 seconds
- Always returns "paid" status
- Useful for testing the complete flow

## 🎯 Placement Test Logic

### Level Calculation
Levels are calculated based on score percentage and grade:

**Grade 6-8**: L1 (<40%), L2 (40-69%), L3 (≥70%)
**Grade 9-10**: L1 (<35%), L2 (35-64%), L3 (65-84%), L4 (≥85%)
**Grade 11-12**: L1 (<30%), L2 (30-54%), L3 (55-74%), L4 (75-89%), L5 (≥90%)
**EESH**: L1 (<30%), L2 (30-59%), L3 (60-79%), L4 (≥80%)

### Question Distribution
- 40% Easy (difficulty 1-2)
- 40% Medium (difficulty 3)
- 20% Hard (difficulty 4-5)

### Recommendation Algorithm
1. Identify weak topics from placement test
2. Find lessons matching user's grade and weak topics
3. Filter by appropriate difficulty level (±1 from current level)
4. Return top N recommendations (configurable via `RECOMMENDATION_COUNT`)

## 🔐 Security Features

- **Password Hashing**: Argon2id with secure parameters
- **JWT Tokens**: Access tokens (15min) + refresh tokens (30 days)
- **Rate Limiting**: 100 requests per minute
- **CORS Protection**: Restricted to client URL
- **Input Validation**: Zod schemas for all inputs
- **Cookie Security**: HttpOnly, Secure, SameSite cookies

## 🧪 Testing

### Backend Tests
```bash
pnpm --filter backend test
```

Tests cover:
- Authentication flow
- Placement test scoring
- Recommendation generation
- Payment webhook processing

### Frontend Tests
```bash
pnpm --filter frontend test
```

Tests cover:
- Component rendering
- User interactions
- API integration
- State management

## 🚀 Deployment

### Backend Deployment
1. Build the backend:
```bash
pnpm --filter backend build
```

2. Set production environment variables
3. Deploy to your preferred platform (Railway, Render, etc.)

### Frontend Deployment
1. Build the frontend:
```bash
pnpm --filter frontend build
```

2. Deploy `dist/` folder to Vercel, Netlify, or similar

### Database
- Use MongoDB Atlas for production
- Set up proper indexes for performance
- Configure backup and monitoring

## 🔧 Configuration

### Environment Variables
All configuration is done via environment variables. See `.env.example` for complete list.

### Feature Flags
- `ENABLE_SUBSCRIPTIONS`: Enable/disable subscription features
- `RETEST_INTERVAL_DAYS`: Days between retest eligibility
- `RETEST_AFTER_N_LESSONS`: Lessons completed before retest eligibility
- `RECOMMENDATION_COUNT`: Number of lessons to recommend

### Admin User Creation
```bash
pnpm backend seed:admin admin@yourdomain.com yourpassword
```

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:4000/api/healthz
```

### Logging
- Structured logging with Pino
- Request/response logging
- Error tracking
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Error**:
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity

**Authentication Issues**:
- Check JWT secrets are set
- Verify cookie settings
- Clear browser cookies

**Payment Issues**:
- Verify payment provider configuration
- Check webhook endpoint accessibility
- Review payment logs

**Build Errors**:
- Run `pnpm install` to ensure dependencies are installed
- Check TypeScript configuration
- Verify all imports are correct

### Getting Help
- Check the logs for detailed error messages
- Review the API documentation
- Test with mock payment provider first
- Ensure all environment variables are set correctly
=======
# fuckme
>>>>>>> 3bf5fcfee5b667c5aa347bfc5931e019c8a8336e

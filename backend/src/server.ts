import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { connectDatabase } from './db/connection.js';
import { env } from './config/env.js';

// Import route modules
import authRoutes from './modules/auth/routes.js';
import testRoutes from './modules/tests/routes.js';
import lessonRoutes from './modules/lessons/routes.js';
import paymentRoutes from './modules/payments/routes.js';
import recommendationRoutes from './modules/recommendations/routes.js';
import adminRoutes from './modules/admin/routes.js';
import webhookRoutes from './modules/webhooks/routes.js';

const fastify = Fastify({
  logger: {
    level: env.NODE_ENV === 'development' ? 'info' : 'warn',
    transport: env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    } : undefined
  }
});

// Register plugins
await fastify.register(cors, {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5176',
    'http://localhost:3000',
    env.CLIENT_URL
  ],
  credentials: true
});

await fastify.register(cookie, {
  secret: env.JWT_ACCESS_SECRET
});

await fastify.register(helmet);

await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// Health check
fastify.get('/api/healthz', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register routes
await fastify.register(authRoutes, { prefix: '/api/auth' });
await fastify.register(testRoutes, { prefix: '/api/tests' });
await fastify.register(lessonRoutes, { prefix: '/api/lessons' });
await fastify.register(paymentRoutes, { prefix: '/api/payments' });
await fastify.register(recommendationRoutes, { prefix: '/api/recommendations' });
await fastify.register(adminRoutes, { prefix: '/api/admin' });
await fastify.register(webhookRoutes, { prefix: '/api/webhooks' });

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  if (error.validation) {
    reply.status(400).send({
      error: 'Validation Error',
      details: error.validation
    });
    return;
  }
  
  reply.status(500).send({
    error: 'Internal Server Error',
    message: env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
const start = async () => {
  try {
    await connectDatabase();
    await fastify.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`Server listening on http://localhost:${env.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

import { FastifyInstance } from 'fastify';
import { Payment, Subscription, User } from '../../db/models/index.js';
import { getPaymentProvider } from './index.js';
import { verifyAccessToken } from '../../utils/auth.js';

export default async function paymentRoutes(fastify: FastifyInstance) {
  // Create payment session
  fastify.post('/session', {
    schema: {
      body: {
        type: 'object',
        properties: {
          amount: { type: 'number', minimum: 0.01 },
          currency: { type: 'string', default: 'MNT' },
          planId: { type: 'string' }
        },
        required: ['amount']
      }
    }
  }, async (request, reply) => {
    const token = request.cookies.accessToken;
    if (!token) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }
    
    const payload = verifyAccessToken(token);
    if (!payload) {
      return reply.status(401).send({
        error: 'Invalid token',
        message: 'Authentication token is invalid'
      });
    }
    
    const { amount, currency, planId } = request.body as any;
    
    // Create payment record
    const payment = new Payment({
      userId: payload.userId,
      provider: 'mock', // Will be determined by environment
      status: 'pending',
      amount,
      currency,
      sessionId: '', // Will be set by provider
      createdAt: new Date()
    });
    
    // Get payment provider and create session
    const provider = getPaymentProvider();
    const sessionResult = await provider.createSession({
      userId: payload.userId,
      amount,
      currency,
      planId
    });
    
    // Update payment with session ID
    payment.sessionId = sessionResult.sessionId;
    await payment.save();
    
    return {
      sessionId: sessionResult.sessionId,
      payUrl: sessionResult.payUrl,
      qrPayload: sessionResult.qrPayload,
      amount,
      currency
    };
  });
  
  // Check payment status
  fastify.get('/status/:sessionId', async (request, reply) => {
    const { sessionId } = request.params as any;
    
    const payment = await Payment.findOne({ sessionId });
    if (!payment) {
      return reply.status(404).send({
        error: 'Payment not found',
        message: 'Payment session not found'
      });
    }
    
    // Check with provider for latest status
    const provider = getPaymentProvider();
    const latestStatus = await provider.fetchStatus(sessionId);
    
    // Update payment status if changed
    if (latestStatus !== payment.status) {
      payment.status = latestStatus;
      await payment.save();
      
      // If payment is now paid, activate subscription
      if (latestStatus === 'paid') {
        await Subscription.findOneAndUpdate(
          { userId: payment.userId },
          {
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          },
          { upsert: true }
        );
        
        // Update user subscription status
        await User.findByIdAndUpdate(payment.userId, {
          subscriptionStatus: 'active'
        });
      }
    }
    
    return {
      sessionId: payment.sessionId,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      createdAt: payment.createdAt
    };
  });
}

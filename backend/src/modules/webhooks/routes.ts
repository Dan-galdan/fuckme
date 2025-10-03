import { FastifyInstance } from 'fastify';
import { Payment, Subscription, User } from '../../db/models/index.js';
import { getPaymentProvider } from '../payments/index.js';

export default async function webhookRoutes(fastify: FastifyInstance) {
  // Payment webhook
  fastify.post('/payments', async (request, reply) => {
    const rawBody = JSON.stringify(request.body);
    const headers = request.headers as Record<string, string>;
    
    // Get payment provider and verify webhook
    const provider = getPaymentProvider();
    const verification = provider.verifyWebhook(rawBody, headers);
    
    if (!verification.ok) {
      return reply.status(400).send({
        error: 'Webhook verification failed',
        message: 'Invalid webhook signature'
      });
    }
    
    // Find payment by external reference
    const payment = await Payment.findOne({ 
      externalRef: verification.externalRef 
    });
    
    if (!payment) {
      return reply.status(404).send({
        error: 'Payment not found',
        message: 'Payment with external reference not found'
      });
    }
    
    // Update payment status
    payment.status = 'paid';
    await payment.save();
    
    // Activate subscription
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
    
    return { status: 'success' };
  });
}

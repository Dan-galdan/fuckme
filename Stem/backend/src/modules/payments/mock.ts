import { PaymentProvider } from './provider.js';

export class MockPaymentProvider implements PaymentProvider {
  async createSession(input: { 
    userId: string; 
    amount: number; 
    currency: string; 
    planId?: string; 
  }) {
    const sessionId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate payment completion after 3 seconds
    setTimeout(async () => {
      try {
        const { Payment } = await import('../../db/models/index.js');
        await Payment.findOneAndUpdate(
          { sessionId },
          { status: 'paid' }
        );
      } catch (error) {
        console.error('Mock payment completion error:', error);
      }
    }, 3000);
    
    return {
      sessionId,
      payUrl: `http://localhost:4000/mock-payment/${sessionId}`,
      qrPayload: {
        qr: `MOCK_PAYMENT_${sessionId}`,
        amount: input.amount,
        currency: input.currency
      }
    };
  }
  
  verifyWebhook(rawBody: string, headers: Record<string, string>) {
    // Mock webhook verification - always succeeds
    return { ok: true, externalRef: 'mock_ref_' + Date.now() };
  }
  
  async fetchStatus(sessionId: string): Promise<"pending" | "paid" | "failed"> {
    // Check if 3 seconds have passed since session creation
    const timestamp = parseInt(sessionId.split('_')[1]);
    const elapsed = Date.now() - timestamp;
    
    if (elapsed > 3000) {
      return 'paid';
    }
    
    return 'pending';
  }
}

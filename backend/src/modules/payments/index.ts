import { PaymentProvider } from './provider.js';
import { MockPaymentProvider } from './mock.js';
import { QPayPaymentProvider } from './qpay.js';
import { env } from '../../config/env.js';

export function getPaymentProvider(): PaymentProvider {
  const provider = env.PAYMENT_PROVIDER;
  
  if (provider === 'qpay') {
    return new QPayPaymentProvider();
  }
  
  return new MockPaymentProvider();
}

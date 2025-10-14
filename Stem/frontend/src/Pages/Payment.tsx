import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuthStore } from '../stores/auth';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSession, setPaymentSession] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<'pending' | 'paid' | 'failed'>('pending');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleCreateSession = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await apiClient.createPaymentSession({
        amount: 50000, // 50,000 MNT
        currency: 'MNT',
        planId: 'monthly_premium'
      }) as any;
      
      setPaymentSession(response);
      
      // If there's a payment URL, redirect to it
      if (response.payUrl && response.payUrl.includes('qpay')) {
        window.location.href = response.payUrl;
      } else {
        // For mock payments, start polling
        startStatusPolling(response.sessionId);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create payment session');
    } finally {
      setIsLoading(false);
    }
  };

  const startStatusPolling = (sessionId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await apiClient.getPaymentStatus(sessionId) as any;
        setStatus(statusResponse.status);
        
        if (statusResponse.status === 'paid') {
          clearInterval(pollInterval);
          // Refresh user data or redirect to dashboard
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else if (statusResponse.status === 'failed') {
          clearInterval(pollInterval);
          setError('Payment failed. Please try again.');
        }
      } catch (error) {
        console.error('Status polling error:', error);
      }
    }, 2000);

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
    }, 300000);
  };

  const handleMockPayment = () => {
    if (paymentSession?.sessionId) {
      startStatusPolling(paymentSession.sessionId);
    }
  };

  if (status === 'paid') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your subscription has been activated.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Upgrade Your Subscription
          </h1>

          {/* Pricing Card */}
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Premium Monthly Plan
            </h3>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4">
              ₮50,000
              <span className="text-lg font-normal text-blue-700 dark:text-blue-300">/month</span>
            </div>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Access to all lessons
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Personalized recommendations
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Progress tracking
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Practice tests
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Priority support
              </li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {!paymentSession ? (
            <div className="text-center">
              <button
                onClick={handleCreateSession}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Payment Session...' : 'Subscribe Now'}
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Secure payment processing powered by QPay
              </p>
            </div>
          ) : (
            <div className="text-center">
              {paymentSession.qrPayload ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Scan QR Code to Pay
                  </h3>
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 mb-4">
                    <div className="text-6xl font-mono text-center">
                      {paymentSession.qrPayload.qr}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Amount: ₮{paymentSession.amount.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Scan this QR code with your mobile banking app to complete the payment.
                  </p>
                  <button
                    onClick={handleMockPayment}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 mr-2"
                  >
                    Simulate Payment (Dev)
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Redirecting to Payment...
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You will be redirected to the payment page shortly.
                  </p>
                </div>
              )}
              
              <div className="mt-6">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {status === 'pending' && paymentSession && (
            <div className="mt-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Waiting for payment confirmation...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuthStore } from '../stores/auth';

interface Question {
  id: string;
  stem: string;
  kind: 'mcq' | 'numeric' | 'short_text';
  options?: Array<{ id: string; text: string }>;
  difficulty: number;
  topics: string[];
}

interface PlacementTest {
  id: string;
  title: string;
  description?: string;
  timeLimitSec?: number;
  questions: Question[];
}

const PlacementTestPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, isAuthenticated } = useAuthStore();
  const [test, setTest] = useState<PlacementTest | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [isRetest, setIsRetest] = useState(false);

  useEffect(() => {
    loadPlacementTest();
  }, []);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  const loadPlacementTest = async () => {
    try {
      // Check if user is logged in OR has a placement session
      const placementSessionId = localStorage.getItem('placementSessionId');
      
      if (!isAuthenticated && !placementSessionId) {
        setError('Please log in or register to take the placement test.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      // Set retest flag if user is logged in but has no placement session
      setIsRetest(isAuthenticated && !placementSessionId);

      const testData = await apiClient.getPlacementTest() as PlacementTest;
      setTest(testData);
      if (testData.timeLimitSec) {
        setTimeLeft(testData.timeLimitSec);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load placement test');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (test && currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!test) return;

    setIsSubmitting(true);
    try {
      const placementSessionId = localStorage.getItem('placementSessionId');
      
      const answerArray = Object.entries(answers)
        .filter(([_, answer]) => answer !== null && answer !== undefined && answer !== '')
        .map(([questionId, answer]) => ({
          questionId,
          answer: typeof answer === 'string' && !isNaN(Number(answer)) ? Number(answer) : answer
        }));

      const response = await apiClient.submitTestAttempt({
        testId: test.id,
        placementSessionId, // This will be undefined for logged-in users
        answers: answerArray
      });

      if (placementSessionId) {
        // New user registration flow
        const registrationResponse = await apiClient.completeRegistration({
          placementSessionId,
          placementResults: response
        }) as any;

        // Set user in store
        setUser(registrationResponse.user);
        
        // Clean up
        localStorage.removeItem('placementSessionId');
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else if (isAuthenticated && (response as any).user) {
        // Existing user retest flow
        setUser((response as any).user);
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to submit test');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading placement test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Go to Registration
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!test) return null;

  const question = test.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isRetest ? 'Retest - ' : ''}{test.title}
              </h1>
              {test.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {test.description}
                </p>
              )}
            </div>
            {timeLeft !== null && (
              <div className="text-right">
                <div className="text-2xl font-mono text-blue-600 dark:text-blue-400">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-xs text-gray-500">Time remaining</div>
              </div>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Question {currentQuestion + 1} of {test.questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Question {currentQuestion + 1}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {question.stem}
            </p>
          </div>

          {/* Answer options */}
          <div className="space-y-3">
            {question.kind === 'mcq' && question.options ? (
              question.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">
                    {option.text}
                  </span>
                </label>
              ))
            ) : question.kind === 'numeric' ? (
              <input
                type="number"
                step="any"
                value={answers[question.id] || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = parseFloat(value);
                  handleAnswerChange(question.id, value === '' ? null : isNaN(numericValue) ? value : numericValue);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your answer"
              />
            ) : (
              <input
                type="text"
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your answer"
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-2">
              {currentQuestion === test.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Test'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementTestPage;

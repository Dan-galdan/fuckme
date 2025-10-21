import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuthStore } from '../stores/auth';

interface TestAttempt {
  attemptId: string;
  testId: string;
  testTitle: string;
  score: number;
  levelEstimate: string;
  completedAt: string;
  totalQuestions?: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const [retestSchedule, setRetestSchedule] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [testHistory, setTestHistory] = useState<TestAttempt[]>([]);

  // Show test results if user just completed a test
  const [showTestResults, setShowTestResults] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if user just completed a test
    if (state?.testCompleted) {
      setShowTestResults(true);
      setTestResults({
        score: state.testScore,
        level: state.levelEstimate,
        weakTopics: state.weakTopics,
        message: state.message,
        correctAnswers: state.correctAnswers,
        totalQuestions: state.totalQuestions
      });
      // Clear the state so it doesn't show again
      window.history.replaceState({}, document.title);
    }

    loadDashboardData();
  }, [isAuthenticated, navigate, state]);

  const loadDashboardData = async () => {
    try {
      console.log('🔍 Dashboard: Loading data...');
      const scheduleData = await apiClient.getRetestSchedule();
      console.log('📊 Dashboard: Received retest schedule:', scheduleData);
      setRetestSchedule(scheduleData);

      try {
        const historyData = await apiClient.getTestHistory();
        console.log('📊 Dashboard: Received test history:', historyData);
        const attempts = (historyData as any)?.attempts || [];
        setTestHistory(attempts);
      } catch (historyError: any) {
        console.warn('⚠️ Dashboard: Could not load test history (auth required):', historyError.message);
        setTestHistory([]);
      }

    } catch (error: any) {
      console.error('❌ Dashboard: Error loading critical data:', error);
      if (!error.message.includes('test-history') && !error.message.includes('auth')) {
        setError(error.message || 'Failed to load dashboard data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetestClick = () => {
    navigate('/placement');
  };

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getGradeText = (score: number) => {
    if (score >= 90) return 'А (Маш сайн)';
    if (score >= 80) return 'Б (Сайн)';
    if (score >= 70) return 'В (Дунд)';
    if (score >= 60) return 'Г (Хангалттай)';
    return 'Д (Хангалтгүй)';
  };

  // Calculate correct answers for latest test
  const getLatestTestStats = () => {
    if (testHistory.length > 0) {
      const latestTest = testHistory[0];
      return {
        correct: Math.round((latestTest.score / 100) * (latestTest.totalQuestions || 10)),
        total: latestTest.totalQuestions || 10
      };
    }

    // If we have test results from current test, use that
    if (testResults) {
      return {
        correct: testResults.correctAnswers || 0,
        total: testResults.totalQuestions || 10
      };
    }

    return { correct: 0, total: 0 };
  };

  const latestTestStats = getLatestTestStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Хянах самбар ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  if (error && !showTestResults) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Дахин оролдох
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Test Results Banner */}
      {showTestResults && testResults && (
        <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-green-500 text-xl">🎉</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-green-700 dark:text-green-300 font-medium text-lg">
                {testResults.message || 'Тест амжилттай дууслаа!'}
              </p>
              <div className="flex gap-6 mt-2 text-green-600 dark:text-green-400 text-sm">
                <span>Үнэлгээ: <strong>{testResults.score}%</strong></span>
                <span>Түвшин: <strong>{testResults.level}</strong></span>
                <span>Зөв хариулт: <strong>
                  {testResults.correctAnswers !== undefined ? `${testResults.correctAnswers}/${testResults.totalQuestions}` : `${latestTestStats.correct}/${latestTestStats.total}`}
                </strong></span>
                <span>Үнэлгээ: <strong className={getGradeColor(testResults.score)}>
                  {getGradeText(testResults.score)}
                </strong></span>
              </div>
            </div>
            <button
              onClick={() => setShowTestResults(false)}
              className="ml-auto text-green-700 dark:text-green-300 hover:text-green-900 text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Сайн байна уу, {user?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.grade} анги • {user?.goals?.join(', ')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Хэрэглэгчийн төлөв</div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${user?.subscriptionStatus === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                {user?.subscriptionStatus === 'active' ? 'Идэвхтэй' : 'Идэвхгүй'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Retest Banner */}
            {retestSchedule?.isEligible && (
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">
                      Дахын тест өгөх бэлэн үү?
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300">
                      Хэр зэрэг сайжруулсангаа харахын тулд шуурхай тест өгөөрэй!
                    </p>
                  </div>
                  <button
                    onClick={handleRetestClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Тест өгөх
                  </button>
                </div>
              </div>
            )}

            {/* Test Results Card - Shows when test is completed */}
            {showTestResults && testResults && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Таны Тестийн Үр Дүн
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {testResults.score}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Нийт Үнэлгээ</div>
                    </div>

                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {testResults.level}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Түвшин</div>
                    </div>

                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className={`text-2xl font-bold ${getGradeColor(testResults.score)}`}>
                        {getGradeText(testResults.score).split(' ')[0]}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Үнэлгээ</div>
                    </div>

                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {testResults.correctAnswers !== undefined ? testResults.correctAnswers : latestTestStats.correct}/{testResults.totalQuestions !== undefined ? testResults.totalQuestions : latestTestStats.total}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Зөв хариулт</div>
                    </div>
                  </div>

                  {testResults.weakTopics && testResults.weakTopics.length > 0 && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                      <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                        Сайжруулах шаардлагатай сэдвүүд:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {testResults.weakTopics.map((topic: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => navigate('/physic/EYSH_beltgel')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Дараагийн хичээлээ үзэх
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Статистик
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {testHistory.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Тестийн тоо</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {latestTestStats.correct}/{latestTestStats.total}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Сүүлийн тест</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {testHistory.length > 0 ? Math.round(testHistory.reduce((sum, attempt) => sum + attempt.score, 0) / testHistory.length) : (testResults?.score || 0)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Дундаж</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {testResults?.level || user?.currentLevel || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Түвшин</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Таны Амжилт
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Одоогийн Түвшин</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {testResults?.level || user?.currentLevel || 'Тодорхойгүй'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Сүүлийн Үнэлгээ</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {testResults?.score ? `${testResults.score}%` : testHistory[0]?.score ? `${testHistory[0].score}%` : '0%'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Зөв хариулт</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {latestTestStats.correct}/{latestTestStats.total}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Тестийн Тоо</span>
                    <span className="font-medium text-gray-900 dark:text-white">{testHistory.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions - NEW DESIGN */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                ⚡ Үйлдлүүд
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'ЭЕШ Бодлогууд', icon: '📚', path: '/physic/EYSH_beltgel', color: 'from-blue-500 to-cyan-500' },
                  { label: 'Хичээл Хайх', icon: '🔍', path: '/search', color: 'from-green-500 to-emerald-500' },
                  { label: 'Дахин Тест Өгөх', icon: '🔄', onClick: handleRetestClick, color: 'from-purple-500 to-pink-500' }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick || (() => navigate(action.path!))}
                    className={`w-full px-6 py-4 bg-gradient-to-r ${action.color} text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-bold text-left flex items-center space-x-3`}
                  >
                    <span className="text-xl">{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
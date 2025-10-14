import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuthStore } from '../stores/auth';

interface Lesson {
  id: string;
  title: string;
  slug: string;
  grade: string;
  topics: string[];
  difficulty: number;
  type: 'video' | 'reading' | 'exercise';
  contentUrl?: string;
}

interface Recommendation {
  lessons: Lesson[];
  rationale: string;
  computedAt: string | null;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
  const [retestSchedule, setRetestSchedule] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated, navigate]);

  const loadDashboardData = async () => {
    try {
      console.log('🔍 Dashboard: Loading recommendations...');
      const [recData, scheduleData] = await Promise.all([
        apiClient.getRecommendations() as Promise<Recommendation>,
        apiClient.getRetestSchedule() as Promise<any>
      ]);
      
      console.log('📊 Dashboard: Received recommendation data:', {
        hasRecommendations: !!recData,
        lessonCount: recData?.lessons?.length || 0,
        lessons: recData?.lessons?.map(l => ({ id: l.id, title: l.title })) || [],
        rationale: recData?.rationale
      });
      
      setRecommendations(recData);
      setRetestSchedule(scheduleData);
    } catch (error: any) {
      console.error('❌ Dashboard: Error loading data:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLessonClick = (lessonId: string) => {
    navigate(`/lessons/${lessonId}`);
  };

  const handleRetestClick = () => {
    navigate('/placement');
  };

  const getDifficultyColor = (difficulty: number) => {
    const colors = {
      1: 'bg-green-100 text-green-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-orange-100 text-orange-800',
      5: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'reading': return '📖';
      case 'exercise': return '✏️';
      default: return '📄';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Grade {user?.grade} • {user?.goals?.join(', ')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Subscription Status</div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                user?.subscriptionStatus === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user?.subscriptionStatus || 'Inactive'}
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
                      Ready for a Level Check?
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300">
                      Take a quick test to see how much you've improved!
                    </p>
                  </div>
                  <button
                    onClick={handleRetestClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Take Test
                  </button>
                </div>
              </div>
            )}

            {/* Recommended Lessons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Recommended Lessons
                </h2>
                
                {recommendations?.lessons && recommendations.lessons.length > 0 ? (
                  <div className="space-y-4">
                    {recommendations.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson.id)}
                        className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">{getTypeIcon(lesson.type)}</span>
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {lesson.title}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Grade {lesson.grade} • {lesson.topics.join(', ')}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                                Level {lesson.difficulty}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {lesson.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No recommendations available yet. Complete your placement test to get personalized lesson recommendations.
                    </p>
                  </div>
                )}

                {recommendations?.rationale && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Why these lessons?</strong> {recommendations.rationale}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Current Level</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user?.currentLevel || 'Not assessed'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Lessons Completed</span>
                    <span className="font-medium text-gray-900 dark:text-white">0</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Tests Taken</span>
                    <span className="font-medium text-gray-900 dark:text-white">1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/lessons')}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                >
                  Browse All Lessons
                </button>
                <button
                  onClick={() => navigate('/search')}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                >
                  Search Lessons
                </button>
                {user?.subscriptionStatus !== 'active' && (
                  <button
                    onClick={() => navigate('/pay')}
                    className="w-full text-left px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md"
                  >
                    Upgrade Subscription
                  </button>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Next Steps
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>1. Complete recommended lessons</p>
                <p>2. Practice with exercises</p>
                <p>3. Take progress tests</p>
                <p>4. Track your improvement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

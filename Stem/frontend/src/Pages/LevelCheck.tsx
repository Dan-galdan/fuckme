import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';
import { apiClient } from '../api/client';

interface LevelScore {
  _id: string;
  userId: string;
  source: 'placement' | 'retest';
  level: string | number;
  scorePercent: number;
  topicsProfile: Record<string, number>;
  createdAt: string;
}

interface Recommendation {
  _id: string;
  userId: string;
  computedAt: string;
  lessonIds: string[];
  rationale: string;
}

const LevelCheckPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [levelScores, setLevelScores] = useState<LevelScore[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    loadLevelData();
  }, [isAuthenticated, navigate]);

  const loadLevelData = async () => {
    try {
      setIsLoading(true);
      
      // Load level scores and recommendations
      const [scoresResponse, recommendationsResponse] = await Promise.all([
        apiClient.getRecommendations(), // This will also return level data
        apiClient.getRecommendations()
      ]);
      
      // Mock data for now since we don't have these endpoints yet
      setLevelScores([
        {
          _id: '1',
          userId: user?._id || '',
          source: 'placement',
          level: user?.currentLevel || 'Beginner',
          scorePercent: 75,
          topicsProfile: {
            'kinematics': 0.8,
            'forces': 0.6,
            'energy': 0.7,
            'waves': 0.5
          },
          createdAt: new Date().toISOString()
        }
      ]);
      
      setRecommendations([
        {
          _id: '1',
          userId: user?._id || '',
          computedAt: new Date().toISOString(),
          lessonIds: ['lesson1', 'lesson2'],
          rationale: 'Based on your placement test results, we recommend focusing on wave mechanics and energy conservation.'
        }
      ]);
      
    } catch (error: any) {
      setError(error.message || 'Failed to load level data');
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelColor = (level: string | number) => {
    const levelStr = String(level).toLowerCase();
    if (levelStr.includes('beginner')) return 'text-green-600 bg-green-100';
    if (levelStr.includes('intermediate')) return 'text-yellow-600 bg-yellow-100';
    if (levelStr.includes('advanced')) return 'text-red-600 bg-red-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your level data...</p>
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
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentLevel = levelScores[0];
  const currentRecommendation = recommendations[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Your Learning Level
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Track your progress and see your current physics level
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Current Level Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Current Level
          </h2>
          
          {currentLevel ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getLevelColor(currentLevel.level)}`}>
                  {currentLevel.level}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Overall Level</p>
              </div>
              
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(currentLevel.scorePercent)}`}>
                  {currentLevel.scorePercent}%
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Placement Score</p>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(currentLevel.createdAt).toLocaleDateString()}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Last Updated</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No level data available. Complete a placement test to see your level.
            </p>
          )}
        </div>

        {/* Topic Mastery */}
        {currentLevel && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Topic Mastery
            </h2>
            
            <div className="space-y-4">
              {Object.entries(currentLevel.topicsProfile).map(([topic, mastery]) => (
                <div key={topic}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 dark:text-gray-300 capitalize">
                      {topic.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {Math.round(mastery * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${mastery * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {currentRecommendation && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recommended Next Steps
            </h2>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {currentRecommendation.rationale}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {currentRecommendation.lessonIds.map((lessonId) => (
                  <span
                    key={lessonId}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    Lesson {lessonId}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Recommended Lessons
              </button>
              <button
                onClick={() => navigate('/placement')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Retake Placement Test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelCheckPage;

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PhoneFooter from '../components/phoneFooter';
import Footer from '../components/Footer';
import PhoneHeader from '../components/Header/phoneHeader';
import { apiClient } from '../api/client';

function LessonTemplate() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadLesson();
    }
  }, [id]);

  const loadLesson = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getLesson(id);
      setLesson(response);
    } catch (error) {
      console.error('Error loading lesson:', error);
      setError('Failed to load lesson');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full pt-20 text-slate-900 dark:text-white min-h-screen transition-colors duration-500 bg-gradient-to-b from-slate-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading lesson...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="w-full pt-20 text-slate-900 dark:text-white min-h-screen transition-colors duration-500 bg-gradient-to-b from-slate-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">
            <p className="text-red-600 dark:text-red-400 text-lg">
              {error || 'Lesson not found'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-20 text-slate-900 dark:text-white min-h-screen transition-colors duration-500 bg-gradient-to-b from-slate-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full"></div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              {lesson.title}
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
              {lesson.grade}-р анги
            </span>
            <span className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
              Хүндрэл: {lesson.difficulty}/5
            </span>
            <span className="bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded-full">
              {lesson.type}
            </span>
          </div>
        </div>

        {/* Topics */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">Сэдвүүд:</h3>
          <div className="flex flex-wrap gap-2">
            {lesson.topics.map((topic, index) => (
              <span 
                key={index}
                className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Video Content */}
        {lesson.contentUrl && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Хичээлийн видео:</h3>
            <div className="relative w-full h-0 pb-[56.25%] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <iframe
                src={lesson.contentUrl}
                title={lesson.title}
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
                frameBorder="0"
              />
            </div>
          </div>
        )}

        {/* Additional Content URLs */}
        {lesson.contentUrls && lesson.contentUrls.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Нэмэлт материал:</h3>
            <div className="space-y-4">
              {lesson.contentUrls.map((url, index) => (
                <div key={index} className="relative w-full h-0 pb-[56.25%] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <iframe
                    src={url}
                    title={`${lesson.title} - Additional ${index + 1}`}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                    frameBorder="0"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lesson Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Хичээлийн мэдээлэл:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Анги:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{lesson.grade}-р анги</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Хүндрэл:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{lesson.difficulty}/5</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Төрөл:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{lesson.type}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Үүсгэсэн:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {new Date(lesson.createdAt).toLocaleDateString('mn-MN')}
              </span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Буцах
          </button>
        </div>
      </div>
      
      <Footer />
      <PhoneFooter />
    </div>
  );
}

export default LessonTemplate;

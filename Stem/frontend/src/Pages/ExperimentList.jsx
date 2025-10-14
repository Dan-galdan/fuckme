import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'
import PhoneFooter from '../components/phoneFooter'
import Footer from '../components/Footer'
import Lister from '../components/Body/Lister';
import { experiments } from '../Datas/Experiments';
import PhoneHeader from '../components/Header/phoneHeader'
import { apiClient } from '../api/client';

function ExperimentList({ Subject }) {
  const { grade } = useParams();
  const Grade = Number(grade);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLessons();
  }, [grade]);

  const loadLessons = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getLessonsByGrade(grade);
      setLessons(response.lessons || []);
    } catch (error) {
      console.error('Error loading lessons:', error);
      setError('Failed to load lessons');
      // Fallback to hardcoded experiments if API fails
      setLessons(experiments.filter(data => data.grade === Grade && data.subject === Subject));
    } finally {
      setIsLoading(false);
    }
  };

  console.log('Grade:', Grade); // Debug log
  console.log('Lessons from DB:', lessons);

  if (isLoading) {
    return (
      <div className="w-full pt-20 text-slate-900 dark:text-white min-h-screen transition-colors duration-500 bg-gradient-to-b from-slate-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading lessons...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-20 text-slate-900 dark:text-white min-h-screen transition-colors duration-500 bg-gradient-to-b from-slate-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl text-center font-bold mb-12 mt-10">{Grade}-р ангийн физикийн хичээлүүд</h2>
        
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="space-y-6 pb-16">
          {lessons.length > 0 ? (
            lessons.map(lesson => (
              <div key={lesson.id} className="max-w-4xl mx-auto">
                <Lister 
                  id={lesson.id} 
                  title={lesson.title} 
                  name={lesson.slug}
                  description={`${lesson.topics.join(', ')} - Хүндрэл: ${lesson.difficulty}/5`}
                  path={`/physic/lesson/${lesson.id}`}
                  type="lessons" 
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {Grade}-р ангид одоогоор хичээл байхгүй байна.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer/><PhoneFooter/>
    </div>
  );
}

export default ExperimentList;

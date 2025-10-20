import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import PhoneFooter from '../components/phoneFooter'
import Footer from '../components/Footer'
import Lister from '../components/Body/Lister';
import PhoneHeader from '../components/Header/phoneHeader'
import { apiClient } from '../api/client'; // Import your API client

function EYSHlist({ hicheel }) {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filteredHicheel, setFilteredHicheel] = useState(hicheel);
  const [tests, setTests] = useState([]); // NEW: Store tests from database
  const [combinedItems, setCombinedItems] = useState([]); // NEW: Combined lessons + tests

  // NEW: Fetch tests from your backend
  useEffect(() => {
    async function fetchTests() {
      try {
        console.log('🔍 Fetching tests from API...');
        const testsData = await apiClient.getTests();
        console.log('🔍 Tests data received:', testsData);
        console.log('🔍 Number of tests:', testsData.tests?.length);
        setTests(testsData.tests || []);
      } catch (error) {
        console.error('🔍 Failed to fetch tests:', error);
      }
    }
    fetchTests();
  }, []);

  // NEW: Combine lessons and tests
  useEffect(() => {
    // Convert tests to the same format as hicheel
    const testItems = tests.map(test => ({
      id: test.id,
      name: `test-${test.id}`,
      title: test.title,
      description: test.description,
      type: 'test', // Mark as test for filtering
      path: `/physic/test/${test.id}`, // Create a test taking route
      isTest: true // Flag to identify as test
    }));

    // Combine hicheel lessons and tests
    const allItems = [...hicheel, ...testItems];
    setCombinedItems(allItems);
  }, [hicheel, tests]);

  // Filter combined items
  useEffect(() => {
    let filtered = combinedItems;

    // Filter by year
    if (selectedYear) {
      const yearNum = parseInt(selectedYear);
      filtered = filtered.filter(item => {
        // For tests, use current year or creation date
        if (item.isTest) {
          return selectedYear === '2024'; // Or get year from test data
        }

        // For lessons, use existing logic
        const yearMatch = item.title.match(/(20\d{2})/);
        if (yearMatch) {
          const itemYear = parseInt(yearMatch[1]);
          return itemYear === yearNum;
        }
        return false;
      });
    }

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(item => {
        if (selectedType === 'test') {
          return item.isTest; // Show only tests
        } else if (selectedType === 'video') {
          return !item.isTest && (item.type === 'video' || item.title.toLowerCase().includes('видео') || item.title.toLowerCase().includes('тайлбар'));
        } else if (selectedType === 'exercise') {
          return !item.isTest && (item.type === 'exercise' || item.title.toLowerCase().includes('дасгал') || item.title.toLowerCase().includes('бодлого'));
        }
        return true;
      });
    }

    setFilteredHicheel(filtered);
  }, [selectedYear, selectedType, combinedItems]);

  return (
    <div className="w-full h-full transition-colors duration-500 bg-gradient-to-b from-slate-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-6 pt-24">
        <h2 className="text-3xl font-bold mb-16 text-slate-900 dark:text-white text-center">ЭЕШ-ийн бодолтууд ба Сорилууд</h2>

        {/* Filter Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between gap-4">
            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white hover"
            >
              <option value="">Он: Бүгд</option>
              {Array.from({ length: 5 }, (_, i) => 2025 - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Type Filter - Updated to include tests */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white hover"
            >
              <option value="">Бүгд</option>
              <option value="video">Видео/Хичээл</option>
              <option value="test">Тест/Сорил</option> {/* NEW OPTION */}
              <option value="exercise">Дасгал/Бодлого</option>
            </select>

            <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {filteredHicheel.length} {filteredHicheel.some(item => item.isTest) ? 'сорил' : 'бодлого'} олдлоо {selectedYear && `(${selectedYear} он)`}
            </div>
          </div>
        </div>

        {/* Combined List - Lessons + Tests */}
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
          {filteredHicheel.length > 0 ? (
            filteredHicheel.map(data => (
              <div key={data.id}>
                <Lister
                  id={data.id}
                  title={data.title}
                  name={data.name}
                  path={data.path}
                  type={data.isTest ? "test" : "eyesh"} // Pass type for styling
                  description={data.description} // Add description for tests
                  isTest={data.isTest} // Pass test flag
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {selectedYear || selectedType ? 'Бодлого/сорил олдсонгүй' : 'Бодлого/сорил олдсонгүй'}
            </div>
          )}
        </div>
      </div>
      <Footer /><PhoneFooter />
    </div>
  );
}

export default EYSHlist
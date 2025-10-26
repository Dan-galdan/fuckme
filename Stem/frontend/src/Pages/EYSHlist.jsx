import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import PhoneFooter from '../components/phoneFooter'
import Footer from '../components/Footer'
import Lister from '../components/Body/Lister';
import PhoneHeader from '../components/Header/phoneHeader'
import { apiClient } from '../api/client';

function EYSHlist({ hicheel }) {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filteredHicheel, setFilteredHicheel] = useState(hicheel);
  const [tests, setTests] = useState([]);
  const [combinedItems, setCombinedItems] = useState([]);

  // Fetch actual tests from your database
  useEffect(() => {
    async function fetchTests() {
      try {
        console.log('🔍 Fetching actual tests from database...');

        // Try different endpoints to get your created tests
        let testsData = null;

        try {
          // First try the admin endpoint (if you have admin access)
          testsData = await apiClient.getTests();
          console.log('🔍 Admin tests data received:', testsData);
        } catch (adminError) {
          console.log('🔍 Admin endpoint failed, trying available tests...');
          try {
            // Try available tests endpoint
            testsData = await apiClient.getAvailableTests();
            console.log('🔍 Available tests data received:', testsData);
          } catch (availableError) {
            console.log('🔍 Available tests endpoint failed, trying placement test...');
            // Fallback to placement test
            testsData = await apiClient.getPlacementTest();
            console.log('🔍 Placement test data received:', testsData);
          }
        }

        // Process the tests data based on the response structure
        let processedTests = [];

        if (testsData) {
          // Handle different response structures
          if (Array.isArray(testsData)) {
            // Direct array of tests
            processedTests = testsData.map(test => ({
              id: test.id || test._id,
              title: test.title,
              description: test.description,
              isPlacement: test.isPlacement || false
            }));
          } else if (testsData.tests && Array.isArray(testsData.tests)) {
            // Response with { tests: [...] }
            processedTests = testsData.tests.map(test => ({
              id: test.id || test._id,
              title: test.title,
              description: test.description,
              isPlacement: test.isPlacement || false
            }));
          } else if (testsData.id) {
            // Single test object (like placement test)
            processedTests = [{
              id: testsData.id,
              title: testsData.title,
              description: testsData.description,
              isPlacement: true
            }];
          } else if (testsData.questions) {
            // Placement test with questions array
            processedTests = [{
              id: 'placement',
              title: testsData.title || 'Түвшин тогтоох тест',
              description: testsData.description || 'Математик, физикийн мэдлэгийн түвшинг тогтоох тест',
              isPlacement: true
            }];
          }
        }

        console.log('🔍 Processed tests:', processedTests);
        setTests(processedTests);

      } catch (error) {
        console.error('❌ Failed to fetch tests from all endpoints:', error);
        // If all endpoints fail, show empty array (no tests)
        setTests([]);
      }
    }
    fetchTests();
  }, []);

  // Combine lessons and tests
  useEffect(() => {
    // Convert tests to the same format as hicheel
    const testItems = tests.map(test => ({
      id: test.id,
      name: `test-${test.id}`,
      title: test.title,
      description: test.description,
      type: 'test',
      path: test.isPlacement ? '/placement' : `/physic/test/${test.id}`,
      isTest: true
    }));

    // Combine hicheel lessons and tests
    const allItems = [...hicheel, ...testItems];
    setCombinedItems(allItems);
    console.log('🔍 Combined items:', allItems.length, 'total (', hicheel.length, 'lessons +', testItems.length, 'tests)');
  }, [hicheel, tests]);

  // Filter combined items
  useEffect(() => {
    let filtered = combinedItems;

    // Filter by year
    if (selectedYear) {
      const yearNum = parseInt(selectedYear);
      filtered = filtered.filter(item => {
        // For tests, show all tests regardless of year filter
        if (item.isTest) {
          return true;
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
          return item.isTest;
        } else if (selectedType === 'video') {
          return !item.isTest && (item.type === 'video' || item.title.toLowerCase().includes('видео') || item.title.toLowerCase().includes('тайлбар'));
        } else if (selectedType === 'exercise') {
          return !item.isTest && (item.type === 'exercise' || item.title.toLowerCase().includes('дасгал') || item.title.toLowerCase().includes('бодлого'));
        }
        return true;
      });
    }

    setFilteredHicheel(filtered);
    console.log('🔍 Filtered items:', filtered.length, 'after filters (year:', selectedYear, 'type:', selectedType, ')');
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

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white hover"
            >
              <option value="">Бүгд</option>
              <option value="video">Видео/Хичээл</option>
              <option value="test">Тест/Сорил</option>
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
                  type={data.isTest ? "test" : "eyesh"}
                  description={data.description}
                  isTest={data.isTest}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 te xt-gray-500 dark:text-gray-400">
              {tests.length === 0 ? 'Сорил байхгүй байна' : 'Бодлого/сорил олдсонгүй'}
            </div>
          )}
        </div>
      </div>
      <Footer /><PhoneFooter />
    </div>
  );
}

export default EYSHlist;
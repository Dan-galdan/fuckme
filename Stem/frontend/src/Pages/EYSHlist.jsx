import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import PhoneFooter from '../components/phoneFooter'
import Footer from '../components/Footer'
import Lister from '../components/Body/Lister';
import PhoneHeader from '../components/Header/phoneHeader'

function EYSHlist({ hicheel }) {
  const [selectedYear, setSelectedYear] = useState(''); // Empty string for "All"
  const [selectedType, setSelectedType] = useState(''); // Empty string for "All"
  const [filteredHicheel, setFilteredHicheel] = useState(hicheel);

  // Filter hicheel based on selected year and type
  useEffect(() => {
    let filtered = hicheel;

    // Filter by year
    if (selectedYear) {
      const yearNum = parseInt(selectedYear);
      filtered = filtered.filter(item => {
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
        // Assuming your items have a 'type' property
        // If not, we can extract from title or use default logic
        if (item.type) {
          return item.type === selectedType;
        }
        // Fallback: try to determine type from title
        const title = item.title.toLowerCase();
        if (selectedType === 'video' && (title.includes('видео') || title.includes('video') || title.includes('тайлбар'))) {
          return true;
        }
        if (selectedType === 'test' && (title.includes('тест') || title.includes('test') || title.includes('дасгал'))) {
          return true;
        }
        return false;
      });
    }

    setFilteredHicheel(filtered);
  }, [selectedYear, selectedType, hicheel]);

  return (
    <div className="w-full h-full transition-colors duration-500 bg-gradient-to-b from-slate-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-6 pt-24">
        <h2 className="text-3xl font-bold mb-16 text-slate-900 dark:text-white text-center">ЭЕШ-ийн бодолтууд</h2>

        {/* Filter Section - Aligned with hicheel list */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between gap-4">
            {/* Year Filter Dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white hover"
            >
              <option value="">Oн: Бүгд</option>
              {Array.from({ length: 5 }, (_, i) => 2025 - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Type Filter Dropdown */}
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

            {/* Results count - Small gap and aligned */}
            <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {filteredHicheel.length} бодлого олдлоо {selectedYear && `(${selectedYear} он)`}
            </div>
          </div>
        </div>

        {/* Hicheel List - Same max-width as filter section */}
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
          {filteredHicheel.length > 0 ? (
            filteredHicheel.map(data => (
              <div key={data.id}>
                <Lister
                  id={data.id}
                  title={data.title}
                  name={data.name}
                  path={`/physic/EYSH_beltgel/${data.name}`}
                  type="eyesh"
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {selectedYear || selectedType ? 'Бодлого олдсонгүй' : 'Бодлого олдсонгүй'}
            </div>
          )}
        </div>
      </div>
      <Footer /><PhoneFooter />
    </div>
  );
}

export default EYSHlist
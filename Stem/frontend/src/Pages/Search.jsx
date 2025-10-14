import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { items } from '../Datas/Items'; // Importing items data
import { hicheel } from '../Datas/Hicheel'; // Importing hicheel data
import { chemistry } from '../Datas/Chemistry'; // Importing chemistry data
import { experiments } from '../Datas/Experiments'; // Importing experiments data
import Lister from '../components/Body/Lister'; // Importing Lister component
import Card from '../components/Body/Card';

// Enhanced icons
const SearchIcon = () => (
  <svg className="w-5 h-5 text-slate-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const BackArrowIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);


function Search() {
  const [query, setQuery] = useState(''); // State for search query
  const navigate = useNavigate(); // Initialize navigate

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  // Filtered results based on the search query
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredHicheel = hicheel.filter(h => 
    h.name.toLowerCase().includes(query.toLowerCase()) ||
    h.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredChemistry = chemistry.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredExperiments = experiments.filter(e => 
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
   <div className="w-full min-h-screen relative text-slate-900 dark:text-white transition-colors duration-500 bg-gradient-to-b from-slate-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
    {/* Header Section */}
    <div className='relative w-full pt-20 pb-12'>
      <div className='flex items-center gap-6 w-full max-w-4xl mx-auto px-6'>
        <button onClick={() => navigate(-1)} className="flex items-center group"> 
          <div className='w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110'>
            <BackArrowIcon />
          </div>
        </button>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input 
            type="text" 
            placeholder="Хайх..." 
            value={query} 
            onChange={handleSearchChange} 
            className="w-full h-12 pl-12 pr-4 rounded-2xl text-slate-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 shadow-lg hover:shadow-xl transition-all duration-300 placeholder-slate-500 dark:placeholder-gray-400"
            />
        </div>
      </div>
    </div>

    {/* Content Section */}
    <div className='w-full max-w-7xl mx-auto px-6 pb-12'>
      {/* Display filtered results using Lister component */}
      {filteredHicheel.length > 0 && (
        <div className='mb-12'>
          <div className='flex items-center gap-4 mb-8'>
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full"></div>
            <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white'>ЭЕШ-ийн хичээлүүд</h1>
          </div>
          <div className="space-y-6">
            {filteredHicheel.map(h => (
              <Lister key={h.id} id={h.id} name={h.name} title={h.title} path={`/physic/EYSH_beltgel/${h.name}`} type="eyesh" />
            ))}
          </div>
        </div>
      )}

      {filteredExperiments.length > 0 && (
        <div className='mb-12'>
          <div className='flex items-center gap-4 mb-8'>
            <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full"></div>
            <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white'>Физикийн туршилтууд</h1>
          </div>
          <div className="space-y-6">
            {filteredExperiments.map(e => (
              <Lister key={e.id} id={e.id} title={e.title} name={e.name} description={e.description} path={`/physic/experiment/${e.name}`} type="experiments" />
            ))}
          </div>
        </div>
      )}

      {filteredChemistry.length > 0 && (
        <div className='mb-12'>
          <div className='flex items-center gap-4 mb-8'>
            <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white'>Химийн туршилтууд</h1>
          </div>
          <div className="space-y-6">
            {filteredChemistry.map(c => (
              <Lister key={c.id} id={c.id} name={c.name} title={c.title} description={c.description} path={`/chemistry/${c.id}`} type="chemistry"/>
            ))}
          </div>
        </div>
      )}

      {filteredItems.length > 0 && (
        <div className='mb-12'>
          <div className='flex items-center gap-4 mb-8'>
            <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
            <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white'>Бараа бүтээгдэхүүн</h1>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6'>
            {filteredItems.map(item => (
              <Card key={item.id} price={item.price} id={item.id} name={item.name} title={item.title} img={item.img} path={`/market/${item.name}`} type="items" />
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {query && filteredHicheel.length === 0 && filteredExperiments.length === 0 && filteredChemistry.length === 0 && filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-slate-600 dark:text-gray-400 mb-2">
            Хайлтын үр дүн олдсонгүй
          </h2>
          <p className="text-slate-500 dark:text-gray-500">
            "{query}" гэсэн үгээр хайлт хийсэн боловч үр дүн олдсонгүй.
          </p>
        </div>
      )}
    </div>
   </div>
  )
}

export default Search;

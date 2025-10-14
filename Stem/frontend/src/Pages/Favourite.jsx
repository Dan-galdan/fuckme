import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Lister from '../components/Body/Lister'; // Importing Lister component
import Card from '../components/Body/Card';

// Enhanced icons
const BackArrowIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const BookmarkIcon = () => (
  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

function Favourite() {
  const [experiments, setExperiments] = useState([]); // Added state for experiments
  const [chemistry, setChemistry] = useState([]); // Added state for chemistry
  const [eyesh, setEyesh] = useState([]); // Added state for experiments
  const [items, setItems] = useState([]); // Added state for experiments
  const navigate = useNavigate();
  const { name } = useParams();
  const experiment = experiments.find(exp => exp.name === name);
  console.log(experiment  ) // Initialize navigate

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedExperiments = localStorage.getItem("experiments");
    const savedChemistry = localStorage.getItem("chemistry");
    const savedItems = localStorage.getItem("items");
    const savedEyesh = localStorage.getItem("Eyesh");
    if (savedExperiments) {
      setExperiments(JSON.parse(savedExperiments)); // Set experiments from local storage
      setChemistry(JSON.parse(savedChemistry));
      setEyesh(JSON.parse(savedEyesh));
      setItems(JSON.parse(savedItems));
    }
  }, []);
  console.log(experiments)

  // Load saved experiments from localStorage
  const savedExperiments = JSON.parse(localStorage.getItem("experiments")) || [];
  const savedChemistry = JSON.parse(localStorage.getItem("chemistry")) || [];
  const savedItems = JSON.parse(localStorage.getItem("items")) || [];
  const savedEyesh = JSON.parse(localStorage.getItem("eyesh")) || [];


  return (
   <div className="w-full min-h-screen relative text-slate-900 dark:text-white transition-colors duration-500 bg-gradient-to-b from-slate-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
    {/* Header Section */}
    <div className='relative w-full pt-24 pb-16'>
      <div className='flex items-center justify-between w-full max-w-5xl mx-auto px-8'>
        <button onClick={() => navigate(-1)} className="flex items-center group"> 
          <div className='w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110'>
            <BackArrowIcon />
          </div>
        </button>
        <div className="flex items-center gap-6">
          <BookmarkIcon />
          <h1 className='text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white'>Хадгалсан зүйлс</h1>
        </div>
        <div className="w-12"></div> {/* Spacer to center the title */}
      </div>
    </div>

    {/* Content Section */}
    <div className='w-full max-w-7xl mx-auto px-8 pb-16'>
      
       {/* New section to display saved experiments */}
       {savedExperiments.length > 0 && (
         <div className='mb-12'>
           <div className='flex items-center gap-4 mb-8'>
             <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full"></div>
             <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white'>Туршилтууд</h1>
           </div>
           <div className="space-y-6">
             {savedExperiments.map(exp => (
               <Lister key={exp.id} name={exp.name} id={exp.id} title={exp.title} description={exp.description} path={`/physic/experiment/${exp.name} `} type='experiments' />
             ))}
           </div>
         </div>
       )}

       {savedEyesh.length > 0 && (
         <div className='mb-12'>
           <div className='flex items-center gap-4 mb-8'>
             <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full"></div>
             <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white'>ЭЕШ-ийн хичээлүүд</h1>
           </div>
           <div className="space-y-6">
             {savedEyesh.map(exp => (
               <Lister key={exp.id} name={exp.name} id={exp.id} title={exp.title} description={exp.description} path={`/physic/EYSH_beltgel/${exp.name} `} type='eyesh' />
             ))}
           </div>
         </div>
       )}

       {/* {savedChemistry.length > 0 && (
         <div className='mb-12'>
           <div className='flex items-center gap-4 mb-8'>
             <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
             <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white'>Химийн туршилтууд</h1>
           </div>
           <div className="space-y-6">
             {savedChemistry.map(exp => (
               <Lister key={exp.id} name={exp.name} id={exp.id} title={exp.title} description={exp.description} path={`/chemistry//${exp.name} `} type='chemistry' />
             ))}
           </div>
         </div>
       )} */}

       {savedItems.length > 0 && (
         <div className='mb-12'>
           <div className='flex items-center gap-4 mb-8'>
             <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
             <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white'>Бараа бүтээгдэхүүн</h1>
           </div>
           <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6'>
             {savedItems.map(exp => (
               <Card key={exp.id} price={exp.price} id={exp.id} name={exp.name} title={exp.title} img={exp.img} path={`/market/${exp.name}`} type="items" />
             ))}
           </div>
         </div>
       )}

       {/* Empty state */}
       {savedExperiments.length === 0 && savedEyesh.length === 0 && savedItems.length === 0 && (
         <div className="text-center py-16">
           <div className="text-6xl mb-6">📚</div>
           <h2 className="text-2xl font-semibold text-slate-600 dark:text-gray-400 mb-4">
             Хадгалсан зүйлс байхгүй
           </h2>
           <p className="text-slate-500 dark:text-gray-500 max-w-md mx-auto">
             Та одоогоор хадгалсан зүйлс байхгүй байна. Хадгалахыг хүсэж буй зүйлсээ bookmark хийж болно.
           </p>
         </div>
       )}
     </div>
   </div>
  );
}

export default Favourite;
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bookmarkStroke from '/bookmarkStroke.svg';
import bookmark from '/bookmark.svg';
import PhoneFooter from '../components/phoneFooter'
import Footer from '../components/Footer';
import PhoneHeader from '../components/Header/phoneHeader'

function ItemTemplate({ items }) {
  const navigate = useNavigate();
  const { name } = useParams();
  const item = items.find(exp => exp.name === name);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Check if the item is already bookmarked on component mount
    let existingItems = JSON.parse(localStorage.getItem("items")) || [];
    const isExisting = existingItems.some(savedItem => savedItem.name === item.name);
    setIsBookmarked(isExisting); // Set initial bookmark status
  }, [item]);

  function save() {
    // Get existing data from localStorage and ensure it's an array
    let existingItems = JSON.parse(localStorage.getItem("items")) || [];
    
    // Check if item already exists in the array
    const isExisting = existingItems.some(savedItem => savedItem.name === item.name);
    
    if (!isExisting) {
      // Add new item to the existing data array
      const newData = [...existingItems, { ...item }];
      localStorage.setItem("items", JSON.stringify(newData)); // Save to localStorage
      console.log("Added to bookmarks");
      setIsBookmarked(true); // Update bookmark status
    } else {
      // Remove the item from bookmarks
      const newData = existingItems.filter(savedItem => savedItem.name !== item.name);
      localStorage.setItem("items", JSON.stringify(newData)); // Save to localStorage
      console.log("Removed from bookmarks");
      setIsBookmarked(false); // Update bookmark status
    }
  }

  if (!item) {
    return <div>item not found</div>;
  }

  const title = item.subject === 'chemistry' ? 'Орц' : item.subject === 'physics' ? 'Материал' : 'Материал';

  return (
    <div className="w-full pb-96 relative dark:text-white text-black sm:pb-48 min-h-screen flex flex-col items-center pt-12 -mt-[50px]  transition-colors duration-500 bg-[#FDFDFD] dark:bg-gradient-to-b dark:from-[#101214] dark:from-20% dark:to-[#1B1D20] dark:to-80%">
      
      {/* Back button */}
      <div className='w-10/12 mb-8 mt-10 flex flex-row justify-center items-center'>
        <button onClick={() => navigate(-1)} className="w-2/12 flex items-center">
          <div className='w-10 h-10 rounded-full bg-[#5B93FF] flex items-center justify-center'>
            <img src="/leftArrow.svg" alt="leftArrow"/>
          </div>
        </button>
        <h2 className="text-3xl w-10/12 font-bold">{item.title}</h2>
        
        <img 
          src={isBookmarked ? bookmark : bookmarkStroke} // Use bookmark icon if saved
          alt="bookmark" 
          onClick={() => save()} // Call save function on click
        />
      </div>
      {/* Title */}
      <div className="max-w-2xl sm:w-full w-5/6 mb-8">
        <img src={item.img} alt={item.title} className='w-full rounded-lg'/>
      </div>
      <div className='max-w-2xl sm:w-full w-5/6 mb-8 text-black bg-white p-6 rounded shadow-lg flex flex-row'>
        <h1 className='text-2xl font-bold'>Үнэ:</h1>
        <p className='text-2xl font-semibold '>{item.price}</p>
      </div>
      {/* What you need */}
      <div className="w-5/6 sm:w-full max-w-2xl mb-8 text-black bg-white p-6 rounded shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">{title}</h3>
        <ul className="list-disc list-inside">
          {item.materials.map((mat, index) => (
            <li key={index}>{mat}</li>
          ))}
        </ul>
      </div>
      {/* How to do it */}
      <div className="sm:w-full w-5/6 max-w-2xl mb-8 text-black bg-white p-6 rounded shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Мэдээлэл</h3>
        <p>{item.description}</p>
      </div>

      <Footer/><PhoneFooter/>
    </div>
  );
}

export default ItemTemplate;

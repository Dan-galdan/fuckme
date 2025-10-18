// @ts-nocheck - JSX modules don't have type declarations
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from './stores/auth';

import Home from './Pages/Home';
import ExperimentList from './Pages/ExperimentList';
import ExperimentTemplate from './Pages/ExperimentTemplate';
import About from './Pages/AboutUs';
import EYSHlist from './Pages/EYSHlist';
import EYSHtemplate from './Pages/EYSHtemplate';
import PhoneNav from './components/Header/phoneNav';
import Physics from './Pages/Physics';
import Market from './Pages/Market'
import Chemistry from './Pages/Chemistry'
import ItemTemplate from './Pages/ItemTemplate';
import Search from './Pages/Search';
import Favourite from './Pages/Favourite';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Surtchilgaa from './Pages/Surtchilgaa';
import HolbooBarih from './Pages/HolbooBarih';
import Header from './components/Header/Header';
import PhoneHeader from './components/Header/phoneHeader';

// New pages
import RegisterPage from './Pages/Register';
import PlacementTestPage from './Pages/PlacementTest';
import DashboardPage from './Pages/Dashboard';
import PaymentPage from './Pages/Payment';
import LevelCheckPage from './Pages/LevelCheck';
import LessonTemplate from './Pages/LessonTemplate';
import AdminPage from './Pages/AdminPage';

import { experiments } from './Datas/Experiments'
import { items } from './Datas/Items'
import { hicheel } from './Datas/Hicheel'
import { useUIStore } from './stores/ui';

const queryClient = new QueryClient();

function App() {
  const { darkMode, toggleDarkMode } = useUIStore();
  const { checkAuth, user } = useAuthStore();

  // Initialize auth state on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={`${darkMode ? "dark" : ""}`}>
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <PhoneHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />

            <Route path="/physic" element={<Physics />} />
            <Route
              path="/physic/:grade"
              element={<ExperimentList Subject="Physics" />}
            />
            <Route
              path="/physic/experiment/:name"
              element={<ExperimentTemplate experiments={experiments} />}
            />
            <Route
              path="/physic/lesson/:id"
              element={<LessonTemplate />}
            />

            <Route path="/physic/EYSH_beltgel" element={<EYSHlist hicheel={hicheel} />} />
            <Route path="/physic/EYSH_beltgel/:name" element={<EYSHtemplate hicheel={hicheel} />} />

            <Route path='/chemistry' element={<Chemistry />} />

            <Route path='/market' element={<Market />} />
            <Route path='/market/:name' element={<ItemTemplate items={items} />} />

            <Route path='/aboutUs' element={<About />} />
            <Route path='/surtchilgaa' element={<Surtchilgaa />} />
            <Route path='/holboobarih' element={<HolbooBarih />} />

            <Route path='/search' element={<Search />} />
            <Route path='/favourite' element={<Favourite />} />

            {/* Authentication routes */}
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/placement' element={<PlacementTestPage />} />
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='/level-check' element={<LevelCheckPage />} />
            <Route path='/pay' element={<PaymentPage />} />
            {/* Admin route */}

            <Route path='/admin' element={<AdminPage />} />

          </Routes>

          <RouterAwarePhoneNav />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

// Create a separate component that can use React Router hooks
function RouterAwarePhoneNav() {
  const location = useLocation();
  const isPhysicPage = location.pathname.includes('/physic/');

  if (isPhysicPage) {
    return null;
  }

  return <PhoneNav />;
}

export default App;

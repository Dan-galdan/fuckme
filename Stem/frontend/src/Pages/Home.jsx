import TopTests from '../components/Body/topTests'
import PhoneFooter from '../components/phoneFooter'
import Footer from '../components/Footer'
import NewTest from '../components/Body/newTest'
import { experiments } from '../Datas/Experiments'
import { hicheel } from '../Datas/Hicheel'
import PhoneHeader from '../components/Header/phoneHeader'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react' // Add this import

// Admin Panel Component - Add this new component
function AdminPanel({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isLogin) {
        // Admin login
        const response = await fetch('http://localhost:4000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        if (response.ok) {
          setMessage('✅ Admin login successful!');
          setTimeout(() => onClose(), 1500);
        } else {
          setMessage('❌ Login failed. Check credentials.');
        }
      } else {
        // Admin registration
        const response = await fetch('http://localhost:4000/api/auth/register-init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            grade: 'EESH',
            goals: ['admin'],
            password: formData.password
          })
        });

        if (response.ok) {
          setMessage('✅ Admin registration initiated! Check terminal for placement session.');
        } else {
          const error = await response.json();
          setMessage(`❌ Registration failed: ${error.message}`);
        }
      }
    } catch (error) {
      setMessage('❌ Network error. Check if server is running.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Admin Login' : 'Create Admin'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Admin User"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="+976-9999-9999"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="admin@physics-school.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.includes('✅')
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            {isLogin ? 'Login as Admin' : 'Create Admin Account'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            {isLogin ? 'Need to create admin account?' : 'Already have admin account?'}
          </button>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-400 text-xs">
            💡 For instant admin access, run: <code className="bg-black/10 px-1 rounded">npm run seed:admin</code> in backend
          </p>
        </div>
      </div>
    </div>
  );
}

// Enhanced inline icons (your existing icons)
const IconPlay = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
);
const IconAtom = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="2" strokeWidth="1.5" />
    <ellipse cx="12" cy="12" rx="10" ry="4.5" strokeWidth="1.5" />
    <ellipse cx="12" cy="12" rx="4.5" ry="10" transform="rotate(60 12 12)" strokeWidth="1.5" />
    <ellipse cx="12" cy="12" rx="4.5" ry="10" transform="rotate(-60 12 12)" strokeWidth="1.5" />
  </svg>
);
const IconFlask = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" aria-hidden>
    <path d="M9 3h6M10 3v5l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V3" strokeWidth="1.5" />
  </svg>
);
const IconMath = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" fill="none" aria-hidden>
    <path d="M4 8h8M8 4v8M14 16l6 6M20 16l-6 6" strokeWidth="1.5" />
  </svg>
);

// Enhanced Hero Section Component (your existing component)
function EnhancedHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-gray-800 dark:via-gray-900 dark:to-black">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}></div>
          </div>

          <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:px-16 lg:py-32">
            <div className="max-w-4xl">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
                  <IconAtom />
                  <span>ЭЕШ-ийн бүх материал</span>
                </div>
                <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                  Туршилт, тайлбар —{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    нэг дор
                  </span>
                </h1>
                <p className="text-slate-200 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl">
                  2024–2025 хичээлийн жилийн шинэчлэгдсэн контент. Дасгал, сорил, видео тайлбар.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/physic"
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <IconPlay />
                  ЭЕШ-д бэлдье
                </Link>
                <Link
                  to="/physic"
                  className="inline-flex items-center px-6 py-4 rounded-2xl font-medium text-slate-900 bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  Туршилтууд үзэх
                </Link>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-xl"></div>
        </div>
      </div>
    </section>
  );
}

// Enhanced Section Header Component (your existing component)
function SectionHeader({ title, subtitle, linkText, linkTo }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{title}</h2>
        {subtitle && <p className="text-slate-500 dark:text-gray-400 text-lg">{subtitle}</p>}
      </div>
      {linkText && linkTo && (
        <Link
          to={linkTo}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
        >
          {linkText} →
        </Link>
      )}
    </div>
  );
}

// Enhanced Experiment Card Component (your existing component)
function EnhancedExperimentCard({ id, title, description, path }) {
  return (
    <Link
      to={path}
      className="group relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] h-96 flex flex-col"
    >
      {/* Card Image/Visual Area */}
      <div className="relative h-40 w-full bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 overflow-hidden flex-shrink-0">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
        </div>

        {/* Floating icon */}
        <div className="absolute top-4 right-4 p-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300">
          <IconAtom />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

        {/* Card title overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xs inline-flex items-center px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-emerald-700 dark:text-emerald-400 font-semibold shadow-sm">
            Физик туршилт
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-3 group-hover:text-blue-600 dark:group-hover:text-gray-300 transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        {/* Fixed height description area */}
        <div className="flex-1 mb-4 min-h-[4rem]">
          {description ? (
            <p className="text-slate-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
              {description}
            </p>
          ) : (
            <div className="h-16"></div>
          )}
        </div>

        {/* Action area - fixed at bottom */}
        <div className="flex items-center justify-between pt-2 mt-auto">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Идэвхтэй</span>
          </div>
          <div className="text-sm text-blue-600 dark:text-gray-300 font-semibold group-hover:underline flex items-center gap-1">
            Цааш үзэх
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Shine effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <div className="absolute -top-1 -left-1 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </div>
    </Link>
  );
}

// Enhanced Exam Card Component (your existing component)
function EnhancedExamCard({ id, title, path }) {
  const getIcon = () => {
    if (title.includes('Физик')) return <IconAtom />;
    if (title.includes('Математик')) return <IconMath />;
    return <IconFlask />;
  };

  const getSubject = () => {
    if (title.includes('Физик')) return 'Физик';
    if (title.includes('Математик')) return 'Математик';
    return 'Ерөнхий';
  };

  const getGradient = () => {
    if (title.includes('Физик')) return 'from-blue-500 via-cyan-500 to-teal-500';
    if (title.includes('Математик')) return 'from-purple-500 via-pink-500 to-rose-500';
    return 'from-emerald-500 via-green-500 to-lime-500';
  };

  const getIconBg = () => {
    if (title.includes('Физик')) return 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20';
    if (title.includes('Математик')) return 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20';
    return 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20';
  };

  const getIconColor = () => {
    if (title.includes('Физик')) return 'text-blue-700 dark:text-blue-400';
    if (title.includes('Математик')) return 'text-purple-700 dark:text-purple-400';
    return 'text-emerald-700 dark:text-emerald-400';
  };

  const getTagBg = () => {
    if (title.includes('Физик')) return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
    if (title.includes('Математик')) return 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400';
    return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400';
  };

  return (
    <Link
      to={path}
      className="group relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] h-96 flex flex-col"
    >
      {/* Card Header with Gradient */}
      <div className={`relative h-40 w-full bg-gradient-to-br ${getGradient()} overflow-hidden flex-shrink-0`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Ccircle cx='15' cy='15' r='1.5'/%3E%3Ccircle cx='5' cy='5' r='1'/%3E%3Ccircle cx='25' cy='25' r='1'/%3E%3Ccircle cx='25' cy='5' r='1'/%3E%3Ccircle cx='5' cy='25' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            animation: 'float 8s ease-in-out infinite'
          }}></div>
        </div>

        {/* Icon */}
        <div className={`absolute top-4 right-4 p-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300 ${getIconColor()}`}>
          {getIcon()}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

        {/* Subject tag */}
        <div className="absolute bottom-4 left-4">
          <div className={`text-xs inline-flex items-center px-3 py-1.5 rounded-full backdrop-blur-sm font-semibold shadow-sm ${getTagBg()}`}>
            {getSubject()} - ЭЕШ
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-3 group-hover:text-blue-600 dark:group-hover:text-gray-300 transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        {/* Fixed height description area */}
        <div className="flex-1 mb-4 min-h-[4rem]">
          <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
            Жишиг даалгавар, тайлбаруудтай.
          </p>
        </div>

        {/* Action area - fixed at bottom */}
        <div className="flex items-center justify-between pt-2 mt-auto">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Бэлэн</span>
          </div>
          <div className="text-sm text-blue-600 dark:text-gray-300 font-semibold group-hover:underline flex items-center gap-1">
            Шалгалт өгөх
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Shine effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <div className="absolute -top-1 -left-1 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </div>
    </Link>
  );
}

function Home() {
  // Getting the last 3 objects from the experiments array
  const lastThreeExperiments = experiments.slice(-3);
  const lastThreehicheel = hicheel.slice(-3);

  // Add admin panel state
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminKeys, setAdminKeys] = useState([]);

  // Add keyboard listener for "admin" sequence
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check for "ADMIN" sequence (case insensitive)
      const newKeys = [...adminKeys, event.key.toLowerCase()];
      if (newKeys.length > 5) newKeys.shift(); // Keep only last 5 keys

      setAdminKeys(newKeys);

      // Check if sequence is "admin"
      if (newKeys.join('') === 'admin') {
        setShowAdminPanel(true);
        setAdminKeys([]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [adminKeys]);

  return (
    <div className="w-full transition-colors duration-500 bg-gradient-to-b from-slate-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black relative min-h-screen z-10">
      {/* Enhanced Hero Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <EnhancedHero />
      </div>

      {/* Enhanced Experiments Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeader
          title="Шинэ туршилтууд"
          subtitle="энэ сард"
          linkText="Бүгдийг үзэх"
          linkTo="/physic"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lastThreeExperiments.map(data => (
            <EnhancedExperimentCard
              key={data.id}
              id={data.id}
              title={data.title}
              description={data.description}
              path={`/physic/experiment/${data.name}`}
            />
          ))}
        </div>
      </section>

      {/* Enhanced EYSH Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeader
          title="Шинэ ЭЕШ-ийн хичээлүүд"
          linkText="Бүгдийг үзэх"
          linkTo="/physic/EYSH_beltgel"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lastThreehicheel.map(data => (
            <EnhancedExamCard
              key={data.id}
              id={data.id}
              title={data.title}
              path={`/physic/EYSH_beltgel/${data.name}`}
            />
          ))}
        </div>
      </section>

      {/* Spacing between cards and footer */}
      <div className="h-16 sm:h-24"></div>

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}

      <Footer />
      <PhoneFooter />
    </div>
  )
}

export default Home
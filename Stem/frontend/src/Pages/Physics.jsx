import { useState } from 'react';
import { Link } from 'react-router-dom';
import PhoneHeader from '../components/Header/phoneHeader'

// Enhanced icons
const AtomIcon = () => (
  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="2" strokeWidth="1.5"/>
    <ellipse cx="12" cy="12" rx="10" ry="4.5" strokeWidth="1.5"/>
    <ellipse cx="12" cy="12" rx="4.5" ry="10" transform="rotate(60 12 12)" strokeWidth="1.5"/>
    <ellipse cx="12" cy="12" rx="4.5" ry="10" transform="rotate(-60 12 12)" strokeWidth="1.5"/>
  </svg>
);

const ExamIcon = () => (
  <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

function Physics() {
    const links=[
        { id: "1", category: "6-р анги", link: "/physic/6", icon: AtomIcon, gradient: "from-blue-500 to-cyan-500" },
        { id: "2", category: "7-р анги", link: "/physic/7", icon: AtomIcon, gradient: "from-cyan-500 to-teal-500" },
        { id: "3", category: "8-р анги", link: "/physic/8", icon: AtomIcon, gradient: "from-teal-500 to-emerald-500" },
        { id: "4", category: "9-р анги", link: "/physic/9", icon: AtomIcon, gradient: "from-emerald-500 to-green-500" },
        { id: "5", category: "10-р анги", link: "/physic/10", icon: AtomIcon, gradient: "from-green-500 to-lime-500" },
        { id: "6", category: "11-р анги", link: "/physic/11", icon: AtomIcon, gradient: "from-lime-500 to-yellow-500" },
        { id: "7", category: "ЭЕШ бэлтгэл", link: "/physic/EYSH_beltgel", icon: ExamIcon, gradient: "from-purple-500 to-pink-500" }
    ]
  return (
   <div className='min-h-screen pt-12 px-4 text-slate-900 dark:text-white transition-colors duration-500 bg-gradient-to-b from-slate-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black'>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Физик
            </h1>
            <p className="text-lg text-slate-600 dark:text-gray-400">
              Анги болон ЭЕШ-ийн бэлтгэлийн материал
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {links.map(data =>(
                <Link key={data.id} to={data.link} className="group">
                    <div className={`relative w-full h-40 rounded-3xl bg-gradient-to-br ${data.gradient} p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 overflow-hidden`}>
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
                          backgroundRepeat: 'repeat'
                        }}></div>
                      </div>
                      
                      {/* Icon */}
                      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                        <div className="mb-4 p-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                          <data.icon />
                        </div>
                        <p className="text-white font-bold text-lg group-hover:text-white/90 transition-colors duration-300">
                          {data.category}
                        </p>
                      </div>
                      
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                        <div className="absolute -top-1 -left-1 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      </div>
                    </div>
                </Link>
            ))}
          </div>
        </div>
   </div>
  )
}

export default Physics;

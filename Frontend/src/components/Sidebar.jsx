import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { label: 'Suspects', icon: 'person_search', path: '/suspects' },
  { label: 'OSINT Search', icon: 'search', path: '/osint-search' },
  { label: 'Bot Management', icon: 'smart_toy', path: '/bot-management' },
  { label: 'Legal Assistant', icon: 'gavel', path: '/legal-assistant' },
  { label: 'Report Center', icon: 'assignment', path: '/report-center' },
  { label: 'FIR Drafting', icon: 'description', path: '/fir-drafting' },
  { label: 'Admin Panel', icon: 'admin_panel_settings', path: '/admin-panel' },
];

function Sidebar({ officer }) {
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('officer');
    navigate('/');
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-30 bg-gray-900 text-white shadow-xl transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} flex flex-col justify-between border-r border-gray-800`}
    >
      {/* Top: Logo & Collapse */}
      <div>
        <div className="flex items-center justify-between px-4 py-5">
          <span className={`text-2xl font-extrabold tracking-tight text-blue-800 dark:text-blue-300 transition-all duration-300 ${collapsed ? 'hidden' : 'block'}`}>TRACE</span>
          <button
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">{collapsed ? 'chevron_right' : 'chevron_left'}</span>
          </button>
        </div>
        {/* Menu */}
        <nav className="mt-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`group flex items-center w-full px-4 py-3 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-200 ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="material-symbols-outlined text-xl mr-0 md:mr-3">{item.icon}</span>
              <span className={`transition-all duration-200 ${collapsed ? 'hidden' : 'block'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* Bottom: Profile */}
      <div className="px-4 py-5 border-t border-gray-200 dark:border-gray-800">
        <div className="relative">
          <button
            className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <span className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {officer?.name ? officer.name[0] : 'U'}
            </span>
            <div className={`text-left ${collapsed ? 'hidden' : 'block'}`}>
              <div className="font-semibold text-gray-800 dark:text-gray-100">{officer?.name || 'User'}</div>
            </div>
            <span className={`material-symbols-outlined text-gray-500 dark:text-gray-400 ml-auto ${collapsed ? 'hidden' : 'block'}`}>expand_more</span>
          </button>
          {profileOpen && !collapsed && (
            <div className="absolute left-0 bottom-14 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-40 animate-fade-in">
              <button className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</button>
              <button className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</button>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700">Logout</button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
import React, { useState } from 'react';

function Header({ officer }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <header className="w-full flex items-center justify-between px-8 py-4 bg-gray-900 text-white shadow-lg fixed top-0 left-0 z-20 transition-colors duration-200">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <span className="text-2xl font-extrabold tracking-tight text-blue-800 dark:text-blue-300">TRACE</span>
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">LAW ENFORCEMENT</span>
      </div>
      {/* Search Bar */}
      <div className="flex-1 mx-8 max-w-lg">
        <input
          type="text"
          placeholder="Search reports, suspects, ..."
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Dark mode toggle */}
        <button
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle dark mode"
        >
          {/* Sun/Moon icon placeholder */}
          <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">{darkMode ? 'dark_mode' : 'light_mode'}</span>
        </button>
        {/* Notification bell */}
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition relative" title="Notifications">
          <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        {/* User avatar */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {officer?.name ? officer.name[0] : 'U'}
            </span>
            <span className="hidden md:inline text-gray-700 dark:text-gray-200 font-medium">{officer?.name || 'User'}</span>
            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">expand_more</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-30 animate-fade-in">
              <button className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</button>
              <button className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</button>
              <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header; 
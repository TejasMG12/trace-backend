import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import apiService from '../services/api';

function OSINTSearch() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('username');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const officer = JSON.parse(localStorage.getItem('officer'));

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await apiService.getOSINTProfile(query);
      if (response.success) {
        setResult(response.data);
      }
    } catch (err) {
      setError(err.message || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 80) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return 'High Risk';
    if (score >= 60) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <div className="flex h-screen bg-gray-900 font-sans">
      <Sidebar officer={officer} />
      <div className="flex-1 ml-20 md:ml-64 min-h-screen bg-gray-900">
        <Header officer={officer} />
        <main className="pt-24 px-4 md:px-8 pb-8 transition-all duration-300 bg-gray-900">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">OSINT Search</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Open Source Intelligence gathering across multiple platforms
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-blue-600">search</span>
                Search Intelligence
              </h2>
              
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Search Type
                    </label>
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="username">Username</option>
                      <option value="phone">Phone Number</option>
                      <option value="email">Email Address</option>
                      <option value="telegram">Telegram Handle</option>
                    </select>
                  </div>

                  {/* Search Query */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Search Query
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {searchType === 'phone' ? 'phone' : searchType === 'email' ? 'mail' : 'person'}
                      </span>
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={`Enter ${searchType} to search...`}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">search</span>
                      Search Intelligence
                    </>
                  )}
                </button>
              </form>

              {/* Error Message */}
              {error && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500">error</span>
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Results */}
          {result && (
            <div className="space-y-6">
              {/* Profile Overview */}
              <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">person</span>
                    Intelligence Profile
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Basic Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Username</label>
                          <p className="text-gray-900 dark:text-white font-medium">{result.username}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Score</label>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(result.riskScore)}`}>
                              {getRiskLevel(result.riskScore)}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">({result.riskScore}/100)</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</label>
                          <p className="text-gray-900 dark:text-white">{result.location}</p>
                        </div>
                      </div>
                    </div>

                    {/* Activity Stats */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Statistics</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Seen</label>
                          <p className="text-gray-900 dark:text-white">
                            {new Date(result.activity.lastSeen).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Message Count</label>
                          <p className="text-gray-900 dark:text-white">{result.activity.messageCount.toLocaleString()}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Platforms</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.platforms.map((platform, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                                {platform}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Risk Indicators */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Indicators</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Suspicious Keywords</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.activity.suspiciousKeywords.map((keyword, index) => (
                              <span key={index} className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-xs">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Factors</label>
                          <ul className="mt-1 space-y-1">
                            {result.activity.riskIndicators.map((indicator, index) => (
                              <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                {indicator}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Linked Accounts */}
              <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-600">link</span>
                    Linked Accounts
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.linkedAccounts.map((account, index) => (
                      <div key={index} className="p-4 border border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="material-symbols-outlined text-purple-600">
                            {account.platform === 'Telegram' ? 'chat' : 
                             account.platform === 'Instagram' ? 'photo_camera' : 'phone'}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">{account.platform}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                          {account.handle || account.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Known Associations */}
              <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-600">group</span>
                    Known Associations
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {result.associations.map((association, index) => (
                      <span key={index} className="px-3 py-2 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-medium">
                        {association}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200">
                  <span className="material-symbols-outlined">person_add</span>
                  Add as Suspect
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200">
                  <span className="material-symbols-outlined">description</span>
                  Generate Report
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200">
                  <span className="material-symbols-outlined">smart_toy</span>
                  Launch Bot
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200">
                  <span className="material-symbols-outlined">download</span>
                  Export Data
                </button>
              </div>
            </div>
          )}

          {/* No Results State */}
          {!loading && !result && !error && (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">search</span>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Ready to Search
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Enter a username, phone number, or email to begin OSINT analysis
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default OSINTSearch;
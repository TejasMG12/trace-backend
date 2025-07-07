import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import apiService from '../services/api';

function SuspectList() {
  const [suspects, setSuspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    platform: '',
    riskLevel: '',
    status: '',
    search: ''
  });
  const [selectedSuspects, setSelectedSuspects] = useState([]);
  const officer = JSON.parse(localStorage.getItem('officer'));
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState({ name: '', aliases: '', platforms: '' });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    loadSuspects();
  }, []);

  const loadSuspects = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSuspects(filters);
      if (response.success) {
        setSuspects(response.data);
      }
    } catch (error) {
      console.error('Error loading suspects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const filteredSuspects = suspects.filter((suspect) => {
    const matchesSearch = !filters.search || 
      suspect.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      suspect.aliases?.some(alias => alias.toLowerCase().includes(filters.search.toLowerCase())) ||
      suspect.location.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesPlatform = !filters.platform || suspect.platforms.includes(filters.platform);
    const matchesRisk = !filters.riskLevel || suspect.riskLevel === filters.riskLevel;
    const matchesStatus = !filters.status || suspect.status === filters.status;

    return matchesSearch && matchesPlatform && matchesRisk && matchesStatus;
  });

  const handleSelectSuspect = (suspectId) => {
    setSelectedSuspects(prev => 
      prev.includes(suspectId) 
        ? prev.filter(id => id !== suspectId)
        : [...prev, suspectId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSuspects.length === filteredSuspects.length) {
      setSelectedSuspects([]);
    } else {
      setSelectedSuspects(filteredSuspects.map(s => s.id));
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Monitored': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const handleCreateSuspect = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    try {
      const payload = {
        name: createData.name,
        aliases: createData.aliases.split(',').map(a => a.trim()).filter(Boolean),
        platforms: createData.platforms.split(',').map(p => p.trim()).filter(Boolean),
      };
      const response = await apiService.createSuspect(payload);
      if (response.success) {
        setShowCreate(false);
        setCreateData({ name: '', aliases: '', platforms: '' });
        loadSuspects();
      }
    } catch {
      setCreateError('Failed to create suspect.');
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900 font-sans">
        <Sidebar officer={officer} />
        <div className="flex-1 ml-20 md:ml-64 min-h-screen bg-gray-900">
          <Header officer={officer} />
          <main className="pt-24 px-4 md:px-8 pb-8">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg text-gray-600 dark:text-gray-400">Loading Suspects...</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 font-sans">
      <Sidebar officer={officer} />
      <div className="flex-1 ml-20 md:ml-64 min-h-screen bg-gray-900">
        <Header officer={officer} />
        <main className="pt-24 px-4 md:px-8 pb-8 transition-all duration-300 bg-gray-900">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Suspect Management</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track and manage all suspects under investigation
              </p>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
              onClick={() => setShowCreate(true)}
            >
              <span className="material-symbols-outlined">person_add</span>
              Add Suspect
            </button>
          </div>

          {/* Create Suspect Modal */}
          {showCreate && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Suspect</h2>
                <form onSubmit={handleCreateSuspect} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input
                      type="text"
                      value={createData.name}
                      onChange={e => setCreateData({ ...createData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aliases (comma separated)</label>
                    <input
                      type="text"
                      value={createData.aliases}
                      onChange={e => setCreateData({ ...createData, aliases: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Platforms (comma separated)</label>
                    <input
                      type="text"
                      value={createData.platforms}
                      onChange={e => setCreateData({ ...createData, platforms: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  {createError && <div className="text-red-600 text-sm">{createError}</div>}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      onClick={() => setShowCreate(false)}
                      disabled={createLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                      disabled={createLoading}
                    >
                      {createLoading ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 mb-6">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-blue-600">filter_alt</span>
                Search & Filters
              </h2>
              
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name, alias, or location..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform</label>
                  <select
                    value={filters.platform}
                    onChange={(e) => handleFilterChange('platform', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Platforms</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Instagram">Instagram</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Risk Level</label>
                  <select
                    value={filters.riskLevel}
                    onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Risk Levels</option>
                    <option value="High">High Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="Low">Low Risk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Monitored">Monitored</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={loadSuspects}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredSuspects.length} suspect{filteredSuspects.length !== 1 ? 's' : ''} found
              </span>
              {selectedSuspects.length > 0 && (
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  {selectedSuspects.length} selected
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedSuspects.length > 0 && (
                <>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Generate Report
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                    Delete Selected
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Suspects Table */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedSuspects.length === filteredSuspects.length && filteredSuspects.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Suspect</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Platforms</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Risk Level</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Last Seen</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSuspects.map((suspect) => (
                    <tr key={suspect.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedSuspects.includes(suspect.id)}
                          onChange={() => handleSelectSuspect(suspect.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">person</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{suspect.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {suspect.aliases?.slice(0, 2).join(', ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {suspect.platforms?.map((platform, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                              {platform}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(suspect.riskLevel)}`}>
                          {suspect.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(suspect.status)}`}>
                          {suspect.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {suspect.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(suspect.lastSeen).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/suspect/${suspect.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                            title="View Profile"
                          >
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/20 rounded-lg transition-colors duration-200"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredSuspects.length === 0 && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-4xl text-gray-400 mb-4">search_off</span>
                <p className="text-gray-500 dark:text-gray-400">No suspects found matching your criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default SuspectList;
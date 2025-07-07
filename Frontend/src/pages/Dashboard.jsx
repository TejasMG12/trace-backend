import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import apiService from '../services/api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [officer] = useState(JSON.parse(localStorage.getItem('officer')));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suspects, setSuspects] = useState([]);
  const [filteredSuspects, setFilteredSuspects] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    riskLevel: 'all',
    platform: 'all',
    status: 'all'
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createData, setCreateData] = useState({
    name: '',
    aliases: '',
    platforms: ''
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsResponse, suspectsResponse] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getSuspects()
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (suspectsResponse.success) {
          setSuspects(suspectsResponse.data);
          setFilteredSuspects(suspectsResponse.data);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Filter suspects based on current filters
  useEffect(() => {
    let filtered = suspects;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(suspect =>
        suspect.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        suspect.aliases?.some(alias => alias.toLowerCase().includes(filters.search.toLowerCase())) ||
        suspect.phone?.includes(filters.search)
      );
    }

    // Risk level filter
    if (filters.riskLevel !== 'all') {
      filtered = filtered.filter(suspect => suspect.riskLevel === filters.riskLevel);
    }

    // Platform filter
    if (filters.platform !== 'all') {
      filtered = filtered.filter(suspect => 
        suspect.platforms?.some(platform => platform.toLowerCase() === filters.platform.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(suspect => suspect.status.toLowerCase() === filters.status.toLowerCase());
    }

    setFilteredSuspects(filtered);
  }, [suspects, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      riskLevel: 'all',
      platform: 'all',
      status: 'all'
    });
  };

  const loadDashboardData = async () => {
    try {
      const [statsResponse, suspectsResponse] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getSuspects()
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (suspectsResponse.success) {
        setSuspects(suspectsResponse.data);
        setFilteredSuspects(suspectsResponse.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
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
        setShowCreateModal(false);
        setCreateData({ name: '', aliases: '', platforms: '' });
        loadDashboardData(); // Refresh the data
      }
    } catch {
      setCreateError('Failed to create suspect.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const StatCard = ({ title, value, icon, color, change, subtitle }) => (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
          <span className={`material-symbols-outlined text-2xl text-${color}-600 dark:text-${color}-400`}>
            {icon}
          </span>
        </div>
      </div>
      {change && (
        <div className="mt-3 flex items-center">
          <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">from last week</span>
        </div>
      )}
    </div>
  );

  const SuspectItem = ({ suspect, index }) => (
    <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors duration-200 ${
      index === 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/20'
    }`}>
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {suspect.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {suspect.name}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            suspect.riskLevel === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
            suspect.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
            'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          }`}>
            {suspect.riskLevel} Risk
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {suspect.phone} • {suspect.platforms?.join(', ')}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Last seen: {new Date(suspect.lastSeen || Date.now()).toLocaleDateString()}
        </p>
      </div>
    </div>
  );

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
                <span className="text-lg text-gray-600 dark:text-gray-400">Loading Dashboard...</span>
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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {officer?.name?.split(' ')[1] || 'Officer'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your cases today
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Suspects"
              value={suspects.length}
              icon="person_search"
              color="blue"
              change={12}
              subtitle="Under investigation"
            />
            <StatCard
              title="Active Cases"
              value={suspects.filter(s => s.status === 'Active').length}
              icon="security"
              color="red"
              change={-5}
              subtitle="Currently monitored"
            />
            <StatCard
              title="High Risk"
              value={suspects.filter(s => s.riskLevel === 'High').length}
              icon="warning"
              color="amber"
              change={8}
              subtitle="Requires attention"
            />
            <StatCard
              title="Active Bots"
              value={stats?.activeBots || 0}
              icon="smart_toy"
              color="green"
              change={2}
              subtitle="Undercover operations"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Recent Suspects with Filters */}
            <div className="lg:col-span-2 bg-gray-800 rounded-xl shadow-lg border border-gray-700/50">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">person_search</span>
                    Recent Suspects
                  </h2>
                  <button 
                    onClick={() => navigate('/suspects')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All
                  </button>
                </div>
                
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="Search suspects..."
                      value={filters.search}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={filters.riskLevel}
                    onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                    className="px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Risk Levels</option>
                    <option value="High">High Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="Low">Low Risk</option>
                  </select>
                  
                  <select
                    value={filters.platform}
                    onChange={(e) => handleFilterChange('platform', e.target.value)}
                    className="px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Platforms</option>
                    <option value="Telegram">Telegram</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                  
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Monitored">Monitored</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                {/* Clear Filters */}
                {(filters.search || filters.riskLevel || filters.platform || filters.status) && (
                  <div className="mb-4">
                    <button
                      onClick={clearFilters}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">clear</span>
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="space-y-2">
                  {filteredSuspects.slice(0, 5).map((suspect, index) => (
                    <SuspectItem key={suspect.id} suspect={suspect} index={index} />
                  ))}
                  
                  {filteredSuspects.length === 0 && (
                    <div className="text-center py-8">
                      <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">search_off</span>
                      <p className="text-gray-500 dark:text-gray-400">No suspects found</p>
                    </div>
                  )}
                  
                  {filteredSuspects.length > 5 && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => navigate('/suspects')}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View {filteredSuspects.length - 5} more suspects
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600">bolt</span>
                  Quick Actions
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors duration-200"
                  >
                    <span className="material-symbols-outlined text-blue-600">person_add</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Add New Suspect
                    </span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/osint')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors duration-200"
                  >
                    <span className="material-symbols-outlined text-green-600">search</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      OSINT Search
                    </span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/bots')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors duration-200"
                  >
                    <span className="material-symbols-outlined text-purple-600">smart_toy</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Launch Bot
                    </span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/reports')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors duration-200"
                  >
                    <span className="material-symbols-outlined text-amber-600">description</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Generate Report
                    </span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/legal')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors duration-200"
                  >
                    <span className="material-symbols-outlined text-red-600">gavel</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Legal Assistant
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Map and Reports Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Location Map */}
            <div className="lg:col-span-2 bg-gray-800 rounded-xl shadow-lg border border-gray-700/50">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600">map</span>
                  Suspect Locations
                </h2>
              </div>
              <div className="p-6">
                <MapContainer 
                  center={[20.5937, 78.9629]} 
                  zoom={5} 
                  style={{ height: '300px', width: '100%' }} 
                  className="rounded-lg overflow-hidden"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {suspects.map((suspect, index) => (
                    <Marker 
                      key={suspect._id} 
                      position={[suspect.location?.lat || 20.5937 + index * 0.1, suspect.location?.lng || 78.9629 + index * 0.1]}
                    >
                      <Popup>
                        <div className="text-center">
                          <h3 className="font-semibold text-gray-900">{suspect.name}</h3>
                          <p className="text-sm text-gray-600">{suspect.riskLevel} Risk</p>
                          <p className="text-xs text-gray-500">{suspect.status}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-600">description</span>
                    Recent Reports
                  </h2>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { id: '102810', title: 'Ravi Kumar Investigation', progress: 87, status: 'In Progress' },
                    { id: '101297', title: 'Sneha Patel Analysis', progress: 62, status: 'Pending Review' },
                    { id: '102431', title: 'Vikram Singh Monitoring', progress: 91, status: 'Completed' }
                  ].map((report) => (
                    <div key={report.id} className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {report.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          report.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              report.progress > 80 ? 'bg-green-500' :
                              report.progress > 60 ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`}
                            style={{ width: `${report.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {report.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Suspect Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
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
                />
              </div>
              
              {createError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{createError}</p>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {createLoading ? 'Creating...' : 'Create Suspect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
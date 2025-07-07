import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import apiService from '../services/api';

function SuspectProfile() {
  const [suspect, setSuspect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const officer = JSON.parse(localStorage.getItem('officer'));
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchSuspect = async () => {
      try {
        setLoading(true);
        const response = await apiService.getSuspect(id);
        if (response.success) {
          setSuspect(response.data);
        }
      } catch (err) {
        setError('Failed to load suspect profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchSuspect();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900 font-sans">
        <Sidebar officer={officer} />
        <main className="flex-1 ml-64 p-6 overflow-auto flex items-center justify-center">
          <div className="text-lg text-gray-600">Loading...</div>
        </main>
      </div>
    );
  }

  if (error || !suspect) {
    return (
      <div className="flex h-screen bg-gray-900 font-sans">
        <Sidebar officer={officer} />
        <main className="flex-1 ml-64 p-6 overflow-auto flex items-center justify-center">
          <div className="text-lg text-red-600">{error || 'Suspect not found.'}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 font-sans">
      <Sidebar officer={officer} />
      <main className="flex-1 ml-64 p-6 overflow-auto pt-24 bg-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{suspect.name}</h1>
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Suspect Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong className="text-gray-900 dark:text-white">Aliases:</strong> <span className="text-gray-700 dark:text-gray-300">{suspect.aliases?.join(', ') || 'None'}</span>
            </div>
            <div>
              <strong className="text-gray-900 dark:text-white">Platforms:</strong> <span className="text-gray-700 dark:text-gray-300">{suspect.platforms?.join(', ') || 'None'}</span>
            </div>
            <div>
              <strong className="text-gray-900 dark:text-white">Status:</strong> <span className="text-gray-700 dark:text-gray-300">{suspect.status}</span>
            </div>
            <div>
              <strong className="text-gray-900 dark:text-white">Risk Level:</strong> <span className="text-gray-700 dark:text-gray-300">{suspect.riskLevel}</span>
            </div>
            <div>
              <strong className="text-gray-900 dark:text-white">Last Seen:</strong> <span className="text-gray-700 dark:text-gray-300">{new Date(suspect.lastSeen).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SuspectProfile;
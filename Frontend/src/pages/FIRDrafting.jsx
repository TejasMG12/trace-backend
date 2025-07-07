import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

function FIRDrafting() {
  const [firData, setFIRData] = useState({
    incident: 'Drug trafficking observed at Mumbai.',
    suspect: 'Ravi Kumar',
    date: '2025-07-05',
    location: 'Mumbai',
    sections: 'IPC 120B, NDPS Act 21',
  });
  const officer = JSON.parse(localStorage.getItem('officer'));

  const handleChange = (e) => {
    setFIRData({ ...firData, [e.target.name]: e.target.value });
  };

  const handleExport = () => {
    alert('PDF exported! (Simulated)');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar officer={officer} />
      <main className="flex-1 ml-64 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">FIR Drafting</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Incident</label>
              <textarea
                name="incident"
                value={firData.incident}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Suspect</label>
              <input
                name="suspect"
                value={firData.suspect}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                name="date"
                type="date"
                value={firData.date}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                name="location"
                value={firData.location}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sections</label>
              <input
                name="sections"
                value={firData.sections}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleExport}
              className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition duration-200"
            >
              Export to PDF
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default FIRDrafting;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function LegalAssistant() {
  const [crimeDescription, setCrimeDescription] = useState('');
  const [result, setResult] = useState(null);
  const officer = JSON.parse(localStorage.getItem('officer'));
  const navigate = useNavigate();

  const handleAnalyze = (e) => {
    e.preventDefault();
    setResult({
      ipcSections: ['IPC 120B', 'IPC 379'],
      ndpsSections: ['NDPS Act 21'],
      punishment: '7-10 years imprisonment',
      summary: 'Conspiracy and theft involved in drug trafficking.',
    });
  };

  return (
    <div className="flex h-screen bg-gray-900 font-sans">
      <Sidebar officer={officer} />
      <main className="flex-1 ml-64 p-6 overflow-auto pt-24 bg-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Legal Assistant</h1>
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Legal Research</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Research legal precedents and case law.
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Document Drafting</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Draft legal documents and affidavits.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Crime Description</label>
              <textarea
                value={crimeDescription}
                onChange={(e) => setCrimeDescription(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Describe the crime..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white p-3 rounded-md hover:bg-blue-800 transition duration-200"
            >
              Analyze
            </button>
          </form>
        </div>
        {result && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Analysis Result</h2>
            <p className="text-gray-700"><strong>IPC Sections:</strong> {result.ipcSections.join(', ')}</p>
            <p className="text-gray-700"><strong>NDPS Sections:</strong> {result.ndpsSections.join(', ')}</p>
            <p className="text-gray-700"><strong>Punishment:</strong> {result.punishment}</p>
            <p className="text-gray-700"><strong>Summary:</strong> {result.summary}</p>
            <button
              onClick={() => navigate('/fir-drafting')}
              className="mt-4 w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition duration-200"
            >
              Generate FIR
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default LegalAssistant;
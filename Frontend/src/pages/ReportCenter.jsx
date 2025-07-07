import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const dummyReports = [
  { id: 'R001', date: '2025-07-04', suspect: 'Ravi Kumar', url: '#' },
  { id: 'R002', date: '2025-07-03', suspect: 'Sneha Patel', url: '#' },
];

function ReportCenter() {
  const [dateFilter, setDateFilter] = useState('');
  const [suspectFilter, setSuspectFilter] = useState('');
  const officer = JSON.parse(localStorage.getItem('officer'));

  const filteredReports = dummyReports.filter((report) => {
    return (
      (dateFilter ? report.date.includes(dateFilter) : true) &&
      (suspectFilter ? report.suspect.includes(suspectFilter) : true)
    );
  });

  return (
    <div className="flex h-screen bg-gray-900 font-sans">
      <Sidebar officer={officer} />
      <main className="flex-1 ml-64 p-6 overflow-auto pt-24 bg-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Report Center</h1>
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Generate Reports</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create comprehensive reports for investigations.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Suspect</label>
              <input
                type="text"
                value={suspectFilter}
                onChange={(e) => setSuspectFilter(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter suspect name"
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Report History</h2>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage previously generated reports.
          </p>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left text-gray-800">Report ID</th>
                <th className="p-3 text-left text-gray-800">Date</th>
                <th className="p-3 text-left text-gray-800">Suspect</th>
                <th className="p-3 text-left text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-t">
                  <td className="p-3 text-gray-700">{report.id}</td>
                  <td className="p-3 text-gray-700">{report.date}</td>
                  <td className="p-3 text-gray-700">{report.suspect}</td>
                  <td className="p-3">
                    <a href={report.url} className="text-blue-600 hover:underline">Download</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default ReportCenter;
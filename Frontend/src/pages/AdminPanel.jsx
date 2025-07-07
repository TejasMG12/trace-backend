import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const dummyOfficers = [
  { id: 1, name: 'Ajay Sharma', role: 'Inspector', status: 'Active' },
  { id: 2, name: 'Priya Desai', role: 'Analyst', status: 'Active' },
];

const dummyLogs = [
  { id: 1, action: 'Added suspect', time: '2025-07-05 14:00', user: 'Ajay Sharma' },
];

function AdminPanel() {
  const officer = JSON.parse(localStorage.getItem('officer'));

  return (
    <div className="flex h-screen bg-gray-900 font-sans">
      <Sidebar officer={officer} />
      <main className="flex-1 ml-64 p-6 overflow-auto pt-24 bg-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Admin Panel</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Manage Officers</h2>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left text-gray-800">Name</th>
                  <th className="p-3 text-left text-gray-800">Role</th>
                  <th className="p-3 text-left text-gray-800">Status</th>
                </tr>
              </thead>
              <tbody>
                {dummyOfficers.map((officer) => (
                  <tr key={officer.id} className="border-t">
                    <td className="p-3 text-gray-700">{officer.name}</td>
                    <td className="p-3 text-gray-700">{officer.role}</td>
                    <td className="p-3 text-gray-700">{officer.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Audit Logs</h2>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left text-gray-800">Action</th>
                  <th className="p-3 text-left text-gray-800">Time</th>
                  <th className="p-3 text-left text-gray-800">User</th>
                </tr>
              </thead>
              <tbody>
                {dummyLogs.map((log) => (
                  <tr key={log.id} className="border-t">
                    <td className="p-3 text-gray-700">{log.action}</td>
                    <td className="p-3 text-gray-700">{log.time}</td>
                    <td className="p-3 text-gray-700">{log.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;
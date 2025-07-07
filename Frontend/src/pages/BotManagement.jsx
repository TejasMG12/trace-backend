import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function BotManagement() {
  const [persona, setPersona] = useState('');
  const [prompt, setPrompt] = useState('');
  const [bots, setBots] = useState([{ id: 1, persona: 'Undercover Buyer', status: 'Active', conversation: 'Hello, interested in a deal?' }]);
  const officer = JSON.parse(localStorage.getItem('officer'));

  const handleLaunch = (e) => {
    e.preventDefault();
    setBots([...bots, { id: bots.length + 1, persona, status: 'Active', conversation: 'Bot launched with prompt: ' + prompt }]);
    setPersona('');
    setPrompt('');
  };

  const handleStop = (id) => {
    setBots(bots.map(bot => bot.id === id ? { ...bot, status: 'Stopped' } : bot));
  };

  return (
    <div className="flex h-screen bg-gray-900 font-sans">
      <Sidebar officer={officer} />
      <main className="flex-1 ml-64 p-6 overflow-auto pt-24 bg-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Bot Management</h1>
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Active Bots</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and control undercover bot operations.
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700/50 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Bot Configuration</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Configure bot behavior and deployment settings.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Launch Bot</h2>
          <form onSubmit={handleLaunch} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Persona</label>
              <input
                type="text"
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Undercover Buyer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prompt</label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Ask about deals"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white p-3 rounded-md hover:bg-blue-800 transition duration-200"
            >
              Launch Bot
            </button>
          </form>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Active Bots</h2>
          {bots.map((bot) => (
            <div key={bot.id} className="mb-4 p-4 border rounded-lg bg-gray-50">
              <p className="text-gray-700"><strong>Persona:</strong> {bot.persona}</p>
              <p className="text-gray-700"><strong>Status:</strong> {bot.status}</p>
              <p className="text-gray-700"><strong>Conversation:</strong> {bot.conversation}</p>
              <button
                onClick={() => handleStop(bot.id)}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Stop Bot
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default BotManagement;
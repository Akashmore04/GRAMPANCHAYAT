import React, { useState } from 'react';
import { ShieldCheck, Users } from 'lucide-react';

export default function AuthPortal({ onLogin }) {
  const [role, setRole] = useState('citizen');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const trimmedId = userId.trim();
    const cleanPassword = password.trim().toLowerCase();

    if (!trimmedId || !cleanPassword) {
      setError('Please fill in all fields.');
      return;
    }
    
    // Mock validation
    if (role === 'official' && cleanPassword !== 'admin123') {
      setError('Invalid official credentials. (Hint: admin123)');
      return;
    }
    if (role === 'citizen' && cleanPassword !== 'citizen123') {
      setError('Invalid citizen credentials. (Hint: citizen123)');
      return;
    }
    
    setError('');
    onLogin(role);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mt-10">
      <div className="bg-brand-blue text-white p-6 text-center">
        <h2 className="text-2xl font-semibold">Portal Login</h2>
        <p className="text-blue-200 text-sm mt-2">Select your role to continue</p>
      </div>
      
      <div className="p-6">
        <div className="flex gap-4 mb-8">
          <button 
            type="button"
            onClick={() => setRole('citizen')}
            className={`flex-1 flex flex-col items-center p-4 rounded-lg border-2 transition-all ${role === 'citizen' ? 'border-brand-green bg-green-50 text-brand-green' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
          >
            <Users size={24} className="mb-2" />
            <span className="font-medium">Citizen</span>
          </button>
          <button 
            type="button"
            onClick={() => setRole('official')}
            className={`flex-1 flex flex-col items-center p-4 rounded-lg border-2 transition-all ${role === 'official' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
          >
            <ShieldCheck size={24} className="mb-2" />
            <span className="font-medium">Official</span>
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded text-sm border border-red-200">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {role === 'citizen' ? 'Aadhar / Voter ID' : 'Official ID'}
            </label>
            <input 
              type="text" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
              placeholder="Enter your ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
              placeholder="Enter password"
            />
          </div>
          
          <button type="submit" className="w-full bg-brand-green hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors shadow-sm">
            Login Securely
          </button>
        </form>
      </div>
    </div>
  );
}

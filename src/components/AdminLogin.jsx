import React, { useState } from 'react';
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'sarpanch@phuleragov.in' && password === 'panchayat2026') {
      onLogin(true);
    } else {
      setError('Invalid official credentials. Access denied.');
    }
  };

  return (
    <div className="flex items-center justify-center py-20 animate-in zoom-in-95 duration-500">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">
        
        <div className="p-8 text-center bg-slate-900/50 border-b border-slate-700">
          <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
            <Shield className="text-teal-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">Administration Login</h2>
          <p className="text-slate-400 text-sm mt-2">Secure access for Panchayat Officials only</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Official Email</label>
            <input 
              required 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-4 py-3 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" 
              placeholder="Enter official email" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Master Password</label>
            <div className="relative flex items-center">
              <input 
                required 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg pl-4 pr-11 py-3 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" 
                placeholder="••••••••" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-slate-400 hover:text-teal-400 focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-teal-500/20">
            Secure Login <ArrowRight size={18} />
          </button>

        </form>

        <div className="bg-slate-900/80 p-4 border-t border-slate-700 text-center">
          <p className="text-xs text-slate-500 font-mono">
            Demo Credentials: <br/> Email: sarpanch@phuleragov.in | Pass: panchayat2026
          </p>
        </div>
      </div>
    </div>
  );
}

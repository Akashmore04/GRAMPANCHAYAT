import React, { useState } from 'react';
import { Landmark, AlertTriangle, ShieldCheck, Menu, X, Shield } from 'lucide-react';

export default function Navbar({ currentView, setView, isAdminLoggedIn }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'expenses', label: 'Where Money Goes' },
    { id: 'works', label: 'Works & Records' },
    { id: 'plans', label: 'Upcoming Plans' },
  ];

  const handleNavClick = (id) => {
    setView(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Left: Logo & Branding */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('overview')}>
            <div className="bg-teal-500/10 p-2 rounded-lg">
              <Landmark className="text-teal-400" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">Phulera Gram Panchayat</h1>
              <span className="text-xs font-semibold tracking-wider text-teal-400 uppercase bg-teal-500/10 px-2 py-0.5 rounded-full mt-0.5 inline-block border border-teal-500/20">Official</span>
            </div>
          </div>

          {/* Center: Navigation Links (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === link.id 
                    ? 'bg-slate-800 text-teal-400 shadow-inner' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => handleNavClick('grievance')}
              className={`flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentView === 'grievance'
                  ? 'bg-yellow-500/25 text-yellow-300 border-yellow-500'
                  : 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
              }`}
            >
              <AlertTriangle size={16} /> Report a Problem
            </button>
            
            <button 
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                isAdminLoggedIn
                  ? currentView === 'admin'
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                    : 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border-teal-500/30'
                  : currentView === 'admin'
                    ? 'bg-slate-800 text-white border-slate-600'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {isAdminLoggedIn ? <Shield size={16} className="text-teal-400" /> : <ShieldCheck size={16} />}
              {isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Login'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === link.id ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button 
              onClick={() => handleNavClick('grievance')}
              className="w-full flex items-center justify-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 px-4 py-2.5 rounded-lg text-sm font-semibold"
            >
              <AlertTriangle size={16} /> Report a Problem
            </button>
            <button 
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium"
            >
              {isAdminLoggedIn ? <Shield size={16} className="text-teal-400" /> : <ShieldCheck size={16} />}
              {isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Login'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

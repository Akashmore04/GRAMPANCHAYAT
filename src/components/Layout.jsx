import React from 'react';
import { User, LogOut, FileText, AlertTriangle, LayoutDashboard } from 'lucide-react';

export default function Layout({ children, role, onLogout, setView }) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      {/* Header */}
      <header className="bg-brand-blue text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Gov Logo" className="w-8 h-10 filter invert brightness-0" />
            <h1 className="text-2xl font-bold tracking-tight">Gram Panchayat Transparency Portal</h1>
          </div>
          {role && (
            <div className="flex items-center gap-6">
              <nav className="flex gap-4">
                {role === 'citizen' && (
                  <>
                    <button onClick={() => setView('dashboard')} className="flex items-center gap-2 hover:text-green-300 transition-colors">
                      <LayoutDashboard size={18} /> Dashboard
                    </button>
                    <button onClick={() => setView('grievance')} className="flex items-center gap-2 hover:text-green-300 transition-colors">
                      <AlertTriangle size={18} /> Grievances
                    </button>
                  </>
                )}
                {role === 'official' && (
                  <button onClick={() => setView('dashboard')} className="flex items-center gap-2 hover:text-green-300 transition-colors">
                    <FileText size={18} /> Official Dashboard
                  </button>
                )}
              </nav>
              <div className="flex items-center gap-4 border-l border-blue-700 pl-6">
                <div className="flex items-center gap-2 text-sm">
                  <User size={16} />
                  <span>{role === 'citizen' ? 'Citizen View' : 'Official View'}</span>
                </div>
                <button onClick={onLogout} className="flex items-center gap-1 text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
        <p>&copy; 2026 Gram Panchayat Administration. All Rights Reserved.</p>
        <p className="mt-1">Dedicated to transparency and citizen welfare.</p>
      </footer>
    </div>
  );
}

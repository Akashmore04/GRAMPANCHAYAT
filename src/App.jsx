import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroOverview from './components/HeroOverview';
import ExpenseBreakdown from './components/ExpenseBreakdown';
import WorksRecords from './components/WorksRecords';
import UpcomingPlans from './components/UpcomingPlans';
import GrievancePortal from './components/GrievancePortal';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  // view: 'overview' | 'expenses' | 'works' | 'plans' | 'grievance' | 'admin'
  const [view, setView] = useState('overview');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('phulera_admin_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    try {
      localStorage.setItem('phulera_admin_logged_in', 'true');
    } catch (err) {
      console.error(err);
    }
    setView('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('phulera_admin_logged_in');
    } catch (err) {
      console.error(err);
    }
    setView('overview');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200 font-sans selection:bg-teal-500/30">
      <Navbar currentView={view} setView={setView} isAdminLoggedIn={isAdminLoggedIn} />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {view === 'overview' && <HeroOverview />}
        {view === 'expenses' && <ExpenseBreakdown />}
        {view === 'works' && <WorksRecords />}
        {view === 'plans' && <UpcomingPlans />}
        {view === 'grievance' && <GrievancePortal />}
        {view === 'admin' && (
          !isAdminLoggedIn ? (
            <AdminLogin onLogin={handleAdminLogin} />
          ) : (
            <AdminDashboard 
              onLogout={handleAdminLogout} 
              onNavigateCitizenView={() => setView('grievance')} 
            />
          )
        )}
      </main>

      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>&copy; 2026 Phulera Gram Panchayat Administration. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;

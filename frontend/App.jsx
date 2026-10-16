import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import { api } from './api';
import { 
  Landmark, 
  AlertTriangle, 
  Shield, 
  ShieldCheck, 
  IndianRupee, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  MessageSquare, 
  MapPin, 
  Calendar, 
  Image as ImageIcon, 
  LogOut, 
  Sparkles, 
  RefreshCw, 
  Search, 
  PlusCircle, 
  Save, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Menu, 
  X, 
  Upload, 
  FileText, 
  ListFilter, 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  Tag, 
  Eye, 
  EyeOff, 
  ArrowRight,
  FolderPlus
} from 'lucide-react';

// Default Categories
const DEFAULT_CATEGORIES = [
  'Gram Sadak Yojana',
  'School Maintenance',
  'Water Tank Construction',
  'Street Lights',
  'Drainage/Sewage',
  'Panchayat Building Renovation',
  'Public Toilet',
  'Health Camp',
  'Tree Plantation',
  'Cleanliness Campaign'
];

const DEFAULT_COMPLAINT_CATEGORIES = [
  'Garbage Not Collected',
  'Air/Noise/Water Pollution',
  'Drainage or Sewage Problems',
  'Public Sanitation Issues',
  'Water Contamination',
  'Industrial/Environmental Violations'
];

// Initial Seed Expenses for immediate display & fallback
const INITIAL_SEED_EXPENSES = [
  { id: 1, title: 'Main Road Phase 1 Paving', category: 'Gram Sadak Yojana', amount: 450000, date: '2026-08-15', vendor: 'Shree Constructions', receipt_no: 'INV-4022', description: 'Bitumen and gravel paving of 1.2km connecting link to main highway.', project: 'Main Road Phase 1', status: 'Paid' },
  { id: 2, title: 'Primary School Roof & Wall Repair', category: 'School Maintenance', amount: 85000, date: '2026-08-10', vendor: 'Local Builders Co.', receipt_no: 'INV-4010', description: 'Waterproofing of classroom ceilings and wall plastering before monsoon.', project: 'Primary School Renovation', status: 'Paid' },
  { id: 3, title: 'Village Water Tank Construction (Phase 1)', category: 'Water Tank Construction', amount: 250000, date: '2026-08-05', vendor: 'JalTech Solutions', receipt_no: 'INV-3998', description: 'Excavation, foundation, and RCC pillar structure for 20,000L overhead water tank.', project: 'Water Tank Construction', status: 'Paid' },
  { id: 4, title: 'Solar Street Lights (50 Units)', category: 'Street Lights', amount: 125000, date: '2026-08-01', vendor: 'Laxmi Electricals', receipt_no: 'INV-3985', description: 'Supply and installation of 50 standalone solar LED street light fixtures in Ward 1-4.', project: 'Street Light Project', status: 'Paid' },
  { id: 5, title: 'Central Market Drainage Canal Desilting', category: 'Drainage/Sewage', amount: 95000, date: '2026-07-25', vendor: 'Panchayat Sanitation Crew', receipt_no: 'INV-3970', description: 'Cleaning and desilting 800m open drainage canal along the vegetable market.', project: 'Market Sanitation', status: 'Paid' },
  { id: 6, title: 'Panchayat Office WiFi & Solar Inverter', category: 'Panchayat Building Renovation', amount: 45000, date: '2026-07-20', vendor: 'BharatNet & MicroTech', receipt_no: 'INV-3952', description: 'High-speed broadband optical fiber setup and 2kVA backup solar inverter.', project: 'Panchayat Digital Center', status: 'Paid' },
  { id: 7, title: 'Community Toilet Complex Door & Plumbing Fixes', category: 'Public Toilet', amount: 35000, date: '2026-07-15', vendor: 'Janta Plumbers', receipt_no: 'INV-3940', description: 'Replaced 4 broken PVC doors, installed brass bib taps and overhead PVC storage tank.', project: 'Swachh Village', status: 'Paid' },
  { id: 8, title: 'Monsoon Health & Vaccination Camp', category: 'Health Camp', amount: 65000, date: '2026-07-10', vendor: 'District PHC Medical Team', receipt_no: 'INV-3925', description: 'Free health checkups, blood tests, iron supplements, and water purification tablets.', project: 'Aarogya Gram', status: 'Paid' },
  { id: 9, title: 'Green Belt Tree Plantation (500 Saplings)', category: 'Tree Plantation', amount: 40000, date: '2026-07-05', vendor: 'Forest Dept Nursery', receipt_no: 'INV-3910', description: 'Neem, Peepal, and Banyan saplings along canal banks with bamboo tree guards.', project: 'Harit Phulera', status: 'Paid' },
  { id: 10, title: 'Village Cleanliness Drive & 20 Steel Dustbins', category: 'Cleanliness Campaign', amount: 50000, date: '2026-07-01', vendor: 'Swachh Equipments Ltd', receipt_no: 'INV-3890', description: 'Purchased community color-coded waste bins and protective gear for 8 sanitary workers.', project: 'Swachh Village', status: 'Paid' }
];

// Initial Seed Complaints
const INITIAL_SEED_COMPLAINTS = [
  { id: 1, tracking_id: 'GRV-101', title: 'Severe pipeline leakage and muddy water in Ward 4', category: 'Water Contamination', location: 'Ward 4, Near Primary Health Center', priority: 'Critical', date: '2026-08-20', description: 'Drinking water pipeline broke underground near the clinic. Water is discolored and smelling foul, posing an immediate health hazard to 80+ families.', status: 'In Progress', image: null, response: 'Emergency plumbing crew dispatched. Main valve closed for sanitization and pipe replacement underway.' },
  { id: 2, tracking_id: 'GRV-102', title: 'Major sewage overflow onto main market walkway', category: 'Drainage or Sewage Problems', location: 'Main Bazaar Road, Block B', priority: 'High', date: '2026-08-19', description: 'The open drain has choked completely after morning rains. Sewage is overflowing onto shopfronts and pedestrian walkway.', status: 'Pending', image: null, response: null },
  { id: 3, tracking_id: 'GRV-103', title: 'Unattended waste dump near community hall for 4 days', category: 'Garbage Not Collected', location: 'Behind Panchayat Bhawan, Ward 2', priority: 'Medium', date: '2026-08-18', description: 'Garbage collection truck skipped Ward 2 for four consecutive days. Stray animals are scattering waste across the road.', status: 'Pending', image: null, response: null },
  { id: 4, tracking_id: 'GRV-104', title: 'Broken sanitation stall doors in public toilet complex', category: 'Public Sanitation Issues', location: 'Bus Stand Public Sanitation Facility', priority: 'Low', date: '2026-08-15', description: 'Latches and door hinges on stall #2 and #3 are broken, causing inconvenience for travelers and women.', status: 'Resolved', image: null, response: 'Sanitation maintenance contractor installed new stainless steel latches and hinges on all stalls.' },
  { id: 5, tracking_id: 'GRV-105', title: 'Illegal chemical runoff into local irrigation pond', category: 'Industrial/Environmental Violations', location: 'Eastern Boundary, Sector 9 Outskirts', priority: 'Critical', date: '2026-08-21', description: 'A small processing unit on the edge of the village is releasing untreated chemical discharge directly into the communal irrigation pond.', status: 'Pending', image: null, response: null },
  { id: 6, tracking_id: 'GRV-106', title: 'Heavy smoke and burning plastic smell during night hours', category: 'Air/Noise/Water Pollution', location: 'North Ward 1, Near Old Brick Kiln', priority: 'High', date: '2026-08-17', description: 'Open burning of rubber tires and plastic scrap occurring late night causing severe breathing difficulties for elderly residents.', status: 'Resolved', image: null, response: 'Panchayat team inspected site with village patrol. Offender fined ₹5,000 and burning ceased immediately.' }
];

const INITIAL_SEED_PROJECTS = [
  { id: 1, title: 'Main Road Phase 1 Paving', category: 'Gram Sadak Yojana', vendor: 'Shree Constructions', allocated_budget: 1500000, actual_spent: 1200000, status: 'In Progress', image: '/road.png', receipt_ref: 'REC-2026-01' },
  { id: 2, title: 'Primary School Roof & Wall Repair', category: 'School Maintenance', vendor: 'Local Builders Co.', allocated_budget: 800000, actual_spent: 800000, status: 'Completed', image: '/school.png', receipt_ref: 'REC-2026-02' },
  { id: 3, title: 'Village Water Tank Installation', category: 'Water Tank Construction', vendor: 'JalTech Solutions', allocated_budget: 2000000, actual_spent: 500000, status: 'In Progress', image: '/water-tank.png', receipt_ref: 'REC-2026-03' },
  { id: 4, title: 'Community Solar Lights Network', category: 'Street Lights', vendor: 'EcoLight India', allocated_budget: 300000, actual_spent: 300000, status: 'Completed', image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80', receipt_ref: 'REC-2026-04' }
];

const INITIAL_SEED_PLANS = {
  approved: [
    { id: 1, title: 'New Anganwadi Child Care Center Building', cost: 450000, date: 'Oct 2026' },
    { id: 2, title: 'Main Market Covered Drainage Network', cost: 120000, date: 'Nov 2026' },
  ],
  discussion: [
    { id: 3, title: 'Public Park Fencing & Walking Track', cost: 85000, date: 'Dec 2026' },
    { id: 4, title: 'Panchayat High-Speed WiFi Extension to Ward 5', cost: 15000, date: 'Dec 2026' },
  ],
  proposed: [
    { id: 5, title: 'Gram Panchayat Digital E-Library Construction', cost: 300000, date: 'Jan 2027' },
    { id: 6, title: 'Rooftop Solar Panels for Primary Health Center', cost: 200000, date: 'Feb 2027' },
    { id: 7, title: 'Veterinary Clinic & Cattle Health Center Upgrade', cost: 150000, date: 'Mar 2027' },
  ]
};

export function App() {
  // Navigation View: 'overview' | 'expenses' | 'works' | 'plans' | 'reports' | 'grievance' | 'admin'
  const [view, setView] = useState('overview');
  const [adminTab, setAdminTab] = useState('expenses'); // 'expenses' | 'complaints' | 'reports' | 'categories'

  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('phulera_admin_logged_in') === 'true';
    } catch {
      return false;
    }
  });
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('phulera_admin_user');
      return saved ? JSON.parse(saved) : { fullName: 'Manju Devi (Sarpanch)', email: 'sarpanch@phuleragov.in', role: 'admin' };
    } catch {
      return { fullName: 'Manju Devi (Sarpanch)', email: 'sarpanch@phuleragov.in', role: 'admin' };
    }
  });

  // Data States with resilient defaults
  const [expenses, setExpenses] = useState(INITIAL_SEED_EXPENSES);
  const [complaints, setComplaints] = useState(INITIAL_SEED_COMPLAINTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [complaintCategories, setComplaintCategories] = useState(DEFAULT_COMPLAINT_CATEGORIES);
  const [projects, setProjects] = useState(INITIAL_SEED_PROJECTS);
  const [plans, setPlans] = useState(INITIAL_SEED_PLANS);

  const [stats, setStats] = useState(() => {
    const totalSpent = INITIAL_SEED_EXPENSES.reduce((sum, e) => sum + e.amount, 0);
    return {
      annualGrant: 2500000,
      totalSpent,
      remainingBalance: 2500000 - totalSpent,
      expenseCount: INITIAL_SEED_EXPENSES.length,
      categories: [
        { category: 'Gram Sadak Yojana', total: 450000, count: 1 },
        { category: 'Water Tank Construction', total: 250000, count: 1 },
        { category: 'Street Lights', total: 125000, count: 1 },
        { category: 'Drainage/Sewage', total: 95000, count: 1 },
        { category: 'School Maintenance', total: 85000, count: 1 },
        { category: 'Health Camp', total: 65000, count: 1 },
        { category: 'Cleanliness Campaign', total: 50000, count: 1 },
        { category: 'Panchayat Building Renovation', total: 45000, count: 1 },
        { category: 'Tree Plantation', total: 40000, count: 1 },
        { category: 'Public Toilet', total: 35000, count: 1 }
      ],
      fundSources: [
        { name: 'Central Government Grants (MGNREGA, 15th FC)', amount: 1500000, percentage: 60 },
        { name: 'State Government Funds', amount: 700000, percentage: 28 },
        { name: 'Local Panchayat Tax Revenue', amount: 300000, percentage: 12 },
      ],
      complaintsSummary: { total: 6, pending: 3, inProgress: 1, resolved: 2, rejected: 0, critical: 2 }
    };
  });

  // UI / Feedback States
  const [toastMessage, setToastMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [previewReceipt, setPreviewReceipt] = useState(null);
  const [backendConnected, setBackendConnected] = useState(true);

  // Show Toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch all core application data from backend
  const fetchAllData = async () => {
    try {
      const [statsRes, expRes, catRes, cmpRes, cmpCatRes, prjRes, plnRes] = await Promise.allSettled([
        api.getDashboardStats(),
        api.getExpenses(),
        api.getExpenseCategories(),
        api.getComplaints(),
        api.getComplaintCategories(),
        api.getProjects(),
        api.getPlans()
      ]);

      let anySuccess = false;
      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setStats(statsRes.value.data);
        anySuccess = true;
      }
      if (expRes.status === 'fulfilled' && expRes.value?.success) {
        setExpenses(expRes.value.data);
        anySuccess = true;
      }
      if (catRes.status === 'fulfilled' && catRes.value?.success) {
        setCategories(catRes.value.data.map(c => c.name));
      }
      if (cmpRes.status === 'fulfilled' && cmpRes.value?.success) {
        setComplaints(cmpRes.value.data);
        anySuccess = true;
      }
      if (cmpCatRes.status === 'fulfilled' && cmpCatRes.value?.success) {
        setComplaintCategories(cmpCatRes.value.data.map(c => c.name));
      }
      if (prjRes.status === 'fulfilled' && prjRes.value?.success) {
        setProjects(prjRes.value.data);
      }
      if (plnRes.status === 'fulfilled' && plnRes.value?.success) {
        setPlans(plnRes.value.data);
      }

      setBackendConnected(anySuccess);
    } catch (err) {
      console.warn('Backend currently offline or unreachable, using live fallback state:', err);
      setBackendConnected(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Admin Login Handlers
  const handleAdminLogin = (userData) => {
    setIsAdminLoggedIn(true);
    setAdminUser(userData);
    try {
      localStorage.setItem('phulera_admin_logged_in', 'true');
      localStorage.setItem('phulera_admin_user', JSON.stringify(userData));
    } catch (err) {
      console.error(err);
    }
    setView('admin');
    showToast(`Welcome, ${userData?.fullName || 'Official'}!`);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    try {
      localStorage.removeItem('phulera_admin_logged_in');
      localStorage.removeItem('phulera_admin_user');
    } catch (err) {
      console.error(err);
    }
    setView('overview');
    showToast('Logged out successfully.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200 font-sans selection:bg-teal-500/30">
      
      {/* ==================== TOAST NOTIFICATION ==================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-500 text-slate-950 px-5 py-3 rounded-xl shadow-2xl font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={18} /> {toastMessage}
        </div>
      )}

      {/* ==================== HEADER & NAVBAR ==================== */}
      <Navbar 
        currentView={view} 
        setView={setView} 
        isAdminLoggedIn={isAdminLoggedIn} 
      />

      {/* ==================== MAIN CONTENT ROUTER ==================== */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {view === 'overview' && (
          <DashboardSection 
            stats={stats} 
            expenses={expenses} 
            setView={setView} 
          />
        )}

        {view === 'expenses' && (
          <ExpenseViewerSection 
            expenses={expenses} 
            categories={categories} 
          />
        )}

        {view === 'works' && (
          <WorksRecordsSection 
            projects={projects} 
            onViewReceipt={(receipt) => setPreviewReceipt(receipt)} 
          />
        )}

        {view === 'plans' && (
          <UpcomingPlansSection plans={plans} />
        )}

        {view === 'reports' && (
          <ReportsSection 
            stats={stats} 
            expenses={expenses} 
            projects={projects} 
          />
        )}

        {view === 'grievance' && (
          <GrievanceSection 
            complaints={complaints}
            categories={complaintCategories}
            onComplaintAdded={(newComplaint) => {
              setComplaints(prev => [newComplaint, ...prev]);
              fetchAllData();
              showToast('Grievance registered successfully!');
            }}
            onViewImage={(img) => setPreviewImage(img)}
          />
        )}

        {view === 'admin' && (
          !isAdminLoggedIn ? (
            <AdminLoginSection onLogin={handleAdminLogin} />
          ) : (
            <AdminPortalSection 
              user={adminUser}
              stats={stats}
              expenses={expenses}
              categories={categories}
              complaints={complaints}
              complaintCategories={complaintCategories}
              activeTab={adminTab}
              setActiveTab={setAdminTab}
              onLogout={handleAdminLogout}
              onDataChanged={fetchAllData}
              showToast={showToast}
              onViewImage={(img) => setPreviewImage(img)}
              onNavigateCitizenView={() => setView('overview')}
            />
          )
        )}
      </main>

      {/* ==================== MODALS ==================== */}
      {previewImage && (
        <ImagePreviewModal 
          image={previewImage} 
          onClose={() => setPreviewImage(null)} 
        />
      )}

      {previewReceipt && (
        <ReceiptModal 
          receipt={previewReceipt} 
          onClose={() => setPreviewReceipt(null)} 
        />
      )}

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500 bg-slate-950/50">
        <p>&copy; 2026 Phulera Gram Panchayat Administration. All Rights Reserved.</p>
        <p className="text-xs text-slate-600 mt-1">
          Gram Panchayat Expense Tracker & Citizen Grievance Portal • Direct SQLite & REST API Architecture
        </p>
      </footer>
    </div>
  );
}

// =====================================================================
// 1. NAVBAR COMPONENT
// =====================================================================
function Navbar({ currentView, setView, isAdminLoggedIn }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'expenses', label: 'Where Money Goes' },
    { id: 'works', label: 'Works & Records' },
    { id: 'plans', label: 'Upcoming Plans' },
    { id: 'reports', label: 'Reports' },
  ];

  const handleNavClick = (id) => {
    setView(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Panchayat Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('overview')}>
            <div className="bg-teal-500/10 p-2.5 rounded-xl border border-teal-500/20">
              <Landmark className="text-teal-400" size={26} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">Phulera Gram Panchayat</h1>
              <span className="text-[11px] font-semibold tracking-wider text-teal-400 uppercase bg-teal-500/10 px-2 py-0.5 rounded-full inline-block border border-teal-500/20">
                Official Portal
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === link.id 
                    ? 'bg-slate-800 text-teal-400 shadow-inner' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
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
              {isAdminLoggedIn ? 'Admin Portal' : 'Admin Login'}
            </button>
          </div>

          {/* Mobile Hamburger */}
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2.5">
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
              {isAdminLoggedIn ? 'Admin Portal' : 'Admin Login'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// =====================================================================
// 2. DASHBOARD / OVERVIEW SECTION
// =====================================================================
function DashboardSection({ stats, expenses, setView }) {
  const annualGrant = stats.annualGrant || 2500000;
  const totalSpent = stats.totalSpent || 0;
  const remaining = stats.remainingBalance || (annualGrant - totalSpent);
  const spentPct = Math.min(100, (totalSpent / annualGrant) * 100);
  const remPct = Math.min(100, (remaining / annualGrant) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Headline */}
      <div className="text-center py-8 space-y-3">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Transparent Governance <br className="hidden md:block"/> & Citizen Services
        </h2>
        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
          Track every rupee spent in Phulera Gram Panchayat. We are committed to complete transparency, public accountability, and rapid rural infrastructure development.
        </p>
      </div>

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Total Annual Grant</p>
          <div className="text-3xl font-bold text-white flex items-center gap-1 mb-4">
            <IndianRupee size={24} className="text-teal-400" />
            {annualGrant.toLocaleString('en-IN')}
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2">
            <div className="h-2 rounded-full bg-teal-400 w-full"></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Fiscal Year 2026-2027 Allocation</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Total Spent YTD</p>
          <div className="text-3xl font-bold text-white flex items-center gap-1 mb-4">
            <IndianRupee size={24} className="text-teal-400" />
            {totalSpent.toLocaleString('en-IN')}
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2">
            <div className="h-2 rounded-full bg-teal-500" style={{ width: `${spentPct}%` }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">{spentPct.toFixed(1)}% of total grant utilized</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Remaining Balance</p>
          <div className="text-3xl font-bold text-white flex items-center gap-1 mb-4">
            <IndianRupee size={24} className="text-emerald-400" />
            {remaining.toLocaleString('en-IN')}
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2">
            <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${remPct}%` }}></div>
          </div>
          <p className="text-xs text-emerald-400 mt-2">{remPct.toFixed(1)}% funds available for works</p>
        </div>

      </div>

      {/* Fund Sources & Breakdown */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2.5">
          <Building2 className="text-teal-400" size={22} />
          Village Fund Sources & Grant Allocations
        </h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-slate-300">Central Government Grants (MGNREGA, 15th Finance Commission)</span>
              <span className="text-teal-400 font-bold flex items-center"><IndianRupee size={13}/> 15,00,000 (60%)</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3">
              <div className="bg-teal-400 h-3 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-slate-300">State Government Rural Development Funds</span>
              <span className="text-teal-400 font-bold flex items-center"><IndianRupee size={13}/> 7,00,000 (28%)</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3">
              <div className="bg-teal-500 h-3 rounded-full" style={{ width: '28%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-slate-300">Local Panchayat Tax & Market Fee Revenue</span>
              <span className="text-teal-400 font-bold flex items-center"><IndianRupee size={13}/> 3,00,000 (12%)</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3">
              <div className="bg-teal-600 h-3 rounded-full" style={{ width: '12%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Expenditures Quick List */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-teal-400" /> Recent Panchayat Expenditures
          </h3>
          <button 
            onClick={() => setView('expenses')}
            className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
          >
            View All Expenditures <ArrowRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-900/60 text-slate-400 text-xs uppercase border-b border-slate-700">
                <th className="p-3 font-semibold">Work / Title</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-sm">
              {expenses.slice(0, 5).map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-700/30">
                  <td className="p-3 font-medium text-slate-200">{exp.title}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 text-xs">{exp.date}</td>
                  <td className="p-3 text-right font-bold text-teal-400">
                    ₹{Number(exp.amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// =====================================================================
// 3. WHERE MONEY GOES / EXPENSE VIEWER SECTION
// =====================================================================
function ExpenseViewerSection({ expenses, categories }) {
  const [filterTime, setFilterTime] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(item => {
      const matchCat = filterCategory === 'All Categories' || item.category === filterCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        item.title.toLowerCase().includes(q) ||
        (item.vendor && item.vendor.toLowerCase().includes(q)) ||
        (item.receipt_no && item.receipt_no.toLowerCase().includes(q));
      
      if (!matchCat || !matchSearch) return false;

      if (filterTime === 'All') return true;
      const itemDate = new Date(item.date);
      const now = new Date();
      if (filterTime === 'Today') return itemDate.toDateString() === now.toDateString();
      if (filterTime === 'Week') {
        const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }
      if (filterTime === 'Year') return itemDate.getFullYear() === now.getFullYear();
      return true;
    });
  }, [expenses, filterTime, filterCategory, searchQuery]);

  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [filteredExpenses]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1.5">Where Money Goes</h2>
          <p className="text-slate-400 text-sm">
            Live database records of all verified expenditures authorized by Phulera Gram Panchayat.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Time Filter */}
          <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex">
            {['All', 'Today', 'Week', 'Year'].map(t => (
              <button
                key={t}
                onClick={() => setFilterTime(t)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterTime === t ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-teal-500 outline-none"
          >
            <option>All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search and Summary Metric */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search work, vendor, invoice..."
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400">Total Filtered: <strong className="text-white">{filteredExpenses.length} records</strong></span>
          <span className="text-slate-400">Sum: <strong className="text-teal-400 font-bold">₹{totalFilteredAmount.toLocaleString('en-IN')}</strong></span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                <th className="p-4 font-semibold">Work / Title</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Vendor / Supplier</th>
                <th className="p-4 font-semibold">Receipt / Inv #</th>
                <th className="p-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 text-sm">
                    No expense records found matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 text-slate-200 font-medium">{txn.title}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-700 text-slate-300 border border-slate-600">
                        {txn.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-sm">{txn.date}</td>
                    <td className="p-4 text-slate-300 text-sm">{txn.vendor || '—'}</td>
                    <td className="p-4 text-slate-400 text-sm font-mono">{txn.receipt_no || txn.receipt || '—'}</td>
                    <td className="p-4 text-right text-teal-400 font-bold flex items-center justify-end gap-1">
                      <IndianRupee size={14} />
                      {Number(txn.amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex justify-between items-center text-xs text-slate-400">
          <span>Showing {filteredExpenses.length} entries</span>
          <span className="text-teal-400 font-medium">All vouchers audited by Gram Sabha</span>
        </div>
      </div>

    </div>
  );
}

// =====================================================================
// 4. WORKS & RECORDS SECTION
// =====================================================================
function WorksRecordsSection({ projects, onViewReceipt }) {
  const displayList = projects && projects.length > 0 ? projects : INITIAL_SEED_PROJECTS;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-1.5">Works & Records</h2>
        <p className="text-slate-400 text-sm">
          Verified completed and ongoing Panchayat projects with photographic evidence and official audit vouchers.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayList.map((project) => (
          <div 
            key={project.id} 
            className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 flex flex-col hover:border-slate-500 transition-all duration-300 shadow-xl"
          >
            {/* Image Container */}
            <div className="relative h-48 w-full bg-slate-950">
              <img 
                src={project.image || '/road.png'} 
                alt={project.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80'; }}
              />
              
              <div className="absolute top-3 left-3">
                <span className="bg-slate-900/90 text-slate-200 text-xs px-3 py-1 rounded-full font-medium backdrop-blur border border-slate-700">
                  {project.category}
                </span>
              </div>
              
              <div className="absolute top-3 right-3 bg-slate-900/90 rounded-full p-1 backdrop-blur border border-slate-700">
                <CheckCircle2 size={18} className="text-teal-400" />
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex flex-col flex-grow space-y-3">
              <h3 className="text-base font-bold text-white leading-snug">
                {project.title}
              </h3>
              
              <p className="text-xs text-slate-400 flex items-center gap-2 flex-grow">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                Vendor: {project.vendor}
              </p>
              
              <button 
                onClick={() => onViewReceipt(project)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-teal-950/40 hover:bg-teal-900/50 text-teal-400 border border-teal-800/50 rounded-xl transition-all text-xs font-semibold"
              >
                <ExternalLink size={14} /> View Official Receipt
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// 5. UPCOMING PLANS / ROADMAP SECTION
// =====================================================================
function UpcomingPlansSection({ plans }) {
  const planData = plans && (plans.approved?.length || plans.discussion?.length || plans.proposed?.length) 
    ? plans 
    : INITIAL_SEED_PLANS;

  const PlanColumn = ({ title, items = [], icon: Icon, colorClass }) => (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 flex flex-col h-full min-h-[480px]">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Icon className={colorClass} size={20} />
        <h3 className="font-bold text-white text-base">{title}</h3>
        <span className="ml-auto bg-slate-700 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">
          {items.length}
        </span>
      </div>
      
      <div className="flex-1 space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-sm hover:border-slate-500 transition-colors">
            <h4 className="font-semibold text-slate-200 text-sm mb-2">{item.title}</h4>
            <div className="flex justify-between items-center text-xs">
              <span className="text-teal-400 font-bold flex items-center">
                <IndianRupee size={12} /> {Number(item.cost || item.estimated_cost || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <Calendar size={12} /> {item.date || item.target_date || 'TBD'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-1.5">Upcoming Plans (Roadmap)</h2>
        <p className="text-slate-400 text-sm">Future projects, civic roadmaps, and infrastructure developments planned for Phulera.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlanColumn title="Approved in Gram Sabha" items={planData.approved} icon={CheckCircle2} colorClass="text-teal-400" />
        <PlanColumn title="Under Discussion" items={planData.discussion} icon={Clock} colorClass="text-yellow-400" />
        <PlanColumn title="Proposed Roadmap" items={planData.proposed} icon={Calendar} colorClass="text-slate-400" />
      </div>
    </div>
  );
}

// =====================================================================
// 6. REPORTS & ANALYTICS SECTION
// =====================================================================
function ReportsSection({ stats, expenses, projects }) {
  const categoriesData = stats.categories || [];
  const totalSpent = stats.totalSpent || 1240000;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-1.5">Financial & Expenditure Reports</h2>
        <p className="text-slate-400 text-sm">Visual analysis and breakdown of Gram Panchayat funds and category allocations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Progress */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <PieChart className="text-teal-400" size={20} />
            Expenditure by Category
          </h3>
          <div className="space-y-4">
            {categoriesData.map(cat => {
              const pct = totalSpent > 0 ? (cat.total / totalSpent) * 100 : 0;
              return (
                <div key={cat.category}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-300">{cat.category}</span>
                    <span className="text-teal-400 flex items-center">
                      <IndianRupee size={12}/>{Number(cat.total).toLocaleString('en-IN')} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5">
                    <div 
                      className="bg-teal-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Budget vs Actual Spent */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <BarChart3 className="text-teal-400" size={20} />
            Major Projects: Budget vs Actuals
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/60 text-slate-400 uppercase border-b border-slate-700">
                  <th className="p-3">Project</th>
                  <th className="p-3 text-right">Allocated</th>
                  <th className="p-3 text-right">Spent</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {(projects && projects.length > 0 ? projects : INITIAL_SEED_PROJECTS).map(p => (
                  <tr key={p.id}>
                    <td className="p-3 font-medium text-slate-200">{p.title || p.name}</td>
                    <td className="p-3 text-right text-slate-400">₹{Number(p.allocated_budget || p.budget || 0).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-teal-400 font-bold">₹{Number(p.actual_spent || p.spent || 0).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// 7. CITIZEN GRIEVANCE / REPORT A PROBLEM SECTION
// =====================================================================
function GrievanceSection({ complaints, categories, onComplaintAdded, onViewImage }) {
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' | 'list'

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedGrievance, setSubmittedGrievance] = useState(null);

  // Filters State
  const [filterCat, setFilterCat] = useState('All');
  const [filterPrio, setFilterPrio] = useState('All');
  const [filterStat, setFilterStat] = useState('All');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('File size exceeds 3MB. Please select a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = 'Problem title is required.';
    if (!category) errors.category = 'Please choose a category.';
    if (!location.trim()) errors.location = 'Location or Ward number is required.';
    if (!description.trim()) errors.description = 'Please describe the problem.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const payload = {
      title: title.trim(),
      category: category.trim(),
      location: location.trim(),
      priority,
      date,
      description: description.trim(),
      image: imagePreview
    };

    try {
      const res = await api.addComplaint(payload);
      if (res.success && res.data) {
        setSubmittedGrievance(res.data);
        onComplaintAdded(res.data);
      } else {
        // Local fallback
        const fallback = {
          id: Date.now(),
          tracking_id: `GRV-${Math.floor(100 + Math.random() * 900)}`,
          ...payload,
          status: 'Pending',
          response: null
        };
        setSubmittedGrievance(fallback);
        onComplaintAdded(fallback);
      }

      // Reset form
      setTitle('');
      setCategory('');
      setLocation('');
      setPriority('Medium');
      setDescription('');
      setImagePreview(null);
      setFormErrors({});
    } catch (err) {
      // Local fallback
      const fallback = {
        id: Date.now(),
        tracking_id: `GRV-${Math.floor(100 + Math.random() * 900)}`,
        ...payload,
        status: 'Pending',
        response: null
      };
      setSubmittedGrievance(fallback);
      onComplaintAdded(fallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter(item => {
      const matchCat = filterCat === 'All' || item.category === filterCat;
      const matchPrio = filterPrio === 'All' || item.priority === filterPrio;
      const matchStat = filterStat === 'All' || item.status === filterStat;
      return matchCat && matchPrio && matchStat;
    });
  }, [complaints, filterCat, filterPrio, filterStat]);

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 'Critical':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">Critical</span>;
      case 'High':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">High</span>;
      case 'Medium':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">Medium</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/30">Low</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12}/> Resolved</span>;
      case 'In Progress':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 flex items-center gap-1"><Clock size={12}/> In Progress</span>;
      case 'Rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 flex items-center gap-1"><XCircle size={12}/> Rejected</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 flex items-center gap-1"><AlertCircle size={12}/> Pending</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1.5">Citizen Grievance & Problem Portal</h2>
          <p className="text-slate-400 text-sm">
            Report civic, sanitation, water, and environmental issues directly to Phulera Gram Panchayat officials.
          </p>
        </div>

        <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex gap-1 self-stretch md:self-auto">
          <button
            type="button"
            onClick={() => { setActiveTab('submit'); setSubmittedGrievance(null); }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'submit'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle size={15} /> Report a Problem
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'list'
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText size={15} /> My Complaints ({complaints.length})
          </button>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION BANNER */}
      {submittedGrievance && (
        <div className="bg-slate-800 border-2 border-teal-500/40 rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/40">
                <CheckCircle2 size={26} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Complaint Submitted Successfully!</h3>
                <p className="text-xs text-slate-400">Your grievance is stored in the database and queued for administrative review.</p>
              </div>
            </div>
            
            <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Tracking ID</span>
              <span className="font-mono text-base font-bold text-teal-400">{submittedGrievance.tracking_id || submittedGrievance.id}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setActiveTab('list')}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
            >
              View in "My Complaints"
            </button>
            <button
              onClick={() => setSubmittedGrievance(null)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg text-xs transition-colors"
            >
              Report Another Problem
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: FORM */}
      {activeTab === 'submit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <MessageSquare className="text-yellow-400" size={18} /> New Problem Submission Form
            </h3>
            <p className="text-slate-400 text-xs mb-6">
              Please provide accurate details so Panchayat staff can dispatch work crews promptly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Problem Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Street garbage pileup near Ward 3 market"
                  className={`w-full bg-slate-900 border text-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none ${
                    formErrors.title ? 'border-rose-500' : 'border-slate-700 focus:border-yellow-500'
                  }`}
                />
                {formErrors.title && <p className="text-rose-400 text-xs mt-1">{formErrors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Problem Category <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-2.5 text-left rounded-xl border flex items-center gap-2 text-xs transition-all ${
                        category === cat
                          ? 'bg-yellow-500/15 border-yellow-500 text-yellow-300 font-semibold'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <Tag size={14} className={category === cat ? 'text-yellow-400' : 'text-slate-500'} />
                      <span className="truncate">{cat}</span>
                    </button>
                  ))}
                </div>
                {formErrors.category && <p className="text-rose-400 text-xs mt-1">{formErrors.category}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Location / Ward <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Ward 4, Near Water Tank"
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-yellow-500"
                    />
                  </div>
                  {formErrors.location && <p className="text-rose-400 text-xs mt-1">{formErrors.location}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Severity / Priority</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Critical', 'High', 'Medium', 'Low'].map((prio) => (
                    <button
                      key={prio}
                      type="button"
                      onClick={() => setPriority(prio)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        priority === prio
                          ? prio === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500' :
                            prio === 'High' ? 'bg-orange-500/20 text-orange-300 border-orange-500' :
                            prio === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500' :
                            'bg-teal-500/20 text-teal-300 border-teal-500'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Problem Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue, affected households, urgency..."
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-3 text-sm outline-none focus:border-yellow-500"
                ></textarea>
                {formErrors.description && <p className="text-rose-400 text-xs mt-1">{formErrors.description}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Attach Photo Evidence <span className="text-slate-500 font-normal">(Optional, max 3MB)</span>
                </label>
                {imagePreview ? (
                  <div className="relative inline-block border border-slate-700 rounded-xl overflow-hidden bg-slate-900 p-2">
                    <img src={imagePreview} alt="Preview" className="h-28 w-44 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-700 hover:border-yellow-500/50 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 transition-all">
                    <Upload className="text-slate-500 mb-1" size={20} />
                    <span className="text-xs font-medium text-slate-300">Click to upload photo evidence</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold py-3 rounded-xl transition-all shadow-lg text-sm disabled:opacity-50"
              >
                <Sparkles size={16} /> {isSubmitting ? 'Registering Grievance...' : 'Submit Official Grievance'}
              </button>

            </form>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-md">
              <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-teal-400" size={18} /> Resolution Guidelines
              </h4>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold shrink-0">1</span>
                  <div><strong className="text-rose-400 block">Critical</strong> Pipeline bursts, toxic runoff (24h response).</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold shrink-0">2</span>
                  <div><strong className="text-orange-400 block">High</strong> Sewage blockage, major pollution (48h).</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold shrink-0">3</span>
                  <div><strong className="text-teal-400 block">Medium & Low</strong> Sanitation, latches, garbage bins (3-5 days).</div>
                </li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MY COMPLAINTS LIST */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          
          {/* Filter Toolbar */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <ListFilter size={16} className="text-teal-400" /> Filters:
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 outline-none">
                <option value="All">All Categories ({complaints.length})</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select value={filterPrio} onChange={(e) => setFilterPrio(e.target.value)} className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 outline-none">
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select value={filterStat} onChange={(e) => setFilterStat(e.target.value)} className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 outline-none">
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>

              {(filterCat !== 'All' || filterPrio !== 'All' || filterStat !== 'All') && (
                <button onClick={() => { setFilterCat('All'); setFilterPrio('All'); setFilterStat('All'); }} className="text-teal-400 text-xs hover:underline">
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Cards */}
          {filteredComplaints.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center">
              <AlertCircle size={36} className="mx-auto text-slate-500 mb-2" />
              <p className="text-slate-300 font-semibold">No complaints found matching current filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredComplaints.map(item => (
                <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-md">
                  <div>
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-teal-400 font-mono text-xs font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          {item.tracking_id || item.id}
                        </span>
                        {getPriorityBadge(item.priority)}
                      </div>
                      {getStatusBadge(item.status)}
                    </div>

                    <h4 className="text-white font-bold text-sm mb-1 leading-snug">{item.title}</h4>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5">
                      <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{item.category}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-teal-400" /> {item.location}</span>
                    </div>

                    <p className="text-slate-300 text-xs bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/60 mb-3">
                      {item.description}
                    </p>

                    {item.image && (
                      <button 
                        onClick={() => onViewImage(item.image)}
                        className="inline-flex items-center gap-1 text-xs text-teal-400 hover:underline mb-2"
                      >
                        <ImageIcon size={14} /> View Citizen Photo Evidence
                      </button>
                    )}
                  </div>

                  <div className="border-t border-slate-700/80 pt-2.5 mt-2">
                    <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Official Response</span>
                    {item.response ? (
                      <p className="text-xs text-teal-200 italic bg-teal-950/20 border border-teal-500/20 p-2 rounded">
                        "{item.response}"
                      </p>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Under Panchayat review...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}

// =====================================================================
// 8. ADMIN LOGIN COMPONENT
// =====================================================================
function AdminLoginSection({ onLogin }) {
  const [email, setEmail] = useState('sarpanch@phuleragov.in');
  const [password, setPassword] = useState('panchayat2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.login(email, password);
      if (res.success && res.user) {
        onLogin(res.user);
      } else {
        // Fallback demo check if offline
        if (email === 'sarpanch@phuleragov.in' && password === 'panchayat2026') {
          onLogin({ fullName: 'Manju Devi (Sarpanch)', email, role: 'admin', designation: 'Gram Sarpanch' });
        } else {
          setError(res.error || 'Invalid official credentials.');
        }
      }
    } catch (err) {
      if (email === 'sarpanch@phuleragov.in' && password === 'panchayat2026') {
        onLogin({ fullName: 'Manju Devi (Sarpanch)', email, role: 'admin', designation: 'Gram Sarpanch' });
      } else {
        setError(err.message || 'Login failed. Please check credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 animate-fade-in">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">
        
        <div className="p-8 text-center bg-slate-900/50 border-b border-slate-700">
          <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
            <Shield className="text-teal-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">Administration Login</h2>
          <p className="text-slate-400 text-xs mt-1.5">Secure access for Gram Panchayat Officials only</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-xs text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email</label>
            <input 
              required 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-teal-500" 
              placeholder="Enter official email" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Master Password</label>
            <div className="relative flex items-center">
              <input 
                required 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg pl-4 pr-11 py-2.5 outline-none focus:border-teal-500" 
                placeholder="••••••••" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-slate-400 hover:text-teal-400 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-teal-500/20 text-sm disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Secure Login'} <ArrowRight size={16} />
          </button>
        </form>

        <div className="bg-slate-900/80 p-4 border-t border-slate-700 text-center">
          <p className="text-[11px] text-slate-400 font-mono">
            Demo Credentials: <br/>
            Email: <strong className="text-teal-400">sarpanch@phuleragov.in</strong> | Pass: <strong className="text-teal-400">panchayat2026</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// 9. ADMIN PORTAL SECTION (EXPENSES, GRIEVANCES, CATEGORIES, REPORTS)
// =====================================================================
function AdminPortalSection({ 
  user, 
  stats, 
  expenses, 
  categories, 
  complaints, 
  complaintCategories,
  activeTab, 
  setActiveTab, 
  onLogout, 
  onDataChanged, 
  showToast, 
  onViewImage,
  onNavigateCitizenView
}) {
  // Expense Form State
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState(categories[0] || 'Gram Sadak Yojana');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [expVendor, setExpVendor] = useState('');
  const [expReceipt, setExpReceipt] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expProject, setExpProject] = useState('');
  const [isSavingExp, setIsSavingExp] = useState(false);

  // Edit Expense Modal State
  const [editingExpense, setEditingExpense] = useState(null);

  // New Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatBudget, setNewCatBudget] = useState('');

  // Complaint Remark Editing
  const [editingRemarkId, setEditingRemarkId] = useState(null);
  const [remarkText, setRemarkText] = useState('');

  // Complaint filters in Admin
  const [adminCmpCat, setAdminCmpCat] = useState('All');
  const [adminCmpPrio, setAdminCmpPrio] = useState('All');
  const [adminCmpStat, setAdminCmpStat] = useState('All');
  const [adminSearch, setAdminSearch] = useState('');

  // Handle Add Expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expTitle || !expCategory || !expAmount) {
      alert('Please fill all required expense fields.');
      return;
    }
    setIsSavingExp(true);

    try {
      const res = await api.addExpense({
        title: expTitle,
        category: expCategory,
        amount: parseFloat(expAmount),
        date: expDate,
        vendor: expVendor,
        receipt_no: expReceipt || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        description: expDesc,
        project: expProject,
        status: 'Paid'
      });

      if (res.success) {
        showToast('Expense recorded successfully in database!');
        setExpTitle('');
        setExpAmount('');
        setExpVendor('');
        setExpReceipt('');
        setExpDesc('');
        setExpProject('');
        onDataChanged();
      }
    } catch (err) {
      alert('Failed to save expense: ' + err.message);
    } finally {
      setIsSavingExp(false);
    }
  };

  // Handle Update Expense
  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    if (!editingExpense) return;

    try {
      const res = await api.updateExpense(editingExpense.id, editingExpense);
      if (res.success) {
        showToast('Expense updated successfully.');
        setEditingExpense(null);
        onDataChanged();
      }
    } catch (err) {
      alert('Failed to update expense: ' + err.message);
    }
  };

  // Handle Delete Expense
  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense record?')) return;
    try {
      const res = await api.deleteExpense(id);
      if (res.success) {
        showToast('Expense deleted successfully.');
        onDataChanged();
      }
    } catch (err) {
      alert('Failed to delete expense: ' + err.message);
    }
  };

  // Handle Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await api.addExpenseCategory({
        name: newCatName.trim(),
        allocated_budget: parseFloat(newCatBudget) || 0
      });

      if (res.success) {
        showToast(`Category "${newCatName}" added!`);
        setNewCatName('');
        setNewCatBudget('');
        onDataChanged();
      }
    } catch (err) {
      alert('Error adding category: ' + err.message);
    }
  };

  // Handle Complaint Status Change
  const handleComplaintStatusChange = async (id, newStatus) => {
    try {
      const res = await api.updateComplaint(id, { status: newStatus });
      if (res.success) {
        showToast(`Complaint #${id} updated to ${newStatus}`);
        onDataChanged();
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // Handle Save Official Remark
  const handleSaveRemark = async (id) => {
    try {
      const res = await api.updateComplaint(id, { response: remarkText });
      if (res.success) {
        showToast(`Official remark recorded for Complaint #${id}`);
        setEditingRemarkId(null);
        setRemarkText('');
        onDataChanged();
      }
    } catch (err) {
      alert('Failed to save remark: ' + err.message);
    }
  };

  // Filter complaints in Admin
  const filteredAdminComplaints = useMemo(() => {
    return complaints.filter(item => {
      const matchCat = adminCmpCat === 'All' || item.category === adminCmpCat;
      const matchPrio = adminCmpPrio === 'All' || item.priority === adminCmpPrio;
      const matchStat = adminCmpStat === 'All' || item.status === adminCmpStat;
      const q = adminSearch.toLowerCase().trim();
      const matchQ = !q || 
        (item.tracking_id && item.tracking_id.toLowerCase().includes(q)) ||
        (item.id && String(item.id).includes(q)) ||
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);

      return matchCat && matchPrio && matchStat && matchQ;
    });
  }, [complaints, adminCmpCat, adminCmpPrio, adminCmpStat, adminSearch]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Admin Top Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
            <ShieldCheck size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Panchayat Administration Portal</h2>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-bold">
                {user?.designation || 'Official Access'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Phulera Gram Panchayat • Logged in as <strong className="text-slate-200">{user?.fullName || 'Sarpanch'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onNavigateCitizenView}
            className="px-3.5 py-2 bg-slate-900 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium"
          >
            Public View
          </button>
          <button 
            onClick={onLogout}
            className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-medium flex items-center gap-1.5"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Admin Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-3">
        {[
          { id: 'expenses', label: 'Expense Management', icon: IndianRupee },
          { id: 'complaints', label: `Citizen Grievances (${complaints.length})`, icon: AlertTriangle },
          { id: 'categories', label: 'Expense Categories', icon: FolderPlus },
          { id: 'reports', label: 'Financial Summary & Reports', icon: BarChart3 },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Icon size={15} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ==================== SUB-TAB 1: EXPENSE MANAGEMENT ==================== */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          
          {/* Add Expense Form Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <PlusCircle className="text-teal-400" size={18} /> Record New Panchayat Expense
            </h3>

            <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Work / Expense Title *</label>
                <input 
                  required
                  type="text" 
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  placeholder="e.g., Solar Light Batteries Replacement"
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Category *</label>
                <select 
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-teal-500"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Amount (₹) *</label>
                <input 
                  required
                  type="number" 
                  min="1"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  placeholder="e.g., 45000"
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Date *</label>
                <input 
                  required
                  type="date" 
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Vendor / Contractor</label>
                <input 
                  type="text" 
                  value={expVendor}
                  onChange={(e) => setExpVendor(e.target.value)}
                  placeholder="e.g., Laxmi Electricals"
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Invoice / Receipt No.</label>
                <input 
                  type="text" 
                  value={expReceipt}
                  onChange={(e) => setExpReceipt(e.target.value)}
                  placeholder="e.g., INV-4050"
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-2">
                <label className="block text-xs text-slate-300 font-medium mb-1">Description / Bill Notes</label>
                <input 
                  type="text" 
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="e.g., Installed 4 maintenance-free deep cycle batteries"
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isSavingExp}
                  className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Save size={15} /> {isSavingExp ? 'Saving...' : 'Save Expense Record'}
                </button>
              </div>
            </form>
          </div>

          {/* Manage All Expenses Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 bg-slate-900/60 border-b border-slate-700 flex justify-between items-center">
              <h4 className="text-sm font-bold text-white">All Recorded Expenditures ({expenses.length})</h4>
              <span className="text-xs text-teal-400 font-bold">
                Total Spent: ₹{Number(stats.totalSpent || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-900/30 text-slate-400 uppercase border-b border-slate-700">
                    <th className="p-3.5">ID / Date</th>
                    <th className="p-3.5">Title</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Vendor</th>
                    <th className="p-3.5">Receipt #</th>
                    <th className="p-3.5 text-right">Amount</th>
                    <th className="p-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {expenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-700/30">
                      <td className="p-3.5">
                        <span className="font-mono text-teal-400 font-bold">#{exp.id}</span>
                        <div className="text-[11px] text-slate-400">{exp.date}</div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-200">{exp.title}</td>
                      <td className="p-3.5">
                        <span className="bg-slate-700 px-2 py-0.5 rounded text-[11px] text-slate-300">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300">{exp.vendor || '—'}</td>
                      <td className="p-3.5 font-mono text-slate-400">{exp.receipt_no || exp.receipt || '—'}</td>
                      <td className="p-3.5 text-right font-bold text-teal-400">
                        ₹{Number(exp.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditingExpense(exp)}
                            className="p-1.5 text-slate-400 hover:text-teal-400 bg-slate-900 rounded border border-slate-700"
                            title="Edit Expense"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-900 rounded border border-slate-700"
                            title="Delete Expense"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ==================== SUB-TAB 2: COMPLAINT MANAGEMENT ==================== */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          
          {/* Filter Toolbar */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search ID, title, ward..."
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-2 outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto">
              <select value={adminCmpCat} onChange={(e) => setAdminCmpCat(e.target.value)} className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 outline-none">
                <option value="All">All Categories</option>
                {complaintCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select value={adminCmpPrio} onChange={(e) => setAdminCmpPrio(e.target.value)} className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 outline-none">
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select value={adminCmpStat} onChange={(e) => setAdminCmpStat(e.target.value)} className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 outline-none">
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Grievance Queue */}
          <div className="space-y-3">
            {filteredAdminComplaints.map(item => (
              <div 
                key={item.id} 
                className={`bg-slate-800 border rounded-2xl p-5 shadow-md ${
                  item.priority === 'Critical' ? 'border-rose-500/40 bg-slate-800/90' : 'border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-4 mb-3">
                  <div className="space-y-1 flex-grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20">
                        {item.tracking_id || item.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        item.priority === 'Critical' ? 'bg-rose-500/20 text-rose-400' :
                        item.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        item.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-teal-500/20 text-teal-400'
                      }`}>
                        {item.priority} Priority
                      </span>
                      <span className="bg-slate-900 px-2 py-0.5 rounded text-xs text-slate-300 border border-slate-700">
                        {item.category}
                      </span>
                      <span className="text-slate-500 text-xs">{item.date}</span>
                    </div>

                    <h4 className="text-base font-bold text-white pt-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin size={12} className="text-teal-400" /> {item.location}
                    </p>
                  </div>

                  {/* Status Dropdown Control */}
                  <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700 shrink-0">
                    <label className="text-xs text-slate-400 font-medium">Status:</label>
                    <select
                      value={item.status}
                      onChange={(e) => handleComplaintStatusChange(item.id, e.target.value)}
                      className="bg-slate-800 border border-teal-500/40 text-slate-200 text-xs font-bold rounded px-2.5 py-1 outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-700/60 mb-3 leading-relaxed">
                  {item.description}
                </p>

                {item.image && (
                  <button
                    onClick={() => onViewImage(item.image)}
                    className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:underline mb-3"
                  >
                    <ImageIcon size={13} /> View Citizen Photo Attachment
                  </button>
                )}

                {/* Official Response Remark */}
                <div className="border-t border-slate-700 pt-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
                      <MessageSquare size={13} /> Official Panchayat Response
                    </span>
                    {editingRemarkId !== item.id && (
                      <button
                        onClick={() => { setEditingRemarkId(item.id); setRemarkText(item.response || ''); }}
                        className="text-xs text-slate-400 hover:text-teal-400"
                      >
                        {item.response ? 'Edit Remarks' : '+ Add Official Remark'}
                      </button>
                    )}
                  </div>

                  {editingRemarkId === item.id ? (
                    <div className="space-y-2">
                      <textarea
                        rows="2"
                        value={remarkText}
                        onChange={(e) => setRemarkText(e.target.value)}
                        placeholder="Type resolution remark or contractor dispatch note..."
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-teal-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setEditingRemarkId(null); setRemarkText(''); }}
                          className="px-3 py-1 rounded text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveRemark(item.id)}
                          className="px-3 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded"
                        >
                          Save Remark
                        </button>
                      </div>
                    </div>
                  ) : (
                    item.response ? (
                      <p className="text-xs text-teal-200 italic bg-teal-950/20 border border-teal-500/20 p-2.5 rounded-lg">
                        "{item.response}"
                      </p>
                    ) : (
                      <span className="text-xs text-slate-500 italic">No official remark saved yet.</span>
                    )
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ==================== SUB-TAB 3: CATEGORIES MANAGEMENT ==================== */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <div className="md:col-span-5 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <FolderPlus className="text-teal-400" size={18} /> Add New Expense Category
            </h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name *</label>
                <input
                  required
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g., Solar Pump Installation"
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Budget (₹)</label>
                <input
                  type="number"
                  value={newCatBudget}
                  onChange={(e) => setNewCatBudget(e.target.value)}
                  placeholder="e.g., 200000"
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition-colors shadow-md"
              >
                + Add Category to Database
              </button>
            </form>
          </div>

          <div className="md:col-span-7 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
            <h3 className="text-base font-bold text-white mb-4">Active Expense Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-200 truncate">{cat}</span>
                  <Tag size={14} className="text-teal-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==================== SUB-TAB 4: REPORTS ==================== */}
      {activeTab === 'reports' && (
        <ReportsSection stats={stats} expenses={expenses} projects={[]} />
      )}

      {/* EDIT EXPENSE MODAL */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Edit3 size={18} className="text-teal-400" /> Edit Expense #{editingExpense.id}
            </h3>

            <form onSubmit={handleUpdateExpense} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Work Title</label>
                <input
                  type="text"
                  value={editingExpense.title}
                  onChange={(e) => setEditingExpense({ ...editingExpense, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={editingExpense.category}
                    onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 outline-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={editingExpense.amount}
                    onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Vendor</label>
                  <input
                    type="text"
                    value={editingExpense.vendor || ''}
                    onChange={(e) => setEditingExpense({ ...editingExpense, vendor: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Receipt No.</label>
                  <input
                    type="text"
                    value={editingExpense.receipt_no || editingExpense.receipt || ''}
                    onChange={(e) => setEditingExpense({ ...editingExpense, receipt_no: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// =====================================================================
// 10. SHARED MODALS (RECEIPT & IMAGE PREVIEW)
// =====================================================================
function ImagePreviewModal({ image, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-white font-bold text-sm flex items-center gap-2">
            <ImageIcon size={16} className="text-teal-400" /> Photo Evidence Attachment
          </h4>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-auto rounded-lg bg-slate-950 flex items-center justify-center p-2">
          <img src={image} alt="Attachment" className="max-h-[70vh] object-contain rounded" />
        </div>
      </div>
    </div>
  );
}

function ReceiptModal({ receipt, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Landmark className="text-teal-400" size={20} />
            <h4 className="text-white font-bold text-base">Official Audit Voucher</h4>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl space-y-2 font-mono text-xs text-slate-300 border border-slate-700/60">
          <div className="flex justify-between">
            <span className="text-slate-500">Project:</span>
            <span className="text-white font-bold">{receipt.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Category:</span>
            <span>{receipt.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Vendor:</span>
            <span>{receipt.vendor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Allocated Budget:</span>
            <span>₹{Number(receipt.budget || receipt.allocated_budget || 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-teal-400 font-bold border-t border-slate-700 pt-2">
            <span>Verified Expenditure:</span>
            <span>₹{Number(receipt.spent || receipt.actual_spent || 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
            <span>Voucher Ref:</span>
            <span>{receipt.receipt_ref || 'VOUCH-2026-PHULERA'}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-500 text-slate-950 font-bold rounded-lg text-xs"
          >
            Close Voucher
          </button>
        </div>
      </div>
    </div>
  );
}

// Auto mount for standalone bundling if run directly
const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}

export default App;

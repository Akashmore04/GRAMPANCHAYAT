import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
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
  RefreshCw
} from 'lucide-react';
import { 
  COMPLAINT_CATEGORIES, 
  COMPLAINT_PRIORITIES, 
  COMPLAINT_STATUSES,
  getStoredComplaints, 
  updateComplaintStatus, 
  sortComplaintsByPriority 
} from '../utils/complaintsData';

export default function AdminDashboard({ onLogout, onNavigateCitizenView }) {
  const [complaints, setComplaints] = useState(() => getStoredComplaints());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingResponseId, setEditingResponseId] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const loadComplaints = () => {
    const raw = getStoredComplaints();
    setComplaints(raw);
  };

  useEffect(() => {
    const handleUpdate = () => loadComplaints();
    window.addEventListener('phulera_complaints_updated', handleUpdate);
    return () => window.removeEventListener('phulera_complaints_updated', handleUpdate);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = updateComplaintStatus(id, newStatus);
    setComplaints(updated);
    showToast(`Complaint #${id} status updated to "${newStatus}"`);
  };

  const handleSaveResponse = (id) => {
    const current = complaints.find(c => c.id === id);
    if (!current) return;
    const updated = updateComplaintStatus(id, current.status, responseText.trim());
    setComplaints(updated);
    setEditingResponseId(null);
    setResponseText('');
    showToast(`Official remark saved for Complaint #${id}`);
  };

  // Filter complaints
  const filtered = complaints.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchPrio = selectedPriority === 'All' || item.priority === selectedPriority;
    const matchStat = selectedStatus === 'All' || item.status === selectedStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || 
      item.id.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);
    return matchCat && matchPrio && matchStat && matchSearch;
  });

  // Priority sort strictly: Critical -> High -> Medium -> Low
  const sortedComplaints = sortComplaintsByPriority(filtered);

  // Statistics calculation
  const totalCount = complaints.length;
  const criticalCount = complaints.filter(c => c.priority === 'Critical').length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
            Critical Priority
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
            High Priority
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Medium Priority
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            Low Priority
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 size={13} /> Resolved
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/40">
            <Clock size={13} /> In Progress
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <XCircle size={13} /> Rejected
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
            <AlertCircle size={13} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-500 text-slate-950 px-5 py-3 rounded-xl shadow-2xl font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 size={18} /> {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 lg:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-4">
          <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center border border-teal-500/20 text-teal-400 shrink-0">
            <ShieldCheck size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl lg:text-3xl font-bold text-white">Admin Grievance Dashboard</h2>
              <span className="bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                Official Access
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Phulera Gram Panchayat • Review, triage, and update citizen reported issues in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateCitizenView && (
            <button
              onClick={onNavigateCitizenView}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-sm font-medium transition-colors"
            >
              Citizen View
            </button>
          )}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-medium transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Issues</p>
          <div className="text-2xl lg:text-3xl font-bold text-white">{totalCount}</div>
        </div>

        <div className="bg-slate-800 border border-rose-500/30 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-bl-full pointer-events-none"></div>
          <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">Critical Priority</p>
          <div className="text-2xl lg:text-3xl font-bold text-rose-400">{criticalCount}</div>
        </div>

        <div className="bg-slate-800 border border-yellow-500/30 rounded-xl p-5 shadow-sm">
          <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-1">Pending Action</p>
          <div className="text-2xl lg:text-3xl font-bold text-yellow-400">{pendingCount}</div>
        </div>

        <div className="bg-slate-800 border border-blue-500/30 rounded-xl p-5 shadow-sm">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">In Progress</p>
          <div className="text-2xl lg:text-3xl font-bold text-blue-400">{inProgressCount}</div>
        </div>

        <div className="bg-slate-800 border border-emerald-500/30 rounded-xl p-5 shadow-sm col-span-2 sm:col-span-1">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">Resolved</p>
          <div className="text-2xl lg:text-3xl font-bold text-emerald-400">{resolvedCount}</div>
        </div>
      </div>

      {/* Priority Ordering Info Notice */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles size={18} className="text-teal-400 shrink-0" />
          <span>Complaints are automatically ordered by urgency: <strong className="text-rose-400">Critical</strong> → <strong className="text-orange-400">High</strong> → <strong className="text-amber-400">Medium</strong> → <strong className="text-teal-400">Low</strong>.</span>
        </div>
        <button 
          onClick={loadComplaints}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 transition-colors shrink-0"
        >
          <RefreshCw size={12} /> Refresh Data
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-md space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          
          {/* Search Input */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, title, ward, description..."
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm transition-all"
            />
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              >
                <option value="All">All Categories ({complaints.length})</option>
                {COMPLAINT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Priority:</span>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              >
                <option value="All">All Priorities</option>
                {COMPLAINT_PRIORITIES.map(prio => (
                  <option key={prio} value={prio}>{prio}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              >
                <option value="All">All Statuses</option>
                {COMPLAINT_STATUSES.map(stat => (
                  <option key={stat} value={stat}>{stat}</option>
                ))}
              </select>
            </div>

            {(selectedCategory !== 'All' || selectedPriority !== 'All' || selectedStatus !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedPriority('All');
                  setSelectedStatus('All');
                  setSearchQuery('');
                }}
                className="text-xs text-teal-400 hover:underline px-2 py-1"
              >
                Clear Filters
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Complaints List / Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-bold text-white">
            Active Grievance Queue ({sortedComplaints.length})
          </h3>
          <span className="text-xs text-slate-400">
            Sorted by priority severity (Critical first)
          </span>
        </div>

        {sortedComplaints.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
            <AlertCircle size={40} className="mx-auto text-slate-500 mb-3" />
            <h4 className="text-lg font-semibold text-slate-200 mb-1">No Complaints Found</h4>
            <p className="text-slate-400 text-sm">No complaints match your active filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedComplaints.map((item) => {
              const isEditing = editingResponseId === item.id;

              return (
                <div 
                  key={item.id} 
                  className={`bg-slate-800 border rounded-xl p-5 lg:p-6 shadow-md transition-all ${
                    item.priority === 'Critical' 
                      ? 'border-rose-500/40 bg-slate-800/90' 
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                    
                    {/* Left: Identification, Badges, Title */}
                    <div className="space-y-2 flex-grow">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-sm font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-md border border-teal-500/20">
                          {item.id}
                        </span>
                        {getPriorityBadge(item.priority)}
                        <span className="bg-slate-900 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {item.category}
                        </span>
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <Calendar size={12} /> {item.date}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-white leading-snug">
                        {item.title}
                      </h4>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin size={14} className="text-teal-400 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    {/* Right: Status Control Selector */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 shrink-0 bg-slate-900/60 p-3 rounded-xl border border-slate-700/80">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium">Current Status:</span>
                        {getStatusBadge(item.status)}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1 w-full sm:w-auto">
                        <label className="text-xs text-slate-400 font-medium whitespace-nowrap">Change Status:</label>
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="bg-slate-900 border border-teal-500/40 text-slate-200 text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-teal-500 focus:border-teal-500 outline-none cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                  </div>

                  {/* Complaint Description */}
                  <div className="bg-slate-900/50 border border-slate-700/60 rounded-lg p-3.5 mb-4 text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </div>

                  {/* Attachment Preview (if any) */}
                  {item.image && (
                    <div className="mb-4">
                      <button
                        onClick={() => setPreviewImage(item.image)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                      >
                        <ImageIcon size={14} className="text-teal-400" />
                        View Citizen Photo Attachment
                      </button>
                    </div>
                  )}

                  {/* Official Response Section */}
                  <div className="border-t border-slate-700/70 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                        <MessageSquare size={13} /> Official Panchayat Response
                      </span>
                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingResponseId(item.id);
                            setResponseText(item.response || '');
                          }}
                          className="text-xs text-slate-400 hover:text-teal-400 transition-colors"
                        >
                          {item.response ? 'Edit Remarks' : '+ Add Official Remark'}
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 mt-2">
                        <textarea
                          rows={2}
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Type official update / resolution remarks for citizen..."
                          className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500 outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingResponseId(null);
                              setResponseText('');
                            }}
                            className="px-3 py-1 rounded text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveResponse(item.id)}
                            className="px-3 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded transition-colors"
                          >
                            Save Remark
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        {item.response ? (
                          <p className="text-slate-300 italic bg-teal-950/20 border border-teal-500/20 p-2.5 rounded-lg">
                            "{item.response}"
                          </p>
                        ) : (
                          <p className="text-slate-500 italic text-xs">
                            No official remarks recorded yet.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Modal Preview */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="bg-slate-800 border border-slate-700 rounded-2xl p-4 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-white font-bold text-sm flex items-center gap-2">
                <ImageIcon size={16} className="text-teal-400" /> Attached Photo Evidence
              </h4>
              <button 
                onClick={() => setPreviewImage(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto rounded-lg bg-slate-950 flex items-center justify-center p-2">
              <img 
                src={previewImage} 
                alt="Complaint attachment" 
                className="max-h-[70vh] object-contain rounded" 
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

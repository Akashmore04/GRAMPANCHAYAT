import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MapPin, 
  Tag, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  MessageSquare, 
  AlertTriangle, 
  Upload, 
  Calendar, 
  Sparkles, 
  Image as ImageIcon, 
  X, 
  ListFilter,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { 
  COMPLAINT_CATEGORIES, 
  COMPLAINT_PRIORITIES, 
  getStoredComplaints, 
  addComplaint, 
  sortComplaintsByPriority 
} from '../utils/complaintsData';

export default function GrievancePortal() {
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' | 'list'
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  // Feedback & Validation State
  const [formErrors, setFormErrors] = useState({});
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Complaints List & Filter State
  const [complaints, setComplaints] = useState(() => getStoredComplaints());
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewingImage, setViewingImage] = useState(null);

  const loadComplaints = () => {
    setComplaints(getStoredComplaints());
  };

  useEffect(() => {
    const handleUpdate = () => loadComplaints();
    window.addEventListener('phulera_complaints_updated', handleUpdate);
    return () => window.removeEventListener('phulera_complaints_updated', handleUpdate);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('File size exceeds 3MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = 'Problem title is required.';
    if (!category) errors.category = 'Please select a problem category.';
    if (!location.trim()) errors.location = 'Location or Ward is required.';
    if (!priority) errors.priority = 'Please select a priority level.';
    if (!date) errors.date = 'Date is required.';
    if (!description.trim()) errors.description = 'Please describe the problem in detail.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const created = addComplaint({
        title,
        category,
        location,
        priority,
        date,
        description,
        image: imagePreview,
      });

      setSubmittedComplaint(created);
      loadComplaints();

      // Reset form
      setTitle('');
      setCategory('');
      setLocation('');
      setPriority('Medium');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setImagePreview(null);
      setFormErrors({});
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
            Low
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <CheckCircle size={13} /> Resolved
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock size={13} /> In Progress
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle size={13} /> Rejected
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <AlertCircle size={13} /> Pending
          </span>
        );
    }
  };

  // Filter complaints for citizen tracker
  const filteredComplaints = complaints.filter(item => {
    const matchCat = filterCategory === 'All' || item.category === filterCategory;
    const matchPrio = filterPriority === 'All' || item.priority === filterPriority;
    const matchStat = filterStatus === 'All' || item.status === filterStatus;
    return matchCat && matchPrio && matchStat;
  });

  const sortedCitizenComplaints = sortComplaintsByPriority(filteredComplaints);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Portal Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Citizen Grievance & Problem Portal</h2>
          <p className="text-slate-400">
            Report civic and environmental issues directly to Phulera Gram Panchayat officials for prompt action.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex gap-1 self-stretch md:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('submit');
              setSubmittedComplaint(null);
            }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'submit'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle size={16} /> Report a Problem
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText size={16} /> My Complaints ({complaints.length})
          </button>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION MODAL / BANNER */}
      {submittedComplaint && (
        <div className="bg-slate-800 border-2 border-teal-500/40 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/40 shrink-0">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Complaint Submitted Successfully!</h3>
                <p className="text-sm text-slate-400">
                  Your grievance has been officially registered and queued for Panchayat administrative review.
                </p>
              </div>
            </div>
            
            <div className="text-left sm:text-right bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-500 uppercase font-semibold block">Tracking ID</span>
              <span className="font-mono text-lg font-bold text-teal-400">{submittedComplaint.id}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-5 text-sm">
            <div>
              <span className="text-slate-500 text-xs block mb-0.5">Problem Title</span>
              <span className="text-slate-200 font-medium">{submittedComplaint.title}</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block mb-0.5">Category</span>
              <span className="text-slate-200 font-medium">{submittedComplaint.category}</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block mb-0.5">Location</span>
              <span className="text-slate-200 font-medium">{submittedComplaint.location}</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block mb-0.5">Assigned Priority</span>
              {getPriorityBadge(submittedComplaint.priority)}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-700/80">
            <button
              onClick={() => setActiveTab('list')}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-sm transition-colors"
            >
              View in "My Complaints"
            </button>
            <button
              onClick={() => setSubmittedComplaint(null)}
              className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg text-sm transition-colors"
            >
              Report Another Problem
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: REPORT A PROBLEM FORM */}
      {activeTab === 'submit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left / Main Form Column */}
          <div className="lg:col-span-8 bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <MessageSquare className="text-yellow-400" /> New Problem Submission Form
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Please provide accurate details so the Panchayat staff can locate and resolve the issue quickly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Problem Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                  Problem Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Street garbage pileup near Ward 3 market"
                  className={`w-full bg-slate-900 border text-slate-200 rounded-lg px-4 py-3 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all ${
                    formErrors.title ? 'border-rose-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.title && (
                  <p className="text-rose-400 text-xs mt-1">{formErrors.title}</p>
                )}
              </div>

              {/* Problem Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                  Problem Category <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {COMPLAINT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-3 text-left rounded-xl border flex items-center gap-2.5 transition-all text-sm ${
                        category === cat
                          ? 'bg-yellow-500/15 border-yellow-500 text-yellow-300 font-semibold shadow-inner'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      <Tag size={16} className={category === cat ? 'text-yellow-400' : 'text-slate-500'} />
                      <span className="truncate">{cat}</span>
                    </button>
                  ))}
                </div>
                {formErrors.category && (
                  <p className="text-rose-400 text-xs mt-1">{formErrors.category}</p>
                )}
              </div>

              {/* Location and Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                    Location / Ward <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Ward 4, Near Water Tank"
                      className={`w-full bg-slate-900 border text-slate-200 rounded-lg pl-10 pr-4 py-3 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all ${
                        formErrors.location ? 'border-rose-500' : 'border-slate-700'
                      }`}
                    />
                  </div>
                  {formErrors.location && (
                    <p className="text-rose-400 text-xs mt-1">{formErrors.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                    Date of Occurrence <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={`w-full bg-slate-900 border text-slate-200 rounded-lg pl-10 pr-4 py-3 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all ${
                        formErrors.date ? 'border-rose-500' : 'border-slate-700'
                      }`}
                    />
                  </div>
                  {formErrors.date && (
                    <p className="text-rose-400 text-xs mt-1">{formErrors.date}</p>
                  )}
                </div>
              </div>

              {/* Priority Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                  Severity / Priority Level <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {COMPLAINT_PRIORITIES.map((prio) => {
                    const isSelected = priority === prio;
                    let style = 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500';
                    if (isSelected) {
                      if (prio === 'Critical') style = 'border-rose-500 bg-rose-500/20 text-rose-300 font-bold';
                      else if (prio === 'High') style = 'border-orange-500 bg-orange-500/20 text-orange-300 font-bold';
                      else if (prio === 'Medium') style = 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold';
                      else style = 'border-teal-500 bg-teal-500/20 text-teal-300 font-bold';
                    }

                    return (
                      <button
                        key={prio}
                        type="button"
                        onClick={() => setPriority(prio)}
                        className={`py-2.5 px-3 rounded-xl border text-center text-sm transition-all flex items-center justify-center gap-2 ${style}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${
                          prio === 'Critical' ? 'bg-rose-400' :
                          prio === 'High' ? 'bg-orange-400' :
                          prio === 'Medium' ? 'bg-amber-400' : 'bg-teal-400'
                        }`}></span>
                        {prio}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                  Problem Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide comprehensive details about the issue, affected residents, duration, etc..."
                  className={`w-full bg-slate-900 border text-slate-200 rounded-lg p-4 focus:ring-yellow-500 focus:border-yellow-500 outline-none resize-none transition-all text-sm leading-relaxed ${
                    formErrors.description ? 'border-rose-500' : 'border-slate-700'
                  }`}
                ></textarea>
                {formErrors.description && (
                  <p className="text-rose-400 text-xs mt-1">{formErrors.description}</p>
                )}
              </div>

              {/* Optional Image / File Attachment */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                  Attach Photo Evidence <span className="text-slate-500 text-xs font-normal">(Optional, max 3MB)</span>
                </label>
                
                {imagePreview ? (
                  <div className="relative inline-block border border-slate-700 rounded-xl overflow-hidden bg-slate-900 p-2">
                    <img
                      src={imagePreview}
                      alt="Attachment Preview"
                      className="h-32 w-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-3 right-3 bg-red-600 hover:bg-red-500 text-white rounded-full p-1 shadow-md transition-colors"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-700 hover:border-yellow-500/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all group">
                    <Upload className="text-slate-500 group-hover:text-yellow-400 transition-colors mb-2" size={24} />
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white">
                      Click to upload photo or screenshot
                    </span>
                    <span className="text-xs text-slate-500 mt-1">PNG, JPG, JPEG up to 3MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-teal-400" /> All submissions are recorded in public records
                </span>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold px-7 py-3 rounded-xl transition-all shadow-lg shadow-yellow-500/10 disabled:opacity-50"
                >
                  <Send size={18} /> {isSubmitting ? 'Registering...' : 'Submit Official Grievance'}
                </button>
              </div>

            </form>
          </div>

          {/* Right Guide / Info Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Process Info */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-md">
              <h4 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-teal-400" size={20} /> Resolution Timeline
              </h4>
              <ul className="space-y-3.5 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-rose-500/30">1</span>
                  <div>
                    <strong className="text-rose-400 block font-semibold">Critical Issues</strong>
                    <span className="text-xs text-slate-400">Inspected within 24 hours (pipeline bursts, contamination).</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-orange-500/30">2</span>
                  <div>
                    <strong className="text-orange-400 block font-semibold">High Priority</strong>
                    <span className="text-xs text-slate-400">Action initiated in 48 hours (sewage blocks, major pollution).</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-amber-500/30">3</span>
                  <div>
                    <strong className="text-amber-400 block font-semibold">Medium & Low</strong>
                    <span className="text-xs text-slate-400">Resolved during weekly maintenance rounds (3-5 days).</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick Link to My Complaints */}
            <div className="bg-slate-800 border border-teal-500/30 rounded-2xl p-6 shadow-md text-center">
              <h4 className="font-bold text-white text-base mb-2">Track Existing Issue</h4>
              <p className="text-xs text-slate-400 mb-4">
                Check live Panchayat action notes, contractor dispatches, and resolution timestamps.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="w-full py-2.5 px-4 bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/40 rounded-xl text-sm font-semibold transition-colors"
              >
                Go to "My Complaints" ({complaints.length})
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: MY COMPLAINTS & LIVE TRACKER */}
      {activeTab === 'list' && (
        <div className="space-y-6">
          
          {/* Tracker Filters Bar */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-md flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ListFilter size={18} className="text-teal-400" /> Filter Grievances:
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-teal-500 outline-none"
              >
                <option value="All">All Categories ({complaints.length})</option>
                {COMPLAINT_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-teal-500 outline-none"
              >
                <option value="All">All Priorities</option>
                {COMPLAINT_PRIORITIES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-teal-500 outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>

              {(filterCategory !== 'All' || filterPriority !== 'All' || filterStatus !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterCategory('All');
                    setFilterPriority('All');
                    setFilterStatus('All');
                  }}
                  className="text-xs text-teal-400 hover:underline px-2 py-1"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Complaints List Cards */}
          {sortedCitizenComplaints.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
              <AlertCircle size={40} className="mx-auto text-slate-500 mb-3" />
              <h4 className="text-lg font-semibold text-slate-200 mb-1">No Complaints Found</h4>
              <p className="text-slate-400 text-sm mb-4">No records match your selected filter options.</p>
              <button
                type="button"
                onClick={() => setActiveTab('submit')}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold rounded-lg text-sm transition-colors inline-flex items-center gap-1.5"
              >
                <AlertTriangle size={16} /> Submit a Problem
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sortedCitizenComplaints.map((item) => (
                <div 
                  key={item.id} 
                  className={`bg-slate-800 border rounded-2xl p-6 shadow-md flex flex-col justify-between transition-all ${
                    item.priority === 'Critical' ? 'border-rose-500/40' : 'border-slate-700'
                  }`}
                >
                  <div>
                    {/* Card Top: ID, Priority, Date, Status */}
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-teal-400 font-mono text-xs font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          {item.id}
                        </span>
                        {getPriorityBadge(item.priority)}
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <Calendar size={11} /> {item.date}
                        </span>
                      </div>
                      
                      <div>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>

                    {/* Title and Category */}
                    <h4 className="text-white font-bold text-base mb-1.5 leading-snug">
                      {item.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                      <span className="bg-slate-900 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <MapPin size={12} className="text-teal-400" /> {item.location}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-sm mb-4 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-700/50">
                      {item.description}
                    </p>

                    {/* Image Attachment (if present) */}
                    {item.image && (
                      <div className="mb-4">
                        <button
                          type="button"
                          onClick={() => setViewingImage(item.image)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                        >
                          <ImageIcon size={13} className="text-teal-400" /> View Attached Photo Evidence
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Panchayat Response Area */}
                  <div className="border-t border-slate-700/70 pt-3 mt-2">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider text-[11px] block mb-1">
                      Panchayat Response & Action
                    </span>
                    {item.response ? (
                      <div className="bg-teal-950/20 border border-teal-500/20 rounded-lg p-2.5 text-xs text-teal-200">
                        "{item.response}"
                      </div>
                    ) : (
                      <span className="text-slate-500 italic text-xs">
                        Awaiting official review and contractor assignment...
                      </span>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Image Modal for Viewing Attachments */}
      {viewingImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setViewingImage(null)}
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
                type="button"
                onClick={() => setViewingImage(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto rounded-lg bg-slate-950 flex items-center justify-center p-2">
              <img 
                src={viewingImage} 
                alt="Evidence" 
                className="max-h-[70vh] object-contain rounded" 
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

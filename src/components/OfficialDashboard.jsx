import React, { useState } from 'react';
import { PlusCircle, Save, CheckCircle, Clock, AlertCircle, IndianRupee } from 'lucide-react';

const MOCK_GRIEVANCES = [
  { id: 'GRV-001', name: 'Ramesh Kumar', category: 'Water Supply', desc: 'No water supply in Ward 4 since 2 days', status: 'In Progress', date: '2026-08-19' },
  { id: 'GRV-002', name: 'Sita Devi', category: 'Road', desc: 'Potholes near the main market entrance', status: 'Pending', date: '2026-08-20' },
  { id: 'GRV-003', name: 'Abdul Khan', category: 'Electricity', desc: 'Street lights not working in North street', status: 'Resolved', date: '2026-08-10' },
];

export default function OfficialDashboard() {
  const [expenseSaved, setExpenseSaved] = useState(false);
  const [grievances, setGrievances] = useState(MOCK_GRIEVANCES);

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    setExpenseSaved(true);
    setTimeout(() => setExpenseSaved(false), 3000);
    e.target.reset();
  };

  const updateStatus = (id, newStatus) => {
    setGrievances(grievances.map(g => g.id === id ? { ...g, status: newStatus } : g));
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'Resolved': return <CheckCircle size={16} className="text-green-500" />;
      case 'In Progress': return <Clock size={16} className="text-blue-500" />;
      default: return <AlertCircle size={16} className="text-orange-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Official Administration Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Expense Entry */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <PlusCircle size={20} className="text-brand-blue" />
              Log Daily Expense
            </h3>
            
            {expenseSaved && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2 text-sm">
                <CheckCircle size={16} /> Expense logged successfully!
              </div>
            )}
            
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input required type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue">
                  <option value="">Select Category</option>
                  <option value="Road Repair">Road Repair</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Water Supply">Water Supply</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee size={16} className="text-gray-500" />
                  </div>
                  <input required type="number" min="1" className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" placeholder="0.00" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description / Bill Ref.</label>
                <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" placeholder="e.g., Bill #4532" />
              </div>

              <button type="submit" className="w-full bg-brand-green hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors flex justify-center items-center gap-2">
                <Save size={18} /> Save Record
              </button>
            </form>
          </div>
        </div>

        {/* Grievance Management Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <AlertCircle size={20} className="text-brand-blue" />
                Citizen Grievance Management
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-gray-600 border-b">
                    <th className="p-4 font-medium text-sm">ID / Date</th>
                    <th className="p-4 font-medium text-sm">Citizen Details</th>
                    <th className="p-4 font-medium text-sm">Problem Description</th>
                    <th className="p-4 font-medium text-sm">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {grievances.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 align-top">
                        <div className="font-medium text-brand-blue">{item.id}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.date}</div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="font-medium text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-1 border px-2 py-0.5 rounded inline-block">{item.category}</div>
                      </td>
                      <td className="p-4 align-top max-w-xs">
                        <p className="text-sm text-gray-700">{item.desc}</p>
                      </td>
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-2">
                          <StatusIcon status={item.status} />
                          <select 
                            value={item.status}
                            onChange={(e) => updateStatus(item.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-brand-blue outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

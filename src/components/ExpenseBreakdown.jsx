import React, { useState } from 'react';
import { IndianRupee } from 'lucide-react';

const MOCK_TRANSACTIONS = [
  { id: 'TXN-901', title: 'Main Road Phase 1 Paving', category: 'Infrastructure', date: '2026-08-15', vendor: 'Shree Constructions', receipt: 'INV-4022', amount: 450000 },
  { id: 'TXN-902', title: 'Primary School Roof Repair', category: 'Education', date: '2026-08-10', vendor: 'Local Builders Co.', receipt: 'INV-4010', amount: 85000 },
  { id: 'TXN-903', title: 'Water Pump Installation', category: 'Water Supply', date: '2026-08-05', vendor: 'JalTech Solutions', receipt: 'INV-3998', amount: 120000 },
  { id: 'TXN-904', title: 'Street Light Bulbs (50 units)', category: 'Electricity', date: '2026-08-01', vendor: 'Laxmi Electricals', receipt: 'INV-3985', amount: 25000 },
  { id: 'TXN-905', title: 'Panchayat Office WiFi Renewal', category: 'Admin', date: '2026-07-28', vendor: 'BharatNet', receipt: 'INV-3960', amount: 5000 },
];

export default function ExpenseBreakdown() {
  const [filter, setFilter] = useState('All');
  const [category, setCategory] = useState('All Categories');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Where Money Goes</h2>
          <p className="text-slate-400">Detailed breakdown of all Panchayat expenditures.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Time Filter */}
          <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex">
            {['All', 'Today', 'Week', 'Year'].map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === t ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          >
            <option>All Categories</option>
            <option>Infrastructure</option>
            <option>Education</option>
            <option>Water Supply</option>
            <option>Electricity</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider border-b border-slate-700">
                <th className="p-4 font-semibold">Work / Title</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Vendor / Supplier</th>
                <th className="p-4 font-semibold">Receipt / Inv #</th>
                <th className="p-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {MOCK_TRANSACTIONS.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-4 text-slate-200 font-medium">{txn.title}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-700 text-slate-300 border border-slate-600">
                      {txn.category}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-sm">{txn.date}</td>
                  <td className="p-4 text-slate-300 text-sm">{txn.vendor}</td>
                  <td className="p-4 text-slate-400 text-sm font-mono">{txn.receipt}</td>
                  <td className="p-4 text-right text-teal-400 font-bold flex items-center justify-end gap-1">
                    <IndianRupee size={14} />
                    {txn.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex justify-between items-center text-sm text-slate-400">
          <span>Showing 1 to 5 of 124 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700">Prev</button>
            <button className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

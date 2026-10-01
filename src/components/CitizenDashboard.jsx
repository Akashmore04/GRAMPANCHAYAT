import React, { useState } from 'react';
import { PieChart, BarChart3, TrendingUp, IndianRupee } from 'lucide-react';

const MOCK_DATA = {
  today: { total: 45000, categories: [{name: 'Road Repair', amount: 20000}, {name: 'Electricity', amount: 25000}] },
  week: { total: 125000, categories: [{name: 'Road Repair', amount: 50000}, {name: 'Electricity', amount: 25000}, {name: 'Water Supply', amount: 50000}] },
  month: { total: 850000, categories: [{name: 'Road Repair', amount: 200000}, {name: 'Electricity', amount: 150000}, {name: 'Water Supply', amount: 300000}, {name: 'Education', amount: 100000}, {name: 'Healthcare', amount: 100000}] },
  year: { total: 4500000, categories: [{name: 'Road Repair', amount: 1200000}, {name: 'Electricity', amount: 800000}, {name: 'Water Supply', amount: 1500000}, {name: 'Education', amount: 500000}, {name: 'Healthcare', amount: 500000}] }
};

const MOCK_PROJECTS = [
  { id: 1, name: 'Main Road Phase 1', budget: 1500000, spent: 1200000, status: 'In Progress' },
  { id: 2, name: 'Primary School Renovation', budget: 800000, spent: 800000, status: 'Completed' },
  { id: 3, name: 'Water Tank Construction', budget: 2000000, spent: 500000, status: 'In Progress' }
];

export default function CitizenDashboard() {
  const [timeframe, setTimeframe] = useState('month');
  
  const currentData = MOCK_DATA[timeframe];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Financial Transparency Dashboard</h2>
        
        {/* Time Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-1 inline-flex">
          {['today', 'week', 'month', 'year'].map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                timeframe === t ? 'bg-brand-blue text-white shadow' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t === 'today' ? 'Today' : `This ${t}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Expense Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <TrendingUp size={20} />
            <span className="font-medium">Total Expenses ({timeframe})</span>
          </div>
          <div className="text-4xl font-bold text-gray-800 flex items-center">
            <IndianRupee size={32} />
            {currentData.total.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-gray-800 font-semibold mb-4 text-lg">
            <PieChart size={20} className="text-brand-blue" />
            Category Breakdown
          </div>
          <div className="space-y-4">
            {currentData.categories.map(cat => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{cat.name}</span>
                  <span className="text-gray-500 flex items-center"><IndianRupee size={12}/>{cat.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-brand-green h-2.5 rounded-full" 
                    style={{ width: `${(cat.amount / currentData.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 text-gray-800 font-semibold mb-4 text-lg">
          <BarChart3 size={20} className="text-brand-blue" />
          Project-Specific Tracking
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="p-3 font-medium">Project Name</th>
                <th className="p-3 font-medium text-right">Allocated Budget</th>
                <th className="p-3 font-medium text-right">Actual Spent</th>
                <th className="p-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PROJECTS.map(proj => (
                <tr key={proj.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{proj.name}</td>
                  <td className="p-3 text-right text-gray-600 flex items-center justify-end"><IndianRupee size={14}/>{proj.budget.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right text-gray-600 flex items-center justify-end"><IndianRupee size={14}/>{proj.spent.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      proj.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {proj.status}
                    </span>
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

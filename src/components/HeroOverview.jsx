import React from 'react';
import { IndianRupee, Building2 } from 'lucide-react';

export default function HeroOverview() {
  const stats = [
    { label: "Total Annual Grant", value: 2500000, prefix: "₹" },
    { label: "Total Spent YTD", value: 1245000, prefix: "₹" },
    { label: "Remaining Balance", value: 1255000, prefix: "₹" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <div className="text-center py-10 space-y-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Transparent Governance <br className="hidden md:block"/> & Citizen Services
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Track every rupee spent in Phulera. We are committed to absolute transparency, accountability, and the rapid development of our village.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const percentage = (stat.value / 2500000) * 100;
          return (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">{stat.label}</p>
              <div className="text-3xl font-bold text-white flex items-center gap-1 mb-4">
                <IndianRupee size={24} className="text-teal-400" />
                {stat.value.toLocaleString('en-IN')}
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${i === 1 ? 'bg-teal-500' : 'bg-teal-600'}`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Funds Sources */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Building2 className="text-teal-400" />
          Village Fund Sources & Grants
        </h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-slate-300">Central Government Grants (MGNREGA, 15th FC)</span>
              <span className="text-teal-400 font-bold flex items-center"><IndianRupee size={12}/> 15,00,000</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3">
              <div className="bg-teal-400 h-3 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-slate-300">State Government Funds</span>
              <span className="text-teal-400 font-bold flex items-center"><IndianRupee size={12}/> 7,00,000</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3">
              <div className="bg-teal-500 h-3 rounded-full" style={{ width: '28%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-slate-300">Local Panchayat Tax Revenue</span>
              <span className="text-teal-400 font-bold flex items-center"><IndianRupee size={12}/> 3,00,000</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3">
              <div className="bg-teal-600 h-3 rounded-full" style={{ width: '12%' }}></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

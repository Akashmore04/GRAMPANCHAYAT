import React from 'react';
import { IndianRupee, Clock, ThumbsUp, Calendar } from 'lucide-react';

const PLANS = {
  approved: [
    { id: 1, title: 'New Anganwadi Building', cost: 450000, date: 'Oct 2026' },
    { id: 2, title: 'Main Market Drainage', cost: 120000, date: 'Nov 2026' },
  ],
  discussion: [
    { id: 3, title: 'Public Park Fencing', cost: 85000 },
    { id: 4, title: 'Panchayat WiFi Extension', cost: 15000 },
  ],
  proposed: [
    { id: 5, title: 'Library Construction', cost: 300000 },
    { id: 6, title: 'Solar Panels for School', cost: 200000 },
    { id: 7, title: 'Veterinary Clinic Upgrade', cost: 150000 },
  ]
};

const Column = ({ title, items, icon: Icon, colorClass }) => (
  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col h-full min-h-[500px]">
    <div className="flex items-center gap-2 mb-6 px-2">
      <Icon className={colorClass} size={20} />
      <h3 className="font-bold text-white text-lg">{title}</h3>
      <span className="ml-auto bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full">{items.length}</span>
    </div>
    
    <div className="flex-1 space-y-4">
      {items.map(item => (
        <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-sm hover:border-slate-500 transition-colors cursor-pointer group">
          <h4 className="font-semibold text-slate-200 mb-3 group-hover:text-white transition-colors">{item.title}</h4>
          <div className="flex justify-between items-center text-sm">
            <span className="text-teal-400 font-medium flex items-center">
              <IndianRupee size={12} /> {item.cost.toLocaleString('en-IN')}
            </span>
            {item.date ? (
              <span className="text-slate-400 flex items-center gap-1">
                <Calendar size={12} /> {item.date}
              </span>
            ) : (
              <span className="text-slate-500 text-xs italic">TBD</span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function UpcomingPlans() {

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Upcoming Plans (Roadmap)</h2>
        <p className="text-slate-400">Future projects and infrastructure developments proposed for Phulera.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column title="Approved in Gram Sabha" items={PLANS.approved} icon={ThumbsUp} colorClass="text-teal-400" />
        <Column title="Under Discussion" items={PLANS.discussion} icon={Clock} colorClass="text-yellow-400" />
        <Column title="Proposed" items={PLANS.proposed} icon={Calendar} colorClass="text-slate-400" />
      </div>
    </div>
  );
}

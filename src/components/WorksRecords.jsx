import React from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

export default function WorksRecords() {
  const projects = [
    {
      id: 1,
      title: 'Main Road Phase 1 Paving',
      category: 'Infrastructure',
      vendor: 'Shree Constructions',
      image: '/road.png',
    },
    {
      id: 2,
      title: 'Primary School Roof Repair',
      category: 'Education',
      vendor: 'Local Builders Co.',
      image: '/school.png',
    },
    {
      id: 3,
      title: 'Village Water Tank Installation',
      category: 'Water Supply',
      vendor: 'JalTech Solutions',
      image: '/water-tank.png',
    },
    {
      id: 4,
      title: 'Community Solar Lights',
      category: 'Electricity',
      vendor: 'EcoLight India',
      image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Works & Records</h2>
        <p className="text-slate-400">Verified completed projects with photographic evidence and official receipts.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700/60 flex flex-col hover:border-slate-500 transition-colors duration-300 shadow-lg shadow-black/20"
          >
            {/* Image Container with Badges */}
            <div className="relative h-48 w-full bg-slate-800">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Category Badge (Top Left) */}
              <div className="absolute top-3 left-3">
                <span className="bg-slate-900/80 text-slate-200 text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-md border border-slate-700/50 shadow-sm">
                  {project.category}
                </span>
              </div>
              
              {/* Verified Status Icon (Top Right) */}
              <div className="absolute top-3 right-3 bg-slate-900/80 rounded-full p-1 backdrop-blur-md border border-slate-700/50 shadow-sm">
                <CheckCircle2 size={18} className="text-teal-400" />
              </div>
            </div>

            {/* Card Content & Details */}
            <div className="p-5 flex flex-col flex-grow space-y-3">
              <h3 className="text-lg font-bold text-white leading-tight">
                {project.title}
              </h3>
              
              <p className="text-sm text-slate-400 flex items-center gap-2 flex-grow">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                Vendor: {project.vendor}
              </p>
              
              {/* Action Button */}
              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-950/30 hover:bg-teal-900/50 text-teal-400 border border-teal-900/50 rounded-lg transition-all duration-200 text-sm font-medium group">
                <ExternalLink size={16} className="group-hover:scale-110 transition-transform duration-200" />
                View Official Receipt
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

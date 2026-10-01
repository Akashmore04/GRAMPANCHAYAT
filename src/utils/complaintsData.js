export const COMPLAINT_CATEGORIES = [
  'Garbage Not Collected',
  'Air/Noise/Water Pollution',
  'Drainage or Sewage Problems',
  'Public Sanitation Issues',
  'Water Contamination',
  'Industrial/Environmental Violations',
];

export const COMPLAINT_PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];

export const PRIORITY_ORDER = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

export const COMPLAINT_STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const STORAGE_KEY = 'phulera_panchayat_complaints_v1';

const INITIAL_SEED_COMPLAINTS = [
  {
    id: 'GRV-101',
    title: 'Severe pipeline leakage and muddy water in Ward 4',
    category: 'Water Contamination',
    location: 'Ward 4, Near Primary Health Center',
    priority: 'Critical',
    date: '2026-08-20',
    description: 'Drinking water pipeline broke underground near the clinic. Water is discolored and smelling foul, posing an immediate health hazard to 80+ families.',
    status: 'In Progress',
    image: null,
    response: 'Emergency plumbing crew dispatched. Main valve closed for sanitization and pipe replacement underway.',
    createdAt: 1724140800000,
  },
  {
    id: 'GRV-102',
    title: 'Major sewage overflow onto main market walkway',
    category: 'Drainage or Sewage Problems',
    location: 'Main Bazaar Road, Block B',
    priority: 'High',
    date: '2026-08-19',
    description: 'The open drain has choked completely after morning rains. Sewage is overflowing onto shopfronts and pedestrian walkway.',
    status: 'Pending',
    image: null,
    response: null,
    createdAt: 1724054400000,
  },
  {
    id: 'GRV-103',
    title: 'Unattended waste dump near community hall for 4 days',
    category: 'Garbage Not Collected',
    location: 'Behind Panchayat Bhawan, Ward 2',
    priority: 'Medium',
    date: '2026-08-18',
    description: 'Garbage collection truck skipped Ward 2 for four consecutive days. Stray animals are scattering waste across the road.',
    status: 'Pending',
    image: null,
    response: null,
    createdAt: 1723968000000,
  },
  {
    id: 'GRV-104',
    title: 'Broken sanitation stall doors in public toilet complex',
    category: 'Public Sanitation Issues',
    location: 'Bus Stand Public Sanitation Facility',
    priority: 'Low',
    date: '2026-08-15',
    description: 'Latches and door hinges on stall #2 and #3 are broken, causing inconvenience for travelers and women.',
    status: 'Resolved',
    image: null,
    response: 'Sanitation maintenance contractor installed new stainless steel latches and hinges on all stalls.',
    createdAt: 1723708800000,
  },
  {
    id: 'GRV-105',
    title: 'Illegal chemical runoff into local irrigation pond',
    category: 'Industrial/Environmental Violations',
    location: 'Eastern Boundary, Sector 9 Outskirts',
    priority: 'Critical',
    date: '2026-08-21',
    description: 'A small processing unit on the edge of the village is releasing untreated chemical discharge directly into the communal irrigation pond.',
    status: 'Pending',
    image: null,
    response: null,
    createdAt: 1724227200000,
  },
  {
    id: 'GRV-106',
    title: 'Heavy smoke and burning plastic smell during night hours',
    category: 'Air/Noise/Water Pollution',
    location: 'North Ward 1, Near Old Brick Kiln',
    priority: 'High',
    date: '2026-08-17',
    description: 'Open burning of rubber tires and plastic scrap occurring late night causing severe breathing difficulties for elderly residents.',
    status: 'Resolved',
    image: null,
    response: 'Panchayat team inspected site with village patrol. Offender fined ₹5,000 and burning ceased immediately.',
    createdAt: 1723881600000,
  }
];

export function getStoredComplaints() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_COMPLAINTS));
      return INITIAL_SEED_COMPLAINTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_COMPLAINTS));
    return INITIAL_SEED_COMPLAINTS;
  } catch {
    return INITIAL_SEED_COMPLAINTS;
  }
}

export function saveComplaints(complaints) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    window.dispatchEvent(new Event('phulera_complaints_updated'));
  } catch (err) {
    console.error('Failed to save complaints to localStorage:', err);
  }
}

export function addComplaint(complaintData) {
  const existing = getStoredComplaints();
  const nextNum = Math.floor(100 + Math.random() * 900);
  const newComplaint = {
    id: `GRV-${nextNum}`,
    title: complaintData.title.trim(),
    category: complaintData.category,
    location: complaintData.location.trim(),
    priority: complaintData.priority || 'Medium',
    date: complaintData.date || new Date().toISOString().split('T')[0],
    description: complaintData.description.trim(),
    status: 'Pending',
    image: complaintData.image || null,
    response: null,
    createdAt: Date.now(),
  };

  const updated = [newComplaint, ...existing];
  saveComplaints(updated);
  return newComplaint;
}

export function updateComplaintStatus(id, newStatus, responseText = undefined) {
  const existing = getStoredComplaints();
  const updated = existing.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status: newStatus,
        ...(responseText !== undefined ? { response: responseText } : {}),
      };
    }
    return item;
  });
  saveComplaints(updated);
  return updated;
}

export function updateComplaintResponse(id, responseText) {
  const existing = getStoredComplaints();
  const updated = existing.map(item => {
    if (item.id === id) {
      return {
        ...item,
        response: responseText,
      };
    }
    return item;
  });
  saveComplaints(updated);
  return updated;
}

export function sortComplaintsByPriority(complaints) {
  return [...complaints].sort((a, b) => {
    const priorityA = PRIORITY_ORDER[a.priority] !== undefined ? PRIORITY_ORDER[a.priority] : 99;
    const priorityB = PRIORITY_ORDER[b.priority] !== undefined ? PRIORITY_ORDER[b.priority] : 99;
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    // If same priority, newest date / timestamp first
    const dateA = new Date(a.date || a.createdAt || 0).getTime();
    const dateB = new Date(b.date || b.createdAt || 0).getTime();
    return dateB - dateA;
  });
}

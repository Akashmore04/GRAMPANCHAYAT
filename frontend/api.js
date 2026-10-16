/**
 * =====================================================================
 * GRAM PANCHAYAT EXPENSE TRACKER - API CLIENT
 * =====================================================================
 * Centralized API helper to communicate with the Node.js backend.
 * Handles HTTP requests, error parsing, and query parameter formatting.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // ==================== AUTHENTICATION ====================
  async login(email, password) {
    return request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  // ==================== DASHBOARD & STATS ====================
  async getDashboardStats() {
    return request('/dashboard/stats');
  },

  // ==================== EXPENSES ====================
  async getExpenses(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All' && filters.category !== 'All Categories') {
      params.append('category', filters.category);
    }
    if (filters.timeframe && filters.timeframe !== 'All') {
      params.append('timeframe', filters.timeframe);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    return request(`/expenses${query}`);
  },

  async addExpense(expenseData) {
    return request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData)
    });
  },

  async updateExpense(id, expenseData) {
    return request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData)
    });
  },

  async deleteExpense(id) {
    return request(`/expenses/${id}`, {
      method: 'DELETE'
    });
  },

  // ==================== EXPENSE CATEGORIES ====================
  async getExpenseCategories() {
    return request('/expense-categories');
  },

  async addExpenseCategory(categoryData) {
    return request('/expense-categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  },

  // ==================== CITIZEN COMPLAINTS / GRIEVANCE ====================
  async getComplaints(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.priority && filters.priority !== 'All') params.append('priority', filters.priority);
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const query = params.toString() ? `?${params.toString()}` : '';
    return request(`/complaints${query}`);
  },

  async addComplaint(complaintData) {
    return request('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData)
    });
  },

  async updateComplaint(id, updates) {
    return request(`/complaints/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteComplaint(id) {
    return request(`/complaints/${id}`, {
      method: 'DELETE'
    });
  },

  async getComplaintCategories() {
    return request('/complaint-categories');
  },

  // ==================== PROJECTS & ROADMAP ====================
  async getProjects() {
    return request('/projects');
  },

  async getPlans() {
    return request('/plans');
  }
};

export default api;

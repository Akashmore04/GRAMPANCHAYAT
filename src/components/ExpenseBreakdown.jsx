import React, { useState, useEffect } from 'react';
import { IndianRupee, Trash2, Edit2 } from 'lucide-react';

export default function ExpenseBreakdown() {
  const [filter, setFilter] = useState('All');
  const [category, setCategory] = useState('All Categories');
  const [transactions, setTransactions] = useState([]);

  // Add form state
  const [title, setTitle] = useState('');
  const [addCategory, setAddCategory] = useState('Infrastructure');
  const [amount, setAmount] = useState('');
  const [vendor, setVendor] = useState('');

  const fetchExpenses = () => {
    let url = `http://localhost:5000/api/expenses?category=${encodeURIComponent(category)}&timeframe=${filter}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
         if(data.success) setTransactions(data.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchExpenses();
  }, [filter, category]);

  const handleAdd = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        category: addCategory,
        amount: parseFloat(amount),
        date: new Date().toISOString().split('T')[0],
        vendor
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setTitle('');
        setAmount('');
        setVendor('');
        fetchExpenses();
      }
    });
  };

  const handleEdit = (txn) => {
    const newAmount = prompt(`Enter new amount for ${txn.title}:`, txn.amount);
    if (newAmount && !isNaN(newAmount)) {
      fetch(`http://localhost:5000/api/expenses/${txn.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...txn, amount: parseFloat(newAmount) })
      }).then(() => fetchExpenses());
    }
  };

  const handleDelete = (id) => {
    if (confirm('Delete this expense?')) {
      fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: 'DELETE'
      }).then(() => fetchExpenses());
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Add Expense Form inline */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Expense Tracker - Log New Expense</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-xs text-slate-400 mb-1">Work / Title</label>
            <input required type="text" value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded px-3 py-2 text-sm focus:ring-teal-500 outline-none" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs text-slate-400 mb-1">Category</label>
            <select required value={addCategory} onChange={e=>setAddCategory(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded px-3 py-2 text-sm focus:ring-teal-500 outline-none">
              <option>Infrastructure</option>
              <option>Education</option>
              <option>Water Supply</option>
              <option>Electricity</option>
              <option>Admin</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs text-slate-400 mb-1">Vendor</label>
            <input type="text" value={vendor} onChange={e=>setVendor(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded px-3 py-2 text-sm focus:ring-teal-500 outline-none" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs text-slate-400 mb-1">Amount (₹)</label>
            <input required type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded px-3 py-2 text-sm focus:ring-teal-500 outline-none" />
          </div>
          <div className="md:col-span-1">
            <button type="submit" className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded transition-colors text-sm">
              Add Expense
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-4">
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
            <option>Admin</option>
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
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-4 text-slate-200 font-medium">{txn.title}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-700 text-slate-300 border border-slate-600">
                      {txn.category}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-sm">{txn.date}</td>
                  <td className="p-4 text-slate-300 text-sm">{txn.vendor}</td>
                  <td className="p-4 text-slate-400 text-sm font-mono">{txn.receipt_no}</td>
                  <td className="p-4 text-right text-teal-400 font-bold flex items-center justify-end gap-1">
                    <IndianRupee size={14} />
                    {txn.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleEdit(txn)} className="text-blue-400 hover:text-blue-300 mx-2"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(txn.id)} className="text-red-400 hover:text-red-300 mx-2"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">No expenses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


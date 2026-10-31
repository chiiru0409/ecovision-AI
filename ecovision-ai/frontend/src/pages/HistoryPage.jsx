import React, { useState, useEffect } from 'react';
import HistoryTable from '../components/history/HistoryTable';
import { api } from '../services/api';
import { History, RotateCw, AlertCircle, Trash2 } from 'lucide-react';

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getHistory({
        category: categoryFilter,
        search: searchQuery,
      });
      setHistoryItems(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve classification history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [categoryFilter, searchQuery]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this classification record?')) return;
    try {
      await api.deleteHistoryItem(id);
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audit Trail & Persistence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Classification History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete database record of all processed images, confidence metrics, and predictions.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold transition-all shadow-sm self-start sm:self-auto"
        >
          <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          <span>Refresh History</span>
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* History Table Component */}
      <HistoryTable
        items={historyItems}
        onDelete={handleDelete}
        onRefresh={fetchHistory}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loading={loading}
      />
    </div>
  );
}

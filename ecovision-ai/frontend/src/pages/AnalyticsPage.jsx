import React, { useState, useEffect } from 'react';
import CategoryPieChart from '../components/analytics/CategoryPieChart';
import TrendsBarChart from '../components/analytics/TrendsBarChart';
import { api } from '../services/api';
import { 
  BarChart3, 
  Layers, 
  RotateCw, 
  Sparkles, 
  PieChart as PieIcon, 
  History, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export default function AnalyticsPage({ setActiveTab }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const total = analytics?.total_classifications || 0;
  const counts = analytics?.category_counts || {
    Cardboard: 0,
    Glass: 0,
    Metal: 0,
    Organic: 0,
    Paper: 0,
    Plastic: 0,
    Trash: 0,
  };

  const statCards = [
    { label: 'Cardboard Items', count: counts['Cardboard'] || 0, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Glass Items', count: counts['Glass'] || 0, color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200' },
    { label: 'Metal Items', count: counts['Metal'] || 0, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' },
    { label: 'Organic Items', count: counts['Organic'] || 0, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Paper Items', count: counts['Paper'] || 0, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Plastic Items', count: counts['Plastic'] || 0, color: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    { label: 'Residual Trash', count: counts['Trash'] || 0, color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Real Database Telemetry</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Waste Stream Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Live counts and distributions backed directly by PostgreSQL / Supabase storage.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold transition-all shadow-sm self-start sm:self-auto"
        >
          <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Primary KPI Card: Total Classifications */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-600/20 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
            Total Classified Waste Images
          </span>
          <div className="flex items-baseline space-x-3 mt-1">
            <span className="text-5xl font-black tracking-tight">{total}</span>
            <span className="text-sm text-emerald-100 font-medium">processed items</span>
          </div>
          <p className="text-xs text-emerald-100/90 mt-2 max-w-md">
            Aggregated in real-time from user uploads and model inference records. No hardcoded or dummy counts.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('classifier')}
          className="px-5 py-2.5 rounded-2xl bg-white text-emerald-900 font-bold text-sm shadow-md hover:bg-emerald-50 transition-all flex items-center space-x-1.5 whitespace-nowrap"
        >
          <span>Classify More Items</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* 7 Stream Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        {statCards.map((c) => (
          <div
            key={c.label}
            className={`p-4 rounded-2xl ${c.bg} border ${c.border} shadow-sm transition-all hover:scale-[1.02]`}
          >
            <p className="text-[11px] font-semibold text-slate-600 truncate">{c.label}</p>
            <p className={`text-2xl font-black ${c.color} mt-1`}>{c.count}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {total > 0 ? `${((c.count / total) * 100).toFixed(1)}%` : '0.0%'}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <PieIcon className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Waste Category Distribution</h3>
          </div>
          <CategoryPieChart categoryCounts={counts} />
        </div>

        {/* Bar Chart Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Category Comparison</h3>
          </div>
          <TrendsBarChart categoryCounts={counts} />
        </div>
      </div>

      {/* Recent Activity Mini-Feed */}
      {analytics?.recent_activity?.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">Recent Classifications</h3>
            </div>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              View Full History →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {analytics.recent_activity.slice(0, 5).map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-medium text-slate-900 truncate max-w-xs">{r.image_name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-emerald-700">{r.predicted_class}</span>
                  <span className="text-slate-400 font-medium">({(r.confidence * 100).toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

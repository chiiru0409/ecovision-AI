import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  X, 
  AlertCircle,
  FileText
} from 'lucide-react';

const CATEGORY_COLORS = {
  Cardboard: 'bg-amber-100 text-amber-800 border-amber-200',
  Glass: 'bg-teal-100 text-teal-800 border-teal-200',
  Metal: 'bg-slate-200 text-slate-800 border-slate-300',
  Organic: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Paper: 'bg-blue-100 text-blue-800 border-blue-200',
  Plastic: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  Trash: 'bg-rose-100 text-rose-800 border-rose-200',
};

export default function HistoryTable({
  items = [],
  onDelete,
  onRefresh,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
  loading
}) {
  const [selectedRecord, setSelectedRecord] = useState(null);

  const categories = ['All', 'Cardboard', 'Glass', 'Metal', 'Organic', 'Paper', 'Plastic', 'Trash'];

  const formatDate = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full">
      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by filename or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 mr-1 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <Sparkles className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Fetching classification records...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No Classification History Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || categoryFilter !== 'All'
                ? 'No items match your active filters. Try clearing search keywords or filters.'
                : 'No waste items have been classified yet. Upload an image to start recording analytics.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Image / File</th>
                  <th className="py-3.5 px-4">Predicted Category</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Model</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {items.map((item) => {
                  const badgeStyle = CATEGORY_COLORS[item.predicted_class] || 'bg-slate-100 text-slate-700';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="py-4 px-6 font-medium text-slate-900 flex items-center space-x-2">
                        <span className="truncate max-w-[200px]" title={item.image_name}>
                          {item.image_name}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badgeStyle}`}>
                          {item.predicted_class}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-700">
                        {item.confidence_percentage}%
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-400 font-mono">
                        {item.model_version}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => setSelectedRecord(item)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                          title="View Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Classification Details</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">File Name</span>
                <p className="font-semibold text-slate-800 break-all">{selectedRecord.image_name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Category</span>
                  <p className="font-bold text-emerald-700 text-base">{selectedRecord.predicted_class}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Confidence</span>
                  <p className="font-bold text-slate-800 text-base">{selectedRecord.confidence_percentage}%</p>
                </div>
              </div>

              {selectedRecord.top_predictions && (
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase mb-2 block">Top Predictions</span>
                  <div className="space-y-1.5">
                    {selectedRecord.top_predictions.map((p, idx) => (
                      <div key={p.category} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-50">
                        <span className="font-medium text-slate-700">{idx + 1}. {p.category}</span>
                        <span className="font-semibold text-emerald-600">{p.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Timestamp</span>
                <p className="text-xs text-slate-600">{formatDate(selectedRecord.created_at)}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Record ID</span>
                <p className="text-[11px] font-mono text-slate-400 break-all">{selectedRecord.id}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

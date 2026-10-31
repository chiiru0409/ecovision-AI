import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  BookOpen, 
  Recycle, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Globe2, 
  Leaf, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';

const TIPS = [
  {
    title: 'Rinse Before Recycling',
    desc: 'Even minor liquid or food grease contamination can render an entire batch of paper, cardboard, or plastic unrecyclable.',
    icon: '🚿',
  },
  {
    title: 'Keep Caps on Bottles',
    desc: 'Leaving plastic caps screwed securely on bottles ensures the cap is captured during automated MRF optical sorting.',
    icon: '🧴',
  },
  {
    title: 'No Plastic Bags in Curbside Bins',
    desc: 'Soft grocery bags tangle in automated spinning sorting gears. Return bags to dedicated supermarket drop-off receptacles.',
    icon: '🛍️',
  },
  {
    title: 'Compost Organics Promptly',
    desc: 'Organics decaying anaerobically in landfills release methane. Aerobic composting creates nutrient-dense garden humus.',
    icon: '🌱',
  },
];

export default function GuidePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data.categories || []);
        if (data.categories?.length > 0) {
          setActiveCategory(data.categories[0]);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200 mb-3">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>Circular Economy Encyclopedia</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Educational Waste & Recycling Guide
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Master the rules of proper waste segregation. Learn how small sorting decisions yield significant global environmental conservation.
        </p>
      </div>

      {/* Reduction Tips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {TIPS.map((tip) => (
          <div
            key={tip.title}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-300 transition-all hover:shadow-soft"
          >
            <div className="text-2xl mb-2">{tip.icon}</div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">{tip.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </div>

      {/* Category Deep Dive Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Category Selection Tabs */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Select Category Stream
          </h3>
          {categories.map((cat) => {
            const isSelected = activeCategory?.category_name === cat.category_name;
            return (
              <button
                key={cat.category_name}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />
                  <span className="text-sm">{cat.category_name}</span>
                </div>
                <span className="text-xs opacity-75">Explore →</span>
              </button>
            );
          })}
        </div>

        {/* Right Detail Card */}
        {activeCategory && (
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl border border-emerald-100">
                {activeCategory.category_name[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{activeCategory.category_name} Stream</h2>
                <p className="text-xs text-slate-500">Official Municipal & Environmental Specifications</p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Material Identification
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                  {activeCategory.description}
                </p>
              </div>

              {/* Disposal & Recycling */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                    <Trash2 className="w-4 h-4 text-emerald-600" />
                    <span>Disposal Guidelines</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {activeCategory.disposal_method}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
                  <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                    <Recycle className="w-4 h-4 text-teal-600" />
                    <span>Recycling Instructions</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {activeCategory.recycling_instructions}
                  </p>
                </div>
              </div>

              {/* Environmental Benefit */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-start space-x-3.5 shadow-md">
                <Globe2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    Conservation & Lifecycle Impact
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {activeCategory.environmental_benefit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

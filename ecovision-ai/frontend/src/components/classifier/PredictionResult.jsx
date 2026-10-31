import React from 'react';
import { 
  CheckCircle2, 
  Recycle, 
  Trash2, 
  Leaf, 
  HelpCircle, 
  ArrowRight, 
  ShieldAlert, 
  RotateCcw,
  Sparkles,
  BarChart,
  Globe2
} from 'lucide-react';

const CATEGORY_THEMES = {
  Cardboard: {
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    barColor: 'bg-amber-500',
    accentBorder: 'border-amber-400',
    icon: PackageIcon,
  },
  Glass: {
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
    barColor: 'bg-teal-500',
    accentBorder: 'border-teal-400',
    icon: GlassIcon,
  },
  Metal: {
    badgeBg: 'bg-slate-200 text-slate-800 border-slate-300',
    barColor: 'bg-slate-600',
    accentBorder: 'border-slate-400',
    icon: MetalIcon,
  },
  Organic: {
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    barColor: 'bg-emerald-500',
    accentBorder: 'border-emerald-400',
    icon: Leaf,
  },
  Paper: {
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    barColor: 'bg-blue-500',
    accentBorder: 'border-blue-400',
    icon: FileTextIcon,
  },
  Plastic: {
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    barColor: 'bg-cyan-500',
    accentBorder: 'border-cyan-400',
    icon: PlasticIcon,
  },
  Trash: {
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    barColor: 'bg-rose-500',
    accentBorder: 'border-rose-400',
    icon: Trash2,
  },
};

function PackageIcon(props) {
  return <Recycle {...props} />;
}
function GlassIcon(props) {
  return <Sparkles {...props} />;
}
function MetalIcon(props) {
  return <Recycle {...props} />;
}
function FileTextIcon(props) {
  return <Recycle {...props} />;
}
function PlasticIcon(props) {
  return <Recycle {...props} />;
}

export default function PredictionResult({ result, onReset }) {
  if (!result) return null;

  const categoryName = result.predicted_class || 'Unknown';
  const theme = CATEGORY_THEMES[categoryName] || {
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    barColor: 'bg-emerald-500',
    accentBorder: 'border-emerald-400',
    icon: Leaf,
  };
  const CategoryIcon = theme.icon;

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Classification Complete</span>
            <span>•</span>
            <span>Model {result.model_version}</span>
          </div>
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {categoryName}
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${theme.badgeBg}`}>
              {result.confidence_percentage}% Match
            </span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Classify Another</span>
        </button>
      </div>

      {/* Main Grid: Probability Bar & Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
        {/* Confidence & Alternative Candidates */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
              <BarChart className="w-4 h-4 text-emerald-600" />
              <span>Candidate Probabilities</span>
            </span>
          </div>

          <div className="space-y-3.5 mt-2">
            {result.top_predictions?.map((item, idx) => (
              <div key={item.category}>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className={`${idx === 0 ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                    {idx + 1}. {item.category}
                  </span>
                  <span className={`${idx === 0 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                    {item.percentage}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0 ? theme.barColor : 'bg-slate-400'
                    }`}
                    style={{ width: `${Math.max(item.percentage, 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200/60 text-[11px] text-slate-500">
            Computed by MobileNetV2 Softmax layer with ImageNet transfer weights.
          </div>
        </div>

        {/* Actionable Recycling & Disposal Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          {/* Material Description */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>What Is It?</span>
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {result.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Disposal Method */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                <Trash2 className="w-4 h-4 text-emerald-600" />
                <span>Recommended Disposal</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {result.disposal_method}
              </p>
            </div>

            {/* Recycling Instructions */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                <Recycle className="w-4 h-4 text-emerald-600" />
                <span>Recycling Protocol</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {result.recycling_instructions}
              </p>
            </div>
          </div>

          {/* Environmental Benefit */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-start space-x-3">
            <Globe2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider mb-0.5">
                Environmental & Circular Impact
              </h4>
              <p className="text-xs text-teal-950/80 leading-relaxed">
                {result.environmental_benefit}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

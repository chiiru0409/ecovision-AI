import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Recycle, 
  ShieldCheck, 
  Cpu, 
  BarChart3, 
  CheckCircle2, 
  UploadCloud, 
  Zap, 
  Globe2,
  Package,
  Layers,
  Leaf
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Cardboard', desc: 'Packaging cartons, corrugated boxes, crates', color: 'from-amber-500 to-amber-600', icon: '📦' },
  { name: 'Glass', desc: 'Bottles, culinary jars, beverage glassware', color: 'from-teal-500 to-teal-600', icon: '🍾' },
  { name: 'Metal', desc: 'Aluminum soda cans, tin cans, foil trays', color: 'from-slate-500 to-slate-700', icon: '🥫' },
  { name: 'Organic', desc: 'Fruit peels, vegetable trimmings, food scraps', color: 'from-emerald-500 to-emerald-700', icon: '🍎' },
  { name: 'Paper', desc: 'Office paper, magazines, clean newspapers', color: 'from-blue-500 to-blue-600', icon: '📄' },
  { name: 'Plastic', desc: 'PET bottles, HDPE jugs, food containers', color: 'from-cyan-500 to-cyan-600', icon: '🧴' },
  { name: 'Trash', desc: 'Composite packaging, residuals, mixed refuse', color: 'from-rose-500 to-rose-700', icon: '🗑️' },
];

const STEPS = [
  {
    step: '01',
    title: 'Upload Waste Photo',
    desc: 'Capture or drag-and-drop any waste item photo via web or mobile device.',
    icon: UploadCloud,
  },
  {
    step: '02',
    title: 'MobileNetV2 Deep Analysis',
    desc: 'Our neural network extracts spatial visual features and classifies into 7 streams with confidence ratings.',
    icon: Cpu,
  },
  {
    step: '03',
    title: 'Actionable Disposal Guidance',
    desc: 'Receive immediate recycling procedures, correct bin assignment, and environmental impact telemetry.',
    icon: Recycle,
  },
];

export default function LandingPage({ setActiveTab }) {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Soft background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-100/60 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Mini-Capstone Project • Computer Vision & Sustainability</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Turn Waste Into a <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
              Smarter Tomorrow.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Improper waste segregation pollutes ecosystems and overburdens landfills. EcoVision AI harnesses deep learning to instantly identify 7 waste streams, provide precise disposal steps, and drive a data-backed circular economy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('classifier')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] text-base"
            >
              <UploadCloud className="w-5 h-5" />
              <span>Upload Waste Image</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold border border-slate-200 shadow-sm transition-all hover:scale-[1.02] text-base"
            >
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>View Live Analytics</span>
            </button>
          </div>

          {/* Quick Metrics Banner */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-3xl bg-white/80 border border-slate-200/80 shadow-soft backdrop-blur-md">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">7</p>
              <p className="text-xs font-medium text-slate-500">Waste Categories</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">MobileNetV2</p>
              <p className="text-xs font-medium text-slate-500">Neural Backbone</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-600">&lt;100ms</p>
              <p className="text-xs font-medium text-slate-500">Inference Latency</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</p>
              <p className="text-xs font-medium text-slate-500">Data-Backed Pipeline</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Streamlined Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              How EcoVision AI Works
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              From raw image pixels to clean segregation guidelines in three instantaneous steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="relative p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all hover:shadow-soft group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-slate-200/60 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-300 font-mono">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supported Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Computer Vision Spectrum
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Supported 7 Waste Categories
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Trained on real-world packaging, containers, and organic matter with distinct visual signatures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-300 transition-all hover:shadow-soft"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-slate-900 text-base">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cat.desc}</p>
              </div>
            ))}

            {/* CTA Card in the grid */}
            <div 
              onClick={() => setActiveTab('classifier')}
              className="p-5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex flex-col justify-between cursor-pointer hover:shadow-lg transition-transform hover:scale-[1.02]"
            >
              <div>
                <Sparkles className="w-6 h-6 mb-2 text-emerald-200" />
                <h3 className="font-bold text-base">Test Any Waste Item</h3>
                <p className="text-xs text-emerald-100 mt-1">Try our live neural model with instant classification.</p>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-white mt-4">
                <span>Launch Classifier</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact Banner */}
      <section className="py-14 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl mx-4 sm:mx-8 mb-16 px-6 sm:px-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Circular Economy Telemetry
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-white">
              Every segregated item protects our planet.
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              Recycling 1 ton of aluminum saves 95% energy. Diverting organic waste stops methane emissions. EcoVision AI provides the real-time knowledge needed for effective sustainability.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('guide')}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm whitespace-nowrap shadow-md transition-all hover:scale-105"
          >
            Explore Waste Encyclopedia
          </button>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { Leaf, ShieldCheck, Heart, Github, Globe, RefreshCw } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  const categories = ['Cardboard', 'Glass', 'Metal', 'Organic', 'Paper', 'Plastic', 'Trash'];

  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 tracking-tight text-lg">EcoVision AI</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              AI-driven waste classification platform empowering households, businesses, and cities with computer vision to accelerate circular sustainability.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>MobileNetV2 Deep Learning Architecture</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button onClick={() => setActiveTab('classifier')} className="hover:text-emerald-600 transition-colors">
                  AI Waste Classifier
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('analytics')} className="hover:text-emerald-600 transition-colors">
                  Database Analytics
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('history')} className="hover:text-emerald-600 transition-colors">
                  Classification Log
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('guide')} className="hover:text-emerald-600 transition-colors">
                  Waste Segregation Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">Classified Streams</h4>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <span
                  key={c}
                  className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Technology & Environmental Impact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">Sustainable Impact</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Proper waste categorization prevents contamination in recycling streams, reducing municipal landfill loads and lowering carbon footprints.
            </p>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center space-x-3">
              <RefreshCw className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="text-xs text-emerald-900 font-medium">
                100% Data-Driven Model Predictions
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EcoVision AI. Mini-Capstone Project.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for a greener planet</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

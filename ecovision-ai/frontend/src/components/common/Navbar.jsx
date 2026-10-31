import React, { useState, useEffect } from 'react';
import { Leaf, BarChart3, History, BookOpen, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function Navbar({ activeTab, setActiveTab }) {
  const [backendStatus, setBackendStatus] = useState({ online: false, modelLoaded: false, checking: true });

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const data = await api.getHealth();
        setBackendStatus({ online: true, modelLoaded: data.model_loaded, checking: false });
      } catch (err) {
        setBackendStatus({ online: false, modelLoaded: false, checking: false });
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Leaf },
    { id: 'classifier', label: 'AI Classifier', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'guide', label: 'Waste Guide', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">EcoVision</span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  AI 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Intelligent Waste Classification</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-emerald-700 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* System Telemetry & CTA */}
          <div className="flex items-center space-x-3">
            {/* Health Status Pill */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium">
              <span className={`w-2 h-2 rounded-full ${backendStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-slate-600">
                {backendStatus.checking ? 'Connecting...' : backendStatus.online ? 'API Online' : 'Backend Standby'}
              </span>
            </div>

            {/* Launch Classifier CTA */}
            {activeTab !== 'classifier' && (
              <button
                onClick={() => setActiveTab('classifier')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Classify Now</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-200/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

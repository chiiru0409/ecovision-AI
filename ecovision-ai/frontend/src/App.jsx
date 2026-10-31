import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LandingPage from './pages/LandingPage';
import ClassifierPage from './pages/ClassifierPage';
import AnalyticsPage from './pages/AnalyticsPage';
import HistoryPage from './pages/HistoryPage';
import GuidePage from './pages/GuidePage';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-grow">
        {activeTab === 'landing' && <LandingPage setActiveTab={setActiveTab} />}
        {activeTab === 'classifier' && <ClassifierPage setActiveTab={setActiveTab} />}
        {activeTab === 'analytics' && <AnalyticsPage setActiveTab={setActiveTab} />}
        {activeTab === 'history' && <HistoryPage />}
        {activeTab === 'guide' && <GuidePage />}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

import React, { useState } from 'react';
import Dropzone from '../components/classifier/Dropzone';
import PredictionResult from '../components/classifier/PredictionResult';
import { api } from '../services/api';
import { Sparkles, ShieldCheck, Cpu, AlertCircle } from 'lucide-react';

export default function ClassifierPage({ setActiveTab }) {
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleClassify = async (file) => {
    setIsClassifying(true);
    setError('');
    try {
      const data = await api.classifyImage(file);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to process waste image. Please verify server connection.');
    } finally {
      setIsClassifying(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
          <Cpu className="w-3.5 h-3.5 text-emerald-600" />
          <span>MobileNetV2 Neural Vision Workstation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Waste Classification Engine
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto mt-2">
          Upload or drag-and-drop a photo of any waste item. Our deep convolutional network computes categorical probability distributions and returns immediate disposal protocols.
        </p>
      </div>

      {/* Main Workstation */}
      <div className="space-y-6">
        {result ? (
          <PredictionResult result={result} onReset={handleReset} />
        ) : (
          <Dropzone onClassify={handleClassify} isClassifying={isClassifying} />
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Classification Error</p>
              <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Technical Guarantee Badge */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Real-time transfer learning inference • Top-1 & Top-3 softmax confidence</span>
          </div>
          <button
            onClick={() => setActiveTab('analytics')}
            className="text-emerald-700 hover:text-emerald-800 font-semibold"
          >
            Inspect Global Analytics →
          </button>
        </div>
      </div>
    </div>
  );
}

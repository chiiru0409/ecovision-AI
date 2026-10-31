import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Sparkles, AlertCircle, Check, Loader2 } from 'lucide-react';

const SAMPLE_IMAGES = [
  { name: 'Cardboard Box', category: 'Cardboard', file: '/src/assets/samples/cardboard_sample.jpg' },
  { name: 'Glass Bottle', category: 'Glass', file: '/src/assets/samples/glass_sample.jpg' },
  { name: 'Aluminum Can', category: 'Metal', file: '/src/assets/samples/metal_sample.jpg' },
  { name: 'Organic Waste', category: 'Organic', file: '/src/assets/samples/organic_sample.jpg' },
  { name: 'Paper Stack', category: 'Paper', file: '/src/assets/samples/paper_sample.jpg' },
  { name: 'Plastic Bottle', category: 'Plastic', file: '/src/assets/samples/plastic_sample.jpg' },
  { name: 'Mixed Trash', category: 'Trash', file: '/src/assets/samples/trash_sample.jpg' },
];

export default function Dropzone({ onClassify, isClassifying }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef(null);

  const validateAndSetFile = (file) => {
    setErrorMessage('');
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a supported image format (JPEG, PNG, WEBP, BMP).');
      return;
    }

    const maxSize = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSize) {
      setErrorMessage('File size exceeds the 15 MB limit. Please select a smaller image.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setErrorMessage('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleSelectSample = async (sample) => {
    try {
      const res = await fetch(sample.file);
      const blob = await res.blob();
      const file = new File([blob], `${sample.category.toLowerCase()}_sample.jpg`, { type: 'image/jpeg' });
      validateAndSetFile(file);
    } catch (err) {
      setErrorMessage('Unable to load sample image. Please upload a local file.');
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setErrorMessage('Please select or drop an image first.');
      return;
    }
    onClassify(selectedFile);
  };

  return (
    <div className="w-full">
      {/* Upload Box Container */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all ${
          dragActive
            ? 'border-emerald-500 bg-emerald-50/60 shadow-lg shadow-emerald-500/10'
            : 'border-slate-300 hover:border-emerald-400 bg-white/70'
        } ${previewUrl ? 'border-solid border-emerald-400/80 bg-white' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/bmp"
          onChange={handleChange}
          className="hidden"
          id="waste-file-input"
        />

        {previewUrl ? (
          /* Preview State */
          <div className="flex flex-col items-center">
            <div className="relative group max-w-sm rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <img
                src={previewUrl}
                alt="Waste Preview"
                className="w-full h-64 object-cover object-center"
              />
              <button
                onClick={handleClear}
                disabled={isClassifying}
                title="Remove image"
                className="absolute top-3 right-3 p-2 bg-slate-900/70 hover:bg-rose-600 text-white rounded-full transition-colors backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-slate-800">{selectedFile?.name}</p>
              <p className="text-xs text-slate-500">
                {(selectedFile?.size / 1024).toFixed(1)} KB • {selectedFile?.type}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center space-x-3">
              <button
                onClick={handleClear}
                disabled={isClassifying}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition-colors disabled:opacity-50"
              >
                Change Image
              </button>

              <button
                onClick={handleSubmit}
                disabled={isClassifying}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {isClassifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing Neural Features...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Classify Waste</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Drag & Drop Prompt */
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Drag and drop your waste image here
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              Upload a clear photo of packaging, containers, food scraps, or trash. Supports JPEG, PNG, WEBP up to 15 MB.
            </p>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-md transition-all hover:scale-[1.02]"
            >
              Browse Files
            </button>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Quick 1-Click Samples Selector */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Or test instantly with sample images:
          </span>
          <span className="text-xs text-emerald-600 font-medium">1-Click Neural Test</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.category}
              type="button"
              onClick={() => handleSelectSample(sample)}
              disabled={isClassifying}
              className="group p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left transition-all hover:shadow-sm"
            >
              <div className="h-14 rounded-lg bg-slate-100 overflow-hidden mb-1.5 relative border border-slate-200/50">
                <img
                  src={sample.file}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-800 truncate">{sample.category}</p>
              <p className="text-[10px] text-slate-400 truncate">{sample.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

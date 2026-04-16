import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { UploadCloud, FileText, X, CheckCircle2, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError('');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to backend (http://localhost:5000). Please start backend service and try again.');
      } else {
        setError(err.response?.data?.message || err.message || 'Error uploading file.');
      }
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 lg:py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-2xl mb-6 shadow-sm border border-blue-100">
          <Sparkles className="h-6 w-6 mr-2" />
          <span className="font-bold tracking-wide">AI Extraction Ready</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Decode your health.</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Upload any PDF or image of your blood tests, CBC reports, or general health checkups. Our Gemini-powered AI will instantly extract your vitals and generate a personalized clinical plan.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-12 relative overflow-hidden"
      >
        {/* Decorative corner blur */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleUpload}>
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.label 
                key="dropzone"
                htmlFor="report-upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-80 rounded-3xl border-3 border-dashed transition-all cursor-pointer relative ${
                  isDragActive 
                    ? 'border-primary bg-blue-50/50 scale-[1.02]' 
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <input id="report-upload" type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileChange} />
                <div className="p-5 bg-white rounded-full shadow-sm mb-4 pointer-events-none">
                  <UploadCloud className={`h-10 w-10 ${isDragActive ? 'text-primary animate-bounce' : 'text-slate-400'}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2 pointer-events-none">Drag & drop your report here</h3>
                <p className="text-sm text-slate-500 font-medium pointer-events-none">or click to browse from your computer</p>
                <div className="mt-6 flex gap-3 text-xs text-slate-400 font-semibold px-4 py-2 bg-white rounded-lg border border-slate-100 shadow-sm pointer-events-none">
                  <span>PDF, JPG, PNG</span>
                  <span>•</span>
                  <span>Max 10MB</span>
                </div>
              </motion.label>
            ) : (
              <motion.div 
                key="file-preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-80 flex flex-col items-center justify-center border border-slate-200 rounded-3xl bg-slate-50 p-8 text-center"
              >
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-2xl shadow-md flex items-center justify-center border border-slate-100 mb-6">
                     <FileText className="h-10 w-10 text-primary" />
                  </div>
                  {!isUploading && (
                    <button 
                      type="button" 
                      onClick={removeFile}
                      className="absolute -top-3 -right-3 p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 hover:scale-110 transition-transform"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-800 line-clamp-1 break-all max-w-[80%]">{file.name}</h3>
                <p className="text-sm text-slate-500 font-medium mt-2">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis</p>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 font-medium mt-6 text-center">
              {error}
            </motion.p>
          )}

          <div className="mt-8">
            <button 
              type="submit" 
              disabled={isUploading || !file} 
              className={`w-full relative flex justify-center items-center py-5 px-6 border border-transparent text-lg font-bold rounded-2xl text-white transition-all overflow-hidden ${
                isUploading ? 'bg-slate-800 cursor-not-allowed' : 'bg-primary hover:bg-secondary shadow-xl shadow-primary/30 hover:-translate-y-1'
              } disabled:opacity-80`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin w-6 h-6 mr-3 text-blue-400" />
                  <span>Extracting health intelligence...</span>
                </>
              ) : (
                <>
                  <span>Initialize AI Analysis</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
